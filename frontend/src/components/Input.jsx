import { motion } from "motion/react";
import { Eye, EyeOff } from 'lucide-react';
import { useState } from "react";

const Input = ({ icon: Icon, type, ...props }) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <motion.div
            className='relative w-full'
            // initial={{ opacity: 0, y: 20, scale: 0 }}
            // animate={{ opacity: 1, y: 0, scale: 1 }}
            // transition={{ delay: delay }}
        >
            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                <Icon className='size-5 text-green-500' />
            </div>
            <input
                {...props}
                type={type !== "password" ? type : showPassword ? 'text' : 'password'}
                className='w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500  outline-none text-white placeholder-gray-400 transition duration-200'
            />
            {type === "password" && <div className='absolute inset-y-0 right-0 flex items-center pr-3'>
                {(showPassword & type === "password") ?
                    <Eye
                        className="cursor-pointer text-sm text-gray-400"
                        size={16}
                        strokeWidth={1.5}
                        onClick={() => setShowPassword(false)} />
                    : <EyeOff
                        className="cursor-pointer text-xs text-gray-400"
                        size={16}
                        strokeWidth={1.5}
                        onClick={() => setShowPassword(true)} />
                }
            </div>}
        </motion.div>
    );
};
export default Input;
