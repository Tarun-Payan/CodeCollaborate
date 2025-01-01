import React from 'react'
import logo from '../assets/logo.jfif'
import { Link } from 'react-router-dom';

const LoginSignupNavbar = ({ type }) => {
    if(!type) return;

    return (
        <div className='max-w-[1200px] m-auto py-2 flex justify-between items-center'>
            <div className="logo">
                <a href={"/"}><img src={logo} alt="Logo" className="logo w-[35px] h-[35px] rounded-full" /></a>
            </div>
            <div className='text-slate-400'>
                {type === 'login' ? 
                <p>Don&apos;t have an account? <Link to={"/signup"} className='text-gray-300 hover:text-blue-600 transition duration-300'>Sign up</Link></p> 
                : 
                <p>Already have an account? <Link to={"/login"} className='text-gray-300 hover:text-blue-600 transition duration-300'>Login</Link></p>}
            </div>
        </div>
    )
}

export default LoginSignupNavbar
