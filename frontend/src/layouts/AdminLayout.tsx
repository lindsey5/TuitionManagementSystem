import { Outlet } from "react-router-dom"
import AdminSidebar from "../pages/admin/Sidebar"

const AdminLayout = () => {
    return (
        <>
        <AdminSidebar />
        <Outlet />
        </>
    )
}

export default AdminLayout