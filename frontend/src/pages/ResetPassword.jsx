// import React from 'react'
import LoginSignupOuterComponent from "../components/LoginSignupOuterComponent"
import LoginSignupInnerComponent from "../components/LoginSignupInnerComponent"
import { useState } from "react"
import Input from "../components/Input"
import { Lock } from "lucide-react"
import { motion } from "motion/react"
import PasswordStrengthBar from "react-password-strength-bar"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

const ResetPassword = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isValid, setIsValid] = useState(false)
    const [error, seterror] = useState('')
    
    const { token } = useParams();
	const navigate = useNavigate();

    const handleSubmit = async () => {
        setIsLoading(true)
        if (password !== confirmPassword) {
            seterror('Passwords do not match')
            setIsValid(false)
            setIsLoading(false)
            return;
        }

        try {
            // send reset password email
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/reset-password`, { newPassword: password, token: token })

            alert('Successfully reset your password and redirecting to login page')
            navigate('/login')  
            setIsValid(true)
            seterror('')
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            seterror('Error resetting password')
            if (isValid) setIsValid(false);
            return;
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <LoginSignupOuterComponent isLoading={isLoading}>
            <LoginSignupInnerComponent>
                <div className="flex flex-col gap-6 py-3 px-4">
                    <p className="text-2xl text-[#a9a9a9] font-medium font-sans mx-auto">
                        Reset Password
                    </p>

                    <Input
                        icon={Lock}
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Input
                        icon={Lock}
                        type='password'
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    {error && <p className="text-red-800 text-sm">{error}</p>}

                    {/* button to send reset link */}
                    <motion.button
                        className="bg-[#2929d5] text-white py-2 px-4 font-bold rounded-md font-sans w-full"
                        whileHover={{
                            scale: 1.03
                        }}
                        whileTap={{ scale: isValid ? 1 : 1.03 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        disabled={!isValid}
                        onClick={() => { handleSubmit() }}
                    >
                        Set New Password
                    </motion.button>
                </div>
            </LoginSignupInnerComponent>

            <div className="text-[#8193b2] min-[540px]:w-[500px] w-full p-4 text-xs">
                <PasswordStrengthBar
                    password={password}
                    minLength={8}
                    onChangeScore={(score) => {
                        if (score == 4) {
                            setIsValid(true)
                        } else {
                            setIsValid(false)
                        }
                    }}
                />
                <p className="mt-2">Password must be at least 10 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character (e.g., @$!%*?&).</p>
            </div>
        </LoginSignupOuterComponent>
    )
}

export default ResetPassword
