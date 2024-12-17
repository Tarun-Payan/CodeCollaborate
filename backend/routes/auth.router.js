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
    checkUsername
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

export default router;