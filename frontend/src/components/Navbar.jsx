import { Link, NavLink } from "react-router-dom"
import logo from "../assets/logo.jfif"
import avtar from "../assets/avtar.jpg"
import { Search } from "lucide-react"
import { useState } from "react"
import { useAuthStore } from "../store/useAuthStore"
import NavbarLink from "./NavbarLink"

const Navbar = () => {
    const [search, setsearch] = useState('')

    const { isAuthenticated, authUser, profilePicUrl } = useAuthStore();

    return (
        <div className={`bg-blue-50`}>
            <nav className="max-w-[1200px] m-auto">
                <div className="pt-2 pb-1 px-2 flex justify-between items-center">
                    <div className="left-nav-side flex items-center gap-2">
                        <div className="logo">
                            <Link to="#"><img src={logo} alt="Logo" className="logo w-[35px] h-[35px] rounded-full" /></Link>
                        </div>
                        <div className="webName">
                            <Link to="#"><h1 className='font-semibold text-sm'>{isAuthenticated ? authUser.username : ''}</h1></Link>
                        </div>
                    </div>

                    <div className="right-nev-side flex items-center gap-2">
                        {/* search bar */}
                        <div className='relative w-full'>
                            <div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
                                <Search className='size-4 text-gray-400' />
                            </div>
                            <input
                                value={search}
                                onChange={(e) => setsearch(e.target.value)}
                                type="text"
                                className='w-full pl-7 py-1 bg-transparent bg-opacity-50 rounded-lg border border-gray-400 focus:border-green-500  outline-none text-gray-900 text-sm placeholder-gray-400 transition duration-200'
                            />
                        </div>
                        {isAuthenticated ?
                            <Link to="#" className='w-[35px] h-[35px] min-w-[35px] min-h-[35px]'>
                                <img src={profilePicUrl ? profilePicUrl : avtar} alt="ProfileImage" className='rounded-full object-cover object-center h-full w-full' />
                            </Link>
                            :
                            <div className="flex gap-2">
                                <Link to="/login"><button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Login</button></Link>
                                <Link to="/signup"><button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Register</button></Link>
                            </div>
                        }
                    </div>
                </div>
                
                <div className="px-2 text-sm flex gap-2">
                    <NavbarLink NavValue="Profile" navlink="/"/>
                    <NavbarLink NavValue="Repositories" navlink="/repositires"/>
                    <NavbarLink NavValue="Messages" navlink="/messages"/>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
