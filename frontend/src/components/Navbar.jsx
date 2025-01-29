import { Link } from "react-router-dom"
import logo from "../assets/logo.jfif"
import { Search } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuthStore } from "../store/useAuthStore"
import NavbarLink from "./NavbarLink"
import SearchModal from "../modals/SearchModal"
import NavbarProfileImageCompo from "./NavbarProfileImageCompo"

const Navbar = ({ isRepoPage }) => {
    const [search, setsearch] = useState('')

    const { isAuthenticated, authUser, selectedUser } = useAuthStore();

    const [showSearchModal, setShowSearchModal] = useState(false)
    const closeSearchModal = () => setShowSearchModal(false);

    return (
        <div className={`bg-blue-50`}>
            <nav className="max-w-[1200px] m-auto">
                <div className="pt-2 pb-1 px-2 flex justify-between items-center">
                    <div className="left-nav-side flex items-center gap-2">
                        <div className="logo">
                            <a href={"/"}><img src={logo} alt="Logo" className="logo w-[35px] h-[35px] rounded-full" /></a>
                        </div>
                        <div className="webName">
                            <a href="/"><h1 className='font-semibold text-sm'>{isAuthenticated ? selectedUser?.username : ''}</h1></a>
                        </div>
                    </div>

                    <div className="right-nev-side flex items-center gap-2">
                        {/* search bar */}
                        <div className='relative w-[190px] border border-gray-400 rounded-lg h-7 cursor-pointer' onClick={() => setShowSearchModal(true)}>
                            <div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
                                <Search className='size-4 text-gray-400' />
                            </div>
                        </div>
                        {showSearchModal && <SearchModal closeModal={closeSearchModal} />}
                        {isAuthenticated ?
                            <NavbarProfileImageCompo />
                            :
                            <div className="flex gap-2">
                                <Link to="/login"><button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Login</button></Link>
                                <Link to="/signup"><button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Register</button></Link>
                            </div>
                        }
                    </div>
                </div>

                {!isRepoPage?
                <div className="px-2 text-sm flex gap-2">
                    <NavbarLink NavValue="Profile" navlink={`/${selectedUser?.username}`} />
                    <NavbarLink NavValue="Repositories" navlink={`/${selectedUser?.username}?tab=repositires`} />
                    {authUser?.username == selectedUser?.username && <NavbarLink NavValue="Settings" navlink={`/${selectedUser?.username}?tab=settings`} />}
                    {/* <NavbarLink NavValue="Messages" navlink="/messages" /> */}
                </div>
                :
                <div className="px-2 text-sm flex gap-2">
                    <NavbarLink NavValue="Code" navlink={`#`} />
                    <NavbarLink NavValue="Pull requests" navlink="#" />
                    <NavbarLink NavValue="Settings" navlink="#" />
                </div>
                }
            </nav>
        </div>
    )
}

export default Navbar
