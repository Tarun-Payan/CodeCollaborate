import React, { useState, useEffect, useRef } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import Editor from '@monaco-editor/react';
import { IoIosGitBranch } from 'react-icons/io'

import { useAuthStore } from '../store/useAuthStore'
import Navbar from '../components/Navbar'
import PageNotFound from './PageNotFound';
import FileTree from '../components/FileTree';
import CloneModal from '../modals/CloneModal';
import RepoSettings from '../components/RepoSettings';

import ReactLoading from 'react-loading'
import { motion } from 'framer-motion'
import axios from 'axios'
import { Files } from 'lucide-react';
import { Plus } from 'lucide-react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

const RepoPage = () => {
    const { username, reponame } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [tab, setTab] = useState("");

    const [isLoading, setIsLoading] = useState(false)
    const [isRepoTreeLoading, setIsRepoTreeLoading] = useState(false)
    const [isValidUsername, setIsValidUsername] = useState(true)
    const [branches, setBranches] = useState([])
    const [currentBranch, setCurrentBranch] = useState("main")

    const [repoTree, setRepoTree] = useState([])
    const [repoMembers, setRepoMembers] = useState([])
    const [repotype, setRepotype] = useState("")

    const [showCloneModal, setShowCloneModal] = useState(false)
    const closeCloneModal = () => setShowCloneModal(false);

    const nav = useRef()

    const { checkAuth, setSelectedUser, editorValue, editorLanguage, editorFilePath, authUser, selectedUser } = useAuthStore();

    useEffect(() => {
        checkAuth(setIsLoading, navigate, '', '/signup')
    }, [checkAuth, navigate])

    useEffect(() => {
        (async () => {
            setIsRepoTreeLoading(true)
            try {
                if (username != undefined) {
                    const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/isvalidusername`, { params: { username } })

                    await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/repo/isValidReponame`, { params: { username, reponame } })

                    const repoTreeResponse = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/repo/username/${username}/repos/${reponame}.git/branches/main/files`)
                    // console.log("repoTreeResponse: ", repoTreeResponse.data)
                    setRepoTree(repoTreeResponse.data.filetree)

                    setIsValidUsername(true)
                    setSelectedUser(response.data.user)

                    // get branches
                    const branchesResponse = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/repo/get-repos-branches`, { params: { username, repo: reponame } })
                    setBranches(branchesResponse.data.branches)

                    try{
                        // set repo members
                        const repoPerm = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/repo/repoMember`, { params: { username, reponame }})
                        let members = repoPerm?.data?.permissions.map(element => element.username)
                        setRepoMembers(members)
                    } catch(err){
                        setRepoMembers([])
                    }
                }
            } catch (error) {
                setIsValidUsername(false)
            } finally {
                setIsRepoTreeLoading(false)
            }
        })();
    }, [reponame, setSelectedUser, username])

    useEffect(() => {
        const url = new URLSearchParams(location.search);
        const tab = url.get("tab");
        if (tab) {
            setTab(tab);
        } else {
            setTab('')
        }
    }, [location])

    useEffect(() => {
        (async () => {
            try{
                const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/repo/getRepoType`, { params: { username,reponame } })
                setRepotype(response.data.repoType)
            } catch(err){
                console.log(err)
            }
        })()
    }, [reponame, username])
    

    // const { username, reponame } = useParams()
    // console.log(username, reponame)

    const changeBranch = async (e) => {
        // console.log("Change Branch function called")
        // console.log(e.target.value)
        setCurrentBranch(e.target.value)

        try {
            setIsRepoTreeLoading(true)
            const repoTreeResponse = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/repo/username/${username}/repos/${reponame}.git/branches/${e.target.value}/files`)
            // console.log("repoTreeResponse: ", repoTreeResponse.data)
            setRepoTree(repoTreeResponse.data.filetree)
        } catch (error) {
            console.log(error)
        } finally {
            setIsRepoTreeLoading(false)
        }
    }

    if (!isValidUsername && username) return <PageNotFound />

    if (repotype === 'Private' && !repoMembers.includes(selectedUser?.username) && repoMembers.length > 0) return <PageNotFound />

    return (
        <>
            {isLoading &&
                <ReactLoading
                    type={"bubbles"}
                    color={"#86ad8a"}
                    height={"64px"}
                    width={"64px"}
                    className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10"
                />
            }
            <motion.div
                className={`${isLoading ? "pointer-events-none" : "pointer-events-auto"} bg-slate-200 h-screen`}
                initial={{ filter: 'blur(0px)' }}
                animate={{ filter: isLoading ? 'blur(1.5px)' : 'blur(0px)' }}
                transition={{ duration: 0.5 }}
            >
                <div className='sticky top-0 z-10' ref={nav}>
                    <Navbar isRepoPage={true} />
                </div>

                {( tab == "settings" && authUser?.username == selectedUser?.username ) ? 
                    <div className={`h-[calc(100vh_-_${nav.current?.clientHeight}px)] h-[calc(100vh_-_69px)] overflow-y-auto`}>
                        <RepoSettings reponame={reponame} repotype={repotype} setRepotype={setRepotype}/>
                    </div>
                    :
                    <div className={`max-w-[1200px] h-[calc(100vh_-_${nav.current?.clientHeight}px)] h-[calc(100vh_-_69px)] mx-auto py-5 flex gap-2`}>
                        <div className='w-[300px] max-h-full overflow-y-auto'>
                            <div className='flex items-center justify-between gap-2'>
                                <h1 className='flex items-center font-semibold gap-1'><Files size={18} strokeWidth={2} />Files</h1>
                                <div className='flex'>
                                    <div className='flex items-center gap-1 bg-white rounded-md px-2 py-[2px] text-sm cursor-pointer hover:bg-gray-100 my-1'>
                                        <IoIosGitBranch size={16} />
                                        <select className='bg-transparent outline-none cursor-pointer w-full' onChange={changeBranch}>
                                            {branches?.map(branch => <option key={branch} value={branch} selected={currentBranch == branch}>{branch}</option>)}
                                        </select>
                                    </div>
                                    <Tooltip title="Code Clone">
                                        <IconButton className='cursor-pointer' size='small' onClick={() => setShowCloneModal(true)}>
                                            <Plus size={18} />
                                        </IconButton>
                                    </Tooltip>
                                    {showCloneModal && <CloneModal closeModal={closeCloneModal} username={username} reponame={reponame} />}
                                </div>
                            </div>
                            <div className='w-full h-[1px] bg-gray-400'></div>
                            {isRepoTreeLoading ?
                                <ReactLoading
                                    type={"bubbles"}
                                    color={"#86ad8a"}
                                    height={"60px"}
                                    width={"60px"}
                                    className="relative top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10"
                                />
                                : repoTree.length > 0 ? <FileTree className="w-full" repoTree={repoTree} /> : <div className='text-center text-gray-400 text-sm'>No files found</div>}
                        </div>

                        <div className="bg-slate-300 flex flex-col w-full">
                            <div className='ml-2'>
                                &gt;{editorFilePath}
                            </div>

                            {editorValue == '' ?
                                <div className='w-full h-full flex justify-center items-center bg-slate-100'>File not selected</div>
                                :
                                <Editor
                                    height="90vh"
                                    width={"100%"}
                                    value={editorValue}
                                    language={editorLanguage}
                                    options={{
                                        wordWrap: "on",
                                    }}
                                />
                            }
                        </div>
                    </div>}
            </motion.div>
        </>
    )
}

export default RepoPage