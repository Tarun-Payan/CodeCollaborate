// import React from 'react'
import LoginSignupOuterComponent from "../components/LoginSignupOuterComponent"
import LoginSignupInnerComponent from "../components/LoginSignupInnerComponent"
import { useState, useEffect } from "react"
import { motion } from "motion/react"
import Input from "../components/Input"
import { MoveLeft, Mail } from "lucide-react"
import axios from "axios"
import { Link } from "react-router-dom"

const ForgotPassword = () => {
    const [isLoading, setisLoading] = useState(false)
    const [email, setEmail] = useState()
    const [isValid, setIsValid] = useState(false)
    const [isSubmited, setIsSubmited] = useState(false)
    const [error, seterror] = useState('')

    useEffect(() => {
        if (!email) {
            seterror('')
            if (isValid) setIsValid(false)
            return;
        }

        const delayDebounce = setTimeout(async () => {
            // validating email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            // console.log(emailRegex.test(email.data))

            if (!emailRegex.test(email)) {
                seterror('Email is invalid')
                if (isValid) setIsValid(false)
                return;
            }

            setIsValid(true)
            seterror('')
        }, 1000)

        return () => clearTimeout(delayDebounce);
    }, [email, isValid])

    const handleSubmit = async () => {
        try {
            setisLoading(true)

            // send reset password email
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/forget-password`, { email: email })

            setIsSubmited(true)
            setIsValid(true)
            seterror('')
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            seterror('Email is invalid');
            if (isValid) setIsValid(false);
            return;
        } finally {
            setisLoading(false)
        }
    }

    return (
        <LoginSignupOuterComponent isLoading={isLoading}>
            <LoginSignupInnerComponent>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-6 pt-3 px-4">
                    <p className="text-2xl text-[#a9a9a9] font-medium font-sans mx-auto">
                        Forgot Password
                    </p>

                    {!isSubmited ? 
                    <><p className="text-center">Enter your email address and we&apos;ll send you a link to reset your password</p>

                        <Input
                            icon={Mail}
                            type='email'
                            placeholder='Email Address'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            Send Reset Link
                        </motion.button>
                    </> : 
                    <>
                        <div className="m-auto p-3 bg-[#415063] rounded-full">
                            <Mail size={35} color="white" />
                        </div>
                        <p className="text-center">If an account exists for {email} you will receive a password reset link shortly.</p>
                    </>
                    }
                    </div>

                    <div className="w-full rounded-b-md py-2 bg-[#131f3a]">
                        <Link to={'/login'} className="flex gap-2 w-full justify-center text-[#889f89]">
                            <MoveLeft />
                            <p>Back to Login</p>
                        </Link>
                    </div>
                </div>
            </LoginSignupInnerComponent>
        </LoginSignupOuterComponent>
    )
}

export default ForgotPassword
