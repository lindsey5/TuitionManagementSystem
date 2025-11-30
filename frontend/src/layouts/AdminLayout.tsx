import { Navigate, Outlet } from "react-router-dom"
import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import AdminSidebar from "../components/ui/AdminSidebar";

interface User extends Admin {
  role: "admin" | "student" | "registrar";
}

const AdminLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const { user, loading } = useUser<User>();

    if(loading) return;

    if(!user) return <Navigate to='/'/> 

    if(user?.role !== 'admin'){
        return <Navigate to={`/${user?.role}`}/>
    }

    return (
        <div className={`bg-gradient-to-r from-purple-100 to-white ${!isCollapsed ? 'pl-64' : 'pl-20'}`}>
            <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}/>
            <Outlet />
        </div>
    )
}

export default AdminLayout