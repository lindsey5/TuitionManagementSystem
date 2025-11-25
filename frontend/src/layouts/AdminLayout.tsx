import { Outlet } from "react-router-dom"
import AdminSidebar from "../components/ui/Sidebar"
import { useState } from "react";

const AdminLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className={`h-screen bg-gradient-to-r from-purple-100 to-white ${!isCollapsed ? 'pl-64' : 'pl-20'}`}>
            <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}/>
            <Outlet />
        </div>
    )
}

export default AdminLayout