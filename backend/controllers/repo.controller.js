import { Client } from 'ssh2'
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'

import { User } from "../model/user.model.js"
import { Repo } from "../model/repo.model.js"
import { runCommandOnGitServer } from '../aws/awsFunctions.js';

const gitoliteConfFilePath = path.join(process.env.GITOLITE_ADMIN_PATH, 'conf/gitolite.conf')

const connectToEC2 = (host, privateKey, username = 'git') => {
    return new Promise((resolve, reject) => {
        const conn = new Client();
        conn
            .on('ready', () => resolve(conn))
            .on('error', (err) => reject(err))
            .connect({
                host,
                port: 22,
                username,
                privateKey,
            });
    });
};

const executeCommand = (conn, command) => {
    return new Promise((resolve, reject) => {
        conn.exec(command, (err, stream) => {
            if (err) {
                console.log(err)
                reject(err);
            }

            let data = '';
            stream
                .on('data', (chunk) => (data += chunk.toString()))
                .on('close', () => {
                    console.log("On close data: ", data)
                    resolve(data)
                })
                .stderr.on('data', (errData) => reject(errData));
        });
    });
};

// Convert permissions to `gitolite.conf` format
function convertPermissionsToGitoliteFormat(permissions) {
    const permissionMap = {};
    permissions.forEach(({ username, access, branch }) => {
        const key = branch ? `${access} ${branch}` : access;
        if (!permissionMap[key]) {
            permissionMap[key] = [];
        }
        permissionMap[key].push(username);
    });

    return Object.entries(permissionMap).map(
        ([access, users]) => `    ${access.padEnd(10)}= ${users.join(' ')}`
    );
}

// Update `gitolite.conf` file
function updateGitoliteConf(repoName, formattedPermissions) {
    fs.readFile(gitoliteConfFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        const lines = data.split('\n');
        let inRepoSection = false;
        let repoUpdated = false;

        const updatedLines = lines.map(line => {
            if (line.startsWith(`repo ${repoName}`)) {
                inRepoSection = true;

                // if formattedPermission erray is empty mean, remove the repo section
                if (formattedPermissions.length == 0) return null;
                return line; // Keep repo header
            }

            if (inRepoSection) {
                // delete last line if it empty and want to delete the repo section
                if (line.trim() === '' && formattedPermissions.length == 0) {
                    inRepoSection = false;
                    repoUpdated = true;
                    return null;
                }

                if (line.trim() === '' || line.startsWith('repo ')) {
                    inRepoSection = false; // End of repo section
                    repoUpdated = true;
                    return [...formattedPermissions, ''].join('\n'); // Insert updated permissions
                }
                return null; // Remove existing permissions
            }

            return line;
        });

        // Add a new section if repo doesn't exist
        if (!repoUpdated) {
            updatedLines.push(`repo ${repoName}`);
            updatedLines.push(...formattedPermissions, '');
        }

        // Write back the file
        fs.writeFile(gitoliteConfFilePath, updatedLines.filter(line => line !== null).join('\n'), 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
            } else {
                console.log('Updated permissions for repository:', repoName);
            }
        });
    });
}

const saveAndPushGitoliteAdmin = async (message) => {
    const command = `git add . && git commit -m "${message}" && git push origin master`;

    try {
        exec(command, { cwd: process.env.GITOLITE_ADMIN_PATH });
    } catch (err) {
        throw err
    }
}

async function generateTree(url, id) {
    const responseDataUrl = await axios.get(url);

    const $ = cheerio.load(responseDataUrl.data);
    const fileTree = [];

    const rows = $('table.tree tr').toArray(); // Convert Cheerio object to array for iteration

    let index = 1;
    for (const element of rows) {
        const mode = $(element).find('td.mode').text().trim();
        const nameTag = $(element).find('td.list a');
        const name = nameTag.text().trim();
        const href = nameTag.attr('href');
        const size = $(element).find('td.size').text().trim();
        const type = mode.startsWith('d') ? 'directory' : 'file' // if file type is start with 'd' it's a directory else it's a file
        let fileId = id == '' ? index.toString() : [id, index].join('.')

        if (name === '..') {
            continue;
        }

        if (type == 'file') {
            fileTree.push({
                id: fileId,
                mode: mode,
                label: name,
                fileType: type,
                size: size,
                link: href,
            });
        } else {
            const urlForChildren = `http://${process.env.GIT_SERVER_IP}/${href}`;
            const children = await generateTree(urlForChildren, fileId)

            fileTree.push({
                id: fileId,
                mode: mode,
                label: name,
                fileType: type,
                size: size,
                children: children
            });
        }

        index++;
    }

    return fileTree
}

export const getReposFiles = async (req, res) => {
    const username = req.params.username;
    const repo = req.params.repo;
    const branch = req.params.branch;
    // console.log(username, repo, branch)

    try {
        const url = `http://${process.env.GIT_SERVER_IP}/gitweb/?a=tree&p=${username}/${repo}&h=${branch}`
        const fileTree = await generateTree(url, '');

        return res.status(200).json({ success: true, filetree: fileTree })
    } catch (error) {
        console.log("error", error.message)
        return res.status(404).send({ success: false, message: "Fail to get repo data" });
    }
}

export const createRepo = async (req, res) => {
    const { reponame, description, repoType } = req.body;

    try {
        const userId = req.userId;

        const user_name = await User.findById(userId).select("username")

        const permissions = [{
            username: user_name.username,
            access: "RW+",
            branch: ""
        }]

        const isRepoExist = await Repo.findOne({ owner: user_name.username, name: reponame });

        if (isRepoExist) return res.status(400).json({ success: false, message: "Repo already exist" })

        const repo = new Repo({
            name: reponame,
            owner: user_name.username,
            description: description,
            type: repoType,
            permissions: permissions
        });

        await repo.save()

        const commandsToCreateRepo = [
            `sudo su - git <<EOF`,
            `cd /home/git/repositories/`,
            `mkdir -p ${user_name.username}/${reponame}`,
            `cd ${user_name.username}/${reponame}`,
            `git init --bare`,
            `EOF`,
        ]

        const commandsToDeleteRepo = [
            `sudo su - git <<EOF`,
            `cd /home/git/repositories/`,
            `cd ${user_name.username}`,
            `rm -r ${reponame}`,
            `EOF`,
        ]

        // create repo on git-server
        try {
            const response = await runCommandOnGitServer(commandsToCreateRepo);
            // console.log("Response: ", response)
        } catch (err) {
            // delete repo in database that was created
            await repo.deleteOne();
            // console.error('Error creating repo: ', err);
            return res.status(500).json({ success: false, message: "Error creating repo" });
        }

        // console.log(gitoliteConfFilePath)
        try {
            const repoName = `${user_name.username}/${reponame}`
            const formattedPermissions = convertPermissionsToGitoliteFormat(permissions);
            updateGitoliteConf(repoName, formattedPermissions)

            const commitMessage = `create repo ${repoName}`;
            await saveAndPushGitoliteAdmin(commitMessage)
        } catch (err) {
            // delete repo in database that was created
            await repo.deleteOne();

            // delete repo if error in saveAndPushGitoliteAdmin
            const response = await runCommandOnGitServer(commandsToDeleteRepo);
            // console.log("Response: ", response)

            // console.error('Error creating repo: ', err);
            return res.status(500).json({ success: false, message: "Error creating repo" });
        }

        res.status(200).json({ success: true, message: "Repo created successfully", repo });
    } catch (err) {
        console.log(err)
        res.status(400).json({ success: false, message: err.message })
    }
}

export const deleteRepo = async (req, res) => {
    const { reponame } = req.body;

    try {
        const userId = req.userId;

        const user_name = await User.findById(userId).select("username")
        console.log("Reponame: ", reponame, " username: ", user_name.username)

        const repo = await Repo.findOne({ owner: user_name.username, name: reponame });
        if (!repo) return res.status(400).json({ success: false, message: "Repo is not exist" })

        const commandsToDeleteRepo = [
            `sudo su - git <<EOF`,
            `cd /home/git/repositories/`,
            `cd ${user_name.username}`,
            `rm -r ${reponame}`,
            `EOF`,
        ]

        // delete repo in database that was created
        await Repo.deleteOne({ owner: user_name.username, name: reponame })

        const repoName = `${user_name.username}/${reponame}`
        // update gitolite config
        try {
            updateGitoliteConf(repoName, [])

            const commitMessage = `delete repo ${repoName}`;
            await saveAndPushGitoliteAdmin(commitMessage)
        } catch (err) {
            const formattedPermissions = convertPermissionsToGitoliteFormat(repo.permissions);
            updateGitoliteConf(repoName, formattedPermissions)

            const recoverDeletedRepo = new Repo({
                name: repo.name,
                owner: repo.owner,
                type: repo.type,
                description: repo.description,
                permissions: repo.permissions
            })
            await recoverDeletedRepo.save()
            // console.error('Error creating repo: ', err);
            return res.status(500).json({ success: false, message: "Error deleting repo" });
        }

        // create repo on git-server
        try {
            const response = await runCommandOnGitServer(commandsToDeleteRepo);
            // console.log("Response: ", response)

        } catch (err) {
            const formattedPermissions = convertPermissionsToGitoliteFormat(repo.permissions);
            updateGitoliteConf(repoName, formattedPermissions)

            const commitMessage = `back to deleted permission repo ${repoName}`;
            await saveAndPushGitoliteAdmin(commitMessage)

            const recoverDeletedRepo = new Repo({
                name: repo.name,
                owner: repo.owner,
                type: repo.type,
                description: repo.description,
                permissions: repo.permissions
            })
            await recoverDeletedRepo.save()
            // console.error('Error creating repo: ', err);
            return res.status(500).json({ success: false, message: "Error deleting repo" });
        }

        res.status(200).json({ success: true, message: "Repo deleted successfully" });
    } catch (err) {
        res.status(400).json({ success: false, message: "Error delete to repo" });
    }
}

export const getReposData = async (req, res) => {
    const { suser } = req.query;

    try {
        const user = await User.findById(req.userId).select("username");
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        }

        let repos;
        if (suser == user.username) {
            repos = await Repo.find({ owner: user.username }).select("name owner type description");
        } else {
            repos = await Repo.find({ owner: suser, type: "Public" }).select("name owner type description");
        }

        res.status(200).json({ success: true, repos })
    } catch (error) {
        console.log("Error in getting Repo Data", error)
        res.status(400).json({ success: false, message: error })
    }
}

export const checkRepoName = async (req, res) => {
    try {
        const { repoName } = req.query;
        const user = await User.findById(req.userId).select("username");
        const reponame = await Repo.findOne({ owner: user.username, name: repoName });

        if (reponame) {
            return res.status(400).json({ success: false, message: "Repo name already exists" })
        }
        res.status(200).json({ success: true, message: "Repo name is available" })
    } catch (error) {
        res.status(400).json({ success: false, message: error })
    }
}

export const changeSSHKey = async (req, res) => {
    try {
        const { newSSHKey } = req.body;
        const user = await User.findOneAndUpdate({ _id: req.userId }, { SSHKey: newSSHKey }).select("username");

        const gitolitekeydiruserpub = path.join(process.env.GITOLITE_ADMIN_PATH, `keydir/${user.username}.pub`)
        fs.writeFile(gitolitekeydiruserpub, newSSHKey, 'utf8', (err) => {
            if (err) {
                console.error('Error writing file: ', err);
            } else {
                console.log('Updated ssh key of: ', user.username);
            }
        })

        const commitMessage = `update sshkey of ${user.username}`;
        await saveAndPushGitoliteAdmin(commitMessage)

        res.status(200).json({ success: true, message: "SSH Key updated" })
    } catch (error) {
        res.status(400).json({ success: false, message: error })
    }
}

export const getSshKey = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("SSHKey");
        res.status(200).json({ success: true, SSHKey: user.SSHKey })
    } catch (error) {
        res.status(400).json({ success: false, message: error })
    }
}