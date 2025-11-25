import { Navigate, Outlet } from "react-router-dom"
import AdminSidebar from "../components/ui/Sidebar"
import { useState } from "react";
import { useUser } from "../contexts/UserContext";

interface User extends Admin {
  role: "admin" | "student" | "registrar";
}

const AdminLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { user, loading } = useUser<User>();

    if(loading) return;

    if(!user) return <Navigate to='/'/> 

    if(user?.role !== 'admin'){
        return <Navigate to={`/${user?.role}`}/>
    }

    return (
        <div className={`md:h-screen bg-gradient-to-r from-purple-100 to-white ${!isCollapsed ? 'pl-64' : 'pl-20'}`}>
            <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}/>
            <Outlet />
        </div>
    )
}

export default AdminLayout