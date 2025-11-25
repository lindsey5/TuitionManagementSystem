import { Navigate, Outlet } from "react-router-dom"
import { useUser } from "../contexts/UserContext";
import StudentNav from "../components/ui/StudentNav";

interface User extends Student {
  role: "admin" | "student" | "registrar";
}

const StudentLayout = () => {
    const { user, loading } = useUser<User>();

    if(loading) return;

    if(!user) return <Navigate to='/'/> 

    if(user?.role !== 'student'){
        return <Navigate to={`/${user?.role}`}/>
    }
    return (
        <main className="pt-25 md:h-screen bg-gradient-to-r from-purple-100 to-white">
            <StudentNav />
            <Outlet />
        </main>
    )
}

export default StudentLayout