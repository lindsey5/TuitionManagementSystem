import { Outlet } from "react-router-dom"
import AdminSidebar from "../pages/admin/Sidebar"

const AdminLayout = () => {
    return (
        <div className="flex">
            <AdminSidebar />
            <Outlet />
        </div>
    )
}

export default AdminLayout