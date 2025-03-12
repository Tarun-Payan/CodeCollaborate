import React from 'react'
import logo from "../assets/logo.jfif"
import NavbarLink from "./NavbarLink"

const DocHeader = () => {
    return (
        <div className='bg-slate-600 sticky top-0 shadow-2xl'>
            <nav className="max-w-[1200px] m-auto py-1 px-1 flex justify-between items-center">
                <div className="left-nav-side flex items-center gap-2">
                    <div className="logo">
                        <a href={"/"}><img src={logo} alt="Logo" className="logo w-[35px] h-[35px] rounded-full" /></a>
                    </div>
                </div>

                <div className="px-2 text-sm flex gap-2">
                    <NavbarLink NavValue="About" navlink={`/doc/about`} />
                    <NavbarLink NavValue="Connect Via SSH" navlink={`/doc/ssh`} />
                </div>
            </nav>
        </div>
    )
}

export default DocHeader
