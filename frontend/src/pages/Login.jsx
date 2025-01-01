import { motion } from "motion/react"
import { useState, useEffect } from "react"
import LoginSignupOuterComponent from "../components/LoginSignupOuterComponent";
import LoginSignupInnerComponent from "../components/LoginSignupInnerComponent";
import { Mail, Lock } from "lucide-react";
import Input from "../components/Input";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const Login = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, seterror] = useState('')
    const navigate = useNavigate();
    const { checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth(setIsLoading, navigate, '/', '')
    }, [checkAuth, navigate])

    const handleSubmit = async () => {
        setIsLoading(true)
        // API call to login
        try {
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/login`, { email: email, password: password }, { withCredentials: true });
            seterror('')
            alert("Successfully login")
            navigate('/')
        } catch (error) {
            seterror('Invalid email or password')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <LoginSignupOuterComponent isLoading={isLoading} type="login">
            <LoginSignupInnerComponent>
                <div className="flex flex-col items-start gap-6 py-3 px-4">
                    <motion.p
                        className="text-2xl text-[#a9a9a9] font-medium font-sans mx-auto"
                    // initial={{ opacity: 0, y: 20, scale: 0 }}
                    // animate={{ 
                    //     opacity: 1, 
                    //     y: 0, 
                    //     scale: 1,
                    //     transition: { delay: 0.6 }
                    // }}
                    >
                        Sign in to CodeCollaborate
                    </motion.p>
                    <Input
                        icon={Mail}
                        type='email'
                        placeholder='Email Address'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        icon={Lock}
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Link to="/forgot-password" className="text-green-900 text-sm w-fit hover:underline">Forgot password?</Link>

                    {error && <p className="text-red-800 text-sm">{error}</p>}

                    {/* Login button */}
                    <motion.button
                        className="bg-[#2929d5] text-white py-2 px-4 font-bold rounded-md font-sans w-full"
                        // initial={{ opacity: 0, y: 20, scale: 0 }}
                        // animate={{ 
                        //     opacity: 1, 
                        //     y: 0, 
                        //     scale: 1,
                        //     // transition: {delay: 1.2} 
                        // }}
                        whileHover={{
                            scale: 1.03
                        }}
                        whileTap={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        onClick={() => { handleSubmit() }}
                    >
                        Login
                    </motion.button>
                </div>
            </LoginSignupInnerComponent>
        </LoginSignupOuterComponent>
    )
}

export default Login
