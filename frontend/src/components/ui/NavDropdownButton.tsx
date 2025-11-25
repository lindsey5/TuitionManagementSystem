import { useLocation, useNavigate } from "react-router-dom"
import { logout } from "../../utils/api";

const NavDropdownButton = ({ path, label } : { path : string, label : string }) => {
    const location = useLocation();
    const pathname = location.pathname;
    const navigate = useNavigate();

    return (
        <button 
            onClick={() => navigate(path)}
            className="cursor-pointer w-full relative text-purple-500 hover:opacity-50 text-left border-b border-gray-200 px-2 py-3"
        >
            {pathname === path && <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-[70%] bg-purple-500" />}
            {label}
        </button>
    )
}

export default NavDropdownButton

export const NavLogoutButton = () => (
    <button 
        onClick={logout}
        className="cursor-pointer w-full relative text-purple-500 hover:opacity-50 text-left border-b border-gray-200 px-2 py-3"
    >
        Logout
    </button>
)