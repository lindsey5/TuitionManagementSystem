import { Navigate, Outlet } from "react-router-dom"
import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import RegistrarSidebar from "../components/ui/RegistrarSidebar";

interface User extends Admin {
  role: "admin" | "student" | "registrar";
}

const RegistrarLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const { user, loading } = useUser<User>();

    if(loading) return;

    if(!user) return <Navigate to='/'/> 

    if(user?.role !== 'registrar'){
        return <Navigate to={`/${user?.role}`}/>
    }

    return (
        <div className={`md:h-screen bg-gradient-to-r from-purple-100 to-white ${!isCollapsed ? 'pl-64' : 'pl-20'}`}>
            <RegistrarSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}/>
            <Outlet />
        </div>
    )
}

export default RegistrarLayout