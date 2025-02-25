import express from "express"
import { verifyToken } from "../middleware/verifyToken.js"
import { 
    getReposFiles, 
    createRepo, 
    deleteRepo, 
    getReposData, 
    checkRepoName, 
    changeSSHKey,
    getSshKey,
    verifyReponame,
    getReposBranches,
    getRepoRawData,
    getReposPermission,
    updateRepoPermission,
    getAllUsers,
    getRepoMember,
    getRepoType,
    changeRepoVisibility
} from "../controllers/repo.controller.js"

const router = express.Router();

router.get('/username/:username/repos/:repo/branches/:branch/files', getReposFiles)
router.post('/create-repo', verifyToken, createRepo)
router.post('/delete-repo', verifyToken, deleteRepo)
router.get('/get-repos-data', verifyToken, getReposData)
router.get('/checkRepoName', verifyToken, checkRepoName)
router.post('/changeSSHKey', verifyToken, changeSSHKey)
router.get('/getSshKey', verifyToken, getSshKey)
router.get('/isValidReponame', verifyReponame)
router.get('/get-repos-branches', getReposBranches)
router.get('/getFileRawData', getRepoRawData)
router.get('/getReposPermission', verifyToken, getReposPermission)
router.post('/updateRepoPermission', verifyToken, updateRepoPermission)
router.get('/getAllUsers', getAllUsers)
router.get('/repoMember', getRepoMember)
router.get('/getRepoType', getRepoType)
router.post('/changeRepoVisibility', verifyToken, changeRepoVisibility)

export default router;