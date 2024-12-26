import { NavLink } from "react-router-dom"

const NavbarLink = ({NavValue, navlink}) => {
    return (
        <NavLink 
            to={ navlink }
            className={({ isActive }) => (isActive ? "active" : "")}
        >
            {({ isActive }) => (
                <div className="flex flex-col items-center">
                    <span className="px-2">{ NavValue }</span>
                    <div className={`h-[2px] w-full ${ isActive ? "bg-blue-600" : ""} rounded-full`}></div>
                </div>
            )}
        </NavLink>
    )
}

export default NavbarLink
