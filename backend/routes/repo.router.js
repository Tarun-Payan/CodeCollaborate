import express from "express"
import { verifyToken } from "../middleware/verifyToken.js"
import { 
    getReposFiles, 
    createRepo, 
    deleteRepo, 
    getReposData, 
    checkRepoName, 
    changeSSHKey,
    getSshKey
} from "../controllers/repo.controller.js"

const router = express.Router();

router.get('/username/:username/repos/:repo/branches/:branch/files', getReposFiles)
router.post('/create-repo', verifyToken, createRepo)
router.post('/delete-repo', verifyToken, deleteRepo)
router.get('/get-repos-data', verifyToken, getReposData)
router.get('/checkRepoName', verifyToken, checkRepoName)
router.post('/changeSSHKey', verifyToken, changeSSHKey)
router.get('/getSshKey', verifyToken, getSshKey)

export default router;