// import React from 'react'
import { motion } from "motion/react"
import { useEffect, useState } from "react"
import { MoveRight, Eye, EyeOff, Check } from 'lucide-react';
import PasswordStrengthBar from 'react-password-strength-bar';
import { useNavigate } from "react-router-dom";
import PinInput from 'react-pin-input';
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import LoginSignupOuterComponent from "../components/LoginSignupOuterComponent";
import LoginSignupInnerComponent from "../components/LoginSignupInnerComponent";
import ReCAPTCHA from "react-google-recaptcha";

const SignupPage = () => {
    const welcomeTest = `Welcome to CodeCollaborate!\nLet’s begin the adventure`
    const navigate = useNavigate();
    const [displayTest, setDisplayTest] = useState('')
    const [isDisplayedText, setIsDisplayedText] = useState(false)
    const [error, seterror] = useState('')
    const [email, setEmail] = useState({ data: '', isValid: false, isSubmited: false })
    const [password, setPassword] = useState({ data: '', isValid: false, isSubmited: false, showPassword: false })
    const [username, setUsername] = useState({ data: '', isValid: false, isSubmited: false })
    const [isLoading, setIsLoading] = useState(false)
    const [captVal, setCaptVal] = useState(null)

    const { setAuthUser, setIsAuthenticated, checkAuth } = useAuthStore();

    const displayWelcomeTest = () => {
        let index = 0
        const interval = setInterval(() => {
            setDisplayTest(welcomeTest.slice(0, index + 1))
            index++;
            if (index >= welcomeTest.length) {
                clearInterval(interval)
                setIsDisplayedText(true)
            }
        }, 100)
    }

    useEffect(() => {
        checkAuth(setIsLoading, navigate, '/', '')

        displayWelcomeTest();
    }, [checkAuth, navigate])

    useEffect(() => {
        if (!email.data) {
            seterror('')
            if (email.isValid) setEmail({ data: email.data, isValid: false, isSubmited: email.isSubmited })
            return;
        }

        const delayDebounce = setTimeout(async () => {
            try {
                // validating email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                // console.log(emailRegex.test(email.data))

                if (!emailRegex.test(email.data)) {
                    seterror('Email is invalid or already taken')
                    if (email.isValid) setEmail({ data: email.data, isValid: false, isSubmited: email.isSubmited })
                    return;
                }

                await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/checkEmail`, { email: email.data });

                setEmail({ data: email.data, isValid: true, isSubmited: email.isSubmited })
                seterror('')
                // eslint-disable-next-line no-unused-vars
            } catch (error) {
                seterror('Email is invalid or already taken');
                if (email.isValid) setEmail({ data: email.data, isValid: false, isSubmited: email.isSubmited });
                return;
            }
        }, 1000)

        return () => clearTimeout(delayDebounce);
    }, [email.data])

    useEffect(() => {
        if (!username.data) {
            seterror('');
            if (username.isValid) setUsername({ data: username.data, isValid: false, isSubmitted: username.isSubmited })
            return;
        }

        const delayDebounce = setTimeout(async () => {
            // validating username
            const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
            // console.log(usernameRegex.test(username.data))
            if (!usernameRegex.test(username.data)) {
                seterror('Username is invalid or already taken')
                if (username.isValid) setUsername({ data: username.data, isValid: false, isSubmitted: username.isSubmited })
                return;
            }

            // check username is available or not in database
            try {
                await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/checkUsername`, { username: username.data })
                // eslint-disable-next-line no-unused-vars
            } catch (error) {
                seterror('Username is invalid or already taken')
                if (username.isValid) setUsername({ data: username.data, isValid: false, isSubmitted: username.isSubmited })
                return;
            }

            setUsername({ data: username.data, isValid: true, isSubmitted: username.isSubmited })
            seterror('')
        }, 1000)

        return () => clearTimeout(delayDebounce);
    }, [username.data])

    // Handle Email props change
    const handleChangeEmail = (e) => {
        setEmail({ data: e.target.value, isValid: email.isValid, isSubmited: email.isSubmited })
    }

    // // Handle Password props change
    const handleChangePassword = (e) => {
        setPassword({ data: e.target.value, isValid: password.isValid, isSubmited: password.isSubmited, showPassword: password.showPassword })
    }

    // Handle Username props change
    const handleChangeUsername = (e) => {
        setUsername({ data: e.target.value, isValid: username.isValid, isSubmited: username.isSubmited })
    }

    const handleSubmit = async (catpcValue) => {
        setIsLoading(true)
        try {
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/sendVarificationEmail`, { email: email.data })
            setUsername({ data: username.data, isValid: username.isValid, isSubmited: true })
            setCaptVal(catpcValue)
        } catch (error) {
            console.log(error)
            alert('Please enter valid Email')
            setEmail({ data: email.data, isValid: false, isSubmited: false })
            setPassword({ data: password.data, isValid: password.isValid, isSubmited: false, showPassword: false })
            setUsername({ data: username.data, isValid: username.isValid, isSubmited: false })
            seterror('Invalid email or it not exist')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <LoginSignupOuterComponent isLoading={isLoading} type={"signup"}>
                {!captVal ?
                    <>
                        <LoginSignupInnerComponent className="py-3 px-4">
                            <p
                                className="p"
                                style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                                {displayTest}
                            </p>

                            {/* email */}
                            {isDisplayedText && <motion.div
                                initial={{ opacity: 0, y: 20 }} // Starting animation
                                animate={{ opacity: 1, y: 0 }}   // While in view
                                className="div py-4 w-full"
                                style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace' }}>
                                <p className="font-bold text-blue-600 text-sm">Enter your email</p>
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <div className="flex items-center w-full gap-2">
                                        {email.isSubmited == false ? <MoveRight size={16} strokeWidth={1.5} className="text-orange-700" />
                                            : <Check size={16} strokeWidth={3} className="text-green-800" />}
                                        <input type="email" className="bg-transparent px-1 rounded-[4px] border-sky-800 focus:border outline-none w-full" value={email.data} onChange={(e) => handleChangeEmail(e)} disabled={email.isSubmited} />
                                    </div>
                                    {email.isSubmited == false && <button className={`px-2 rounded-[4px] border  ${email.isValid ? 'border-green-800 text-green-800' : 'border-gray-600 text-gray-600 '}`} onClick={() => setEmail({ data: email.data, isValid: email.isValid, isSubmited: true })} disabled={!email.isValid}>Continue</button>}
                                </div>
                            </motion.div>}

                            {/* password */}
                            {email.isSubmited && <motion.div
                                initial={{ opacity: 0, y: 20 }} // Starting animation
                                animate={{ opacity: 1, y: 0 }}   // While in view
                                className="div py-4 w-full"
                                style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace' }}>
                                <p className="font-bold text-blue-600 text-sm">Create a password</p>
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <div className="flex items-center w-full gap-2">
                                        {password.isSubmited == false ? <MoveRight size={16} strokeWidth={1.5} className="text-orange-700" />
                                            : <Check size={16} strokeWidth={3} className="text-green-800" />}
                                        <input type={password.showPassword ? "text" : "password"} className="bg-transparent px-1 rounded-[4px] border-sky-800 focus:border outline-none w-full" value={password.data} onChange={(e) => handleChangePassword(e)} disabled={password.isSubmited} />
                                        {password.showPassword ?
                                            <Eye
                                                className="cursor-pointer text-sm text-gray-400"
                                                size={16}
                                                strokeWidth={1.5}
                                                onClick={() => setPassword({ data: password.data, isValid: password.isValid, isSubmited: password.isSubmited, showPassword: false })} />
                                            : <EyeOff
                                                className="cursor-pointer text-xs text-gray-400"
                                                size={16}
                                                strokeWidth={1.5}
                                                onClick={() => setPassword({ data: password.data, isValid: password.isValid, isSubmited: password.isSubmited, showPassword: true })} />
                                        }
                                    </div>
                                    {!password.isSubmited && <button className={`px-2 rounded-[4px] border  ${password.isValid ? 'border-green-800 text-green-800' : 'border-gray-600 text-gray-600 '}`} onClick={() => setPassword({ data: password.data, isValid: password.isValid, isSubmited: true, showPassword: password.showPassword })} disabled={!password.isValid} >Continue</button>}
                                </div>
                            </motion.div>}

                            {/* username */}
                            {password.isSubmited && <motion.div
                                initial={{ opacity: 0, y: 20 }} // Starting animation
                                animate={{ opacity: 1, y: 0 }}   // While in view
                                className="div py-4 w-full"
                                style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace' }}>
                                <p className="font-bold text-blue-600 text-sm">Enter a username</p>
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <div className="flex items-center w-full gap-2">
                                        {!username.isSubmited ? <MoveRight size={16} strokeWidth={1.5} className="text-orange-700" />
                                            : <Check size={16} strokeWidth={3} className="text-green-800" />}
                                        <input type="text" className="bg-transparent px-1 rounded-[4px] border-sky-800 focus:border outline-none w-full" value={username.data} onChange={(e) => handleChangeUsername(e)} />
                                    </div>
                                    {!username.isSubmited && <button className={`px-2 rounded-[4px] border  ${username.isValid ? 'border-green-800 text-green-800' : 'border-gray-600 text-gray-600 '}`} onClick={() => setUsername({ data: username.data, isValid: username.isValid, isSubmited: true })} disabled={!username.isValid}>Continue</button>}
                                    {/* <button className={`px-2 rounded-[4px] border  ${username.isValid ? 'border-green-800 text-green-800' : 'border-gray-600 text-gray-600 '}`} onClick={() => handleSubmit()} disabled={!username.isValid}>Continue</button> */}
                                </div>

                                {username.isSubmited && <motion.div
                                    initial={{ opacity: 0, y: 20 }} // Starting animation
                                    animate={{ opacity: 1, y: 0 }}   // While in view
                                    className="div py-4 w-full"
                                    style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace' }}>
                                    <ReCAPTCHA
                                        sitekey="6Ld0XfMqAAAAAKvwViHzlOF4lFJAkdHX2FIto_5o"
                                        onChange={val => handleSubmit(val)}
                                    />
                                </motion.div>}
                            </motion.div>}
                        </LoginSignupInnerComponent>

                        <div className="text-[#8193b2] min-[540px]:w-[500px] w-full p-4 text-xs">
                            {error}
                            {(!password.isSubmited && email.isSubmited) &&
                                <>
                                    <PasswordStrengthBar
                                        password={password.data}
                                        minLength={8}
                                        onChangeScore={(score) => {
                                            if (score == 4) {
                                                setPassword({ data: password.data, isValid: true, isSubmited: password.isSubmited, showPassword: password.showPassword })
                                            } else {
                                                setPassword({ data: password.data, isValid: false, isSubmited: password.isSubmited, showPassword: password.showPassword })
                                            }
                                        }}
                                    />
                                    <p className="mt-2">Password must be at least 10 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character (e.g., @$!%*?&).</p>
                                </>
                            }
                        </div>
                    </>
                    :
                    // show below code after email, password and username fields are filled
                    <LoginSignupInnerComponent className="py-5 px-6 flex flex-col gap-3">
                        <div className="text-[#8193b2] text-sm font-medium font-mono">
                            <p>You're almost done!</p>
                            <p>We sent a launch code to <span className="text-green-800">{email.data}</span></p>
                        </div>

                        <span className="flex items-center gap-1">
                            <MoveRight size={16} strokeWidth={1.5} className="text-gray-800" />
                            <p className="text-sm text-pink-800 font-mono">Enter code</p>
                        </span>

                        <PinInput
                            length={6}
                            initialValue={""}
                            type="numeric"
                            style={{ padding: "8px 0px", display: "flex", width: "100%", justifyContent: "space-between" }}
                            inputStyle={{ borderColor: 'gray', borderRadius: "4px" }}
                            inputFocusStyle={{ borderColor: 'green' }}
                            onComplete={async (value, index) => {
                                console.log(value, index)
                                console.log("Completed")
                                // seterror('Invalid launch code.')
                                setIsLoading(true)
                                try {
                                    await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/varify-email`, { email: email.data, varificationToken: value })

                                    const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/signup`, { email: email.data, username: username.data, password: password.data }, { withCredentials: true })
                                    seterror('')
                                    alert("Successfully created account")
                                    navigate("/");
                                } catch (error) {
                                    console.log(error)
                                    seterror('Invalid launch code.')
                                } finally {
                                    setIsLoading(false)
                                }
                            }}
                        />

                        {error && <p className="text-sm text-orange-700 font-mono">{error}</p>}
                    </LoginSignupInnerComponent>
                }
            </LoginSignupOuterComponent>
        </>
    )
}

export default SignupPage
