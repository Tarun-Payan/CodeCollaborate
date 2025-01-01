import bycript from "bcryptjs"
import { User } from "../model/user.model.js"
import { generateJWTToken } from "../utils/generateJWTToken.js";
import { sendEmailVarificationEmail, sendPasswordResetEmail, sendPasswordResetSuccessEmail, sendWelcomeEmail } from "../mailtrap/emails.js"
import { TempUser } from "../model/tempUser.model.js";
import crypto from "crypto";
import { getFileUrl, uploadObjectUrl, deleteS3BucketObject } from "../aws/awsFunctions.js";

export const signup = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const hashedPassword = await bycript.hash(password, 10)

        // Check user is varified or not
        const varifyUser = await TempUser.findOne({ email, isVarified: true })
        console.log(varifyUser)

        if (!varifyUser) {
            return res.status(400).json({ success: false, message: "User is not varified. Please check your email for varification link." })
        }

        // delete TempUser
        await TempUser.deleteOne({ email })

        // Check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." })
        }

        const user = new User({
            email: email,
            password: hashedPassword,
            username: username
        })

        // save user in database
        await user.save();

        // send welcome email
        await sendWelcomeEmail(email, "CodeCollaborate", username, `${process.env.CLIENT_URL}/`)

        // generate new token
        const token = generateJWTToken(res, user._id)

        res.status(200).json({
            success: true, message: "Successfully created account",
            user: {
                ...user._doc,
                password: undefined
            }
        })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find username in database and compare password
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid Username" })
        }

        const isValidUser = await bycript.compare(password, user.password)
        if (!isValidUser) {
            return res.status(400).json({ success: false, message: "Invalid password" })
        }

        // generate new token
        generateJWTToken(res, user._id)

        res.status(200).json({ success: true, message: "successfully loing to the acount", user: { ...user._doc, password: undefined } })

    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

export const logout = (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ success: true, message: "Successfully logout" })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

export const sendVarificationEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const varificationCode = Math.floor(100000 + Math.random() * 900000).toString()
        const user = await TempUser.findOne({ email })

        if (user) {
            // updateTempUser if user is already present by email
            const updateTempUser = await TempUser.findOneAndUpdate(
                { email }, // Find user by email
                {
                    $set: {
                        varificationToken: varificationCode,
                        varificationTokenExpiresAt: Date.now() + 60 * 60 * 1000 // 1 hover,
                    },
                },
            )
        }
        else {
            const tempUser = new TempUser({
                email: email,
                isVarified: false,
                varificationToken: varificationCode,
                varificationTokenExpiresAt: Date.now() + 60 * 60 * 1000 // 1 hover
            })

            await tempUser.save();
        }

        await sendEmailVarificationEmail(email, varificationCode)
        res.status(200).json({ success: true, message: "Successfully send varification email" })
    } catch (error) {
        console.log("Error sending email: ", error.message)
        res.status(400).json({ success: false, message: error.message })
    }
}

export const varifyEmail = async (req, res) => {
    try {
        const { email, varificationToken } = req.body;
        const user = await TempUser.findOne({ email })
        if (user && user.varificationToken === varificationToken && user.varificationTokenExpiresAt > Date.now()) {
            user.isVarified = true;
            user.varificationToken = undefined;
            user.varificationTokenExpiresAt = undefined;
            await user.save();

            res.status(200).json({ success: true, message: "Successfully varified email" })
        }
        else {
            res.status(400).json({ success: false, message: "Invalid varification token or expire" })
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error })
    }
}

export const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        // console.log(req.body)
        // console.log(email)

        const user = await User.findOne({ email });
        // console.log(user)

        if (!user) {
            res.status(400).json({ success: false, message: "Email not found" })
        }
        else {
            const resetToken = crypto.randomBytes(20).toString("hex");
            const resetTokenExpiresAt = Date.now() + 60 * 60 * 1000 // 

            user.resetPasswordToken = resetToken;
            user.resetPasswordExpiresAt = resetTokenExpiresAt

            await user.save();

            await sendPasswordResetEmail(email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)
            res.status(200).json({ success: true, message: "Successfully send reset password email" })
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error })
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { newPassword, token } = req.body;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            res.status(400).json({ success: false, message: "Invalid reset password token or expired" })
        }

        const hashedPassword = await bycript.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendPasswordResetSuccessEmail(user.email);
        res.status(200).json({ success: true, message: "Password reset successfully" })
    } catch (error) {
        res.status(400).json({ success: false, message: error })
    }
}

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        }

        res.status(200).json({ success: true, user })
    } catch (error) {
        console.log("Error in Checkauth", error)
        res.status(400).json({ success: false, message: error })
    }
}

export const checkEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: "Email already exists" })
        }
        res.status(200).json({ success: true, message: "Email is available" })
    } catch (error) {
        res.status(400).json({ success: false, message: error })
    }
}

export const checkUsername = async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ success: false, message: "Username already exists" })
        }
        res.status(200).json({ success: true, message: "Username is available" })
    } catch (error) {
        res.status(400).json({ success: false, message: error })
    }
}

export const getimageurl = async (req, res) => {
    const { key } = req.query;

    const url = await getFileUrl(key);

    if (url !== null) return res.status(200).json({ success: true, url })

    res.status(400).json({ success: false, message: "Error in generating url to getObject" })
}

export const getUploadObjectUrl = async (req, res) => {
    const { contentType, key } = req.query;
    const key2 = `${key}/image-${Date.now()}`

    const url = await uploadObjectUrl(contentType, key2)

    if (url !== null) return res.status(200).json({ success: true, url, key: key2 })

    res.status(400).json({ success: false, message: "Error in generating url to uploadObject" })
}

export const updateProfile = async (req, res) => {
    const { name, bio, profilePicture } = req.body;

    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" })

        if (profilePicture == null && user.profilePic != '') {
            // console.log("delete profilePicture")
            await deleteS3BucketObject(user.profilePic)
        }

        // delete profile image if profilePicture available
        if (profilePicture != '' && user.profilePic != '') {
            // console.log("Delete profilePicture2")
            await deleteS3BucketObject(user.profilePic)
        }

        user.name = name
        user.bio = bio
        profilePicture == null ? user.profilePic = '' : user.profilePic = profilePicture
        await user.save()
        res.status(200).json({ success: true, message: "Profile updated successfully" })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

export const isValidUsername = async (req, res) => {
    const { username } = req.query;
    const user = await User.findOne({ username }).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "Username not available" })
    res.status(200).json({ success: true, message: "Username available", user })
}

export const followUnfollow = async (req, res) => {
    try {
        const { followId } = req.body;
        const userId = req.userId;
        const user = await User.findById(userId);
        const followUser = await User.findById(followId);

        if (!user.following.includes(followId)) {
            // follow
            user.following.push(followId)
            followUser.followers.push(userId)
            await user.save()
            await followUser.save()
            res.status(200).json({ success: true, message: "User followed successfully" })
        } else {
            // unfollow
            user.following.pull(followId)
            followUser.followers.pull(userId)
            await user.save()
            await followUser.save()
            res.status(200).json({ success: true, message: "User unfollowed successfully" })
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

export const userStat = (req, res) => {
    const { userId } = req.query;
    User.findById(userId).then(user => {
        const followerCount = user.followers.length;
        const followingCount = user.following.length;

        res.status(200).json({ followerCount, followingCount });
    }).catch(error => {
        res.status(400).json({ success: false, message: error.message })
    })
}

export const userStatToDisplayFollowersFollowing = async (req, res) => {
    try {
        const user = req.userId;
        const { followId } = req.query;

        const followUser = await User.findById(followId, 'name username profilePic followers');

        if (!followUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if the userId exists in the followers array of followUser
        const isFollowed = followUser.followers.includes(user);

        res.status(200).json({
            success: true,
            name: followUser.name,
            username: followUser.username,
            profilePic: followUser.profilePic,
            isFollowed: isFollowed,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        const users = await User.find({
            $or: [{
                name: {
                    $regex: query,
                    $options: 'i'
                }
            }, {
                username: {
                    $regex: query,
                    $options: 'i'
                }
            }]
        }).select('name username profilePic')
        res.status(200).json(users);
    } catch {
        res.status(400).json({ success: false, message: error.message })
    }
}

export const getFollowers = async (req, res) => {
    try {
        const user = req.params.userId;
        const followers = await User.findById(user, 'followers');
        res.status(200).json(followers.followers);
    } catch(error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

export const getFollowings = async (req, res) => {
    try {
        const user = req.params.userId;
        const followings = await User.findById(user, 'following');
        res.status(200).json(followings.following);
    } catch(error){
        res.status(400).json({ success: false, message: error.message })
    }
}