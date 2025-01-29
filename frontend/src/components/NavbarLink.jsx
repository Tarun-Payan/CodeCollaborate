import { NavLink, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { BiCurrentLocation } from "react-icons/bi";

const NavbarLink = ({ NavValue, navlink }) => {
    const [isActive, setisActive] = useState(false)

    const location = useLocation();

    useEffect(() => {
        let currectLocationPathname = '';
        let currentLocationSearch = '';

        if(navlink.indexOf('?') > -1) {
            currectLocationPathname = navlink.substr(0, navlink.indexOf('?'))
            currentLocationSearch = navlink.substr(navlink.indexOf('?'))
        } else {
            currectLocationPathname = navlink
        }

        if (location.pathname === currectLocationPathname && location.search === currentLocationSearch) {
            setisActive(true)
        } else{
            setisActive(false)
        }
    }, [location, navlink])

    return (
        <NavLink to={navlink}>
            {/* {({ isActive }) => ( */}
                <div className="flex flex-col items-center">
                    <span className="px-2">{NavValue}</span>
                    <div className={`h-[2px] w-full ${isActive ? "bg-blue-600" : ""} rounded-full`}></div>
                </div>
            {/* )} */}
        </NavLink>
    )
}

export default NavbarLink
