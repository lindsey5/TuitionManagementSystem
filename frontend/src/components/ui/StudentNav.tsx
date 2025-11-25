import { GraduationCap } from "lucide-react"
import { useUser } from "../../contexts/UserContext"
import { useState } from "react";
import NavDropdownButton, { NavLogoutButton } from "./NavDropdownButton";

const StudentNav = () => {
    const { user } = useUser<Student>();
    const [open, setOpen] = useState<boolean>(false);

    return (
        <nav className="z-10 fixed inset-x-0 top-0 flex justify-between px-3 md:px-10 py-5 text-white bg-gradient-to-r from-purple-900 to-purple-800">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                    <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="font-bold text-lg">Tuition Management System</h1>
                    <p className="text-xs text-purple-300">Student</p>
                </div>
            </div>
            <div className="flex items-center gap-5 relative">
                <div className="md:block hidden">
                    <p className="font-semibold text-sm">{`${user?.firstname} ${user?.lastname}`}</p>
                    <p className="text-xs text-purple-300">{user?.email}</p>
                </div>
                <button 
                    onClick={() => setOpen(!open)}
                    className="cursor-pointer w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-bold"
                >
                    {user?.firstname.charAt(0)} {user?.lastname.charAt(0)}
                </button>
                    {open && <div className="w-[200px] absolute px-2 py-5 bg-white border border-gray-200 rounded-lg right-0 top-[calc(100%+10px)]">
                        <NavDropdownButton label="Subjects" path="/student"/>
                        <NavDropdownButton label="Payments" path="/student/payments"/>
                        <NavDropdownButton label="Profile" path="/student/profile"/>
                        <NavLogoutButton />
                    </div>}
            </div>
        </nav>
    )
}

export default StudentNav