import express from "express"
import { 
    signup, 
    login, 
    logout, 
    sendVarificationEmail, 
    varifyEmail, 
    forgetPassword, 
    resetPassword,
    checkAuth,
    checkEmail,
    checkUsername,
    getimageurl,
    getUploadObjectUrl,
    updateProfile,
    isValidUsername,
    followUnfollow,
    userStat,
    userStatToDisplayFollowersFollowing,
    searchUsers,
    getFollowers,
    getFollowings
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js"

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth)

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

router.post("/sendVarificationEmail", sendVarificationEmail);
router.post("/varify-email", varifyEmail)
router.post("/forget-password", forgetPassword)
router.post("/reset-password", resetPassword)
router.post("/checkEmail", checkEmail)
router.post("/checkUsername", checkUsername)

router.get("/getimageurl", getimageurl)
router.get("/getUploadObjectUrl", getUploadObjectUrl)
router.post("/update-profile", verifyToken, updateProfile)

router.get("/isvalidusername", isValidUsername)
router.post("/users/follow-unfollow", verifyToken, followUnfollow)
router.get("/users/stat", userStat)
router.get("/users/get-users-follow-unfollow-data", verifyToken, userStatToDisplayFollowersFollowing)
router.get("/users/search-users", searchUsers)
router.get("/users/:userId/followers", getFollowers)
router.get("/users/:userId/followings", getFollowings)

export default router;