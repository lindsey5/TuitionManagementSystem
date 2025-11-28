import { Banknote, Book, BookOpen, Home, PersonStanding, Settings, User, Users } from "lucide-react";
import { useUser } from "../../contexts/UserContext";
import Sidebar from "./Sidebar";

export default function AdminSidebar({ isCollapsed, setIsCollapsed } : { isCollapsed : boolean, setIsCollapsed : React.Dispatch<React.SetStateAction<boolean>>} ){
    const { user } = useUser<Admin>();

    const menuItems = [
        { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/admin' },
        { id: 'courses', icon: BookOpen, label: 'Courses', path: '/admin/courses' },
        { id: 'subjects', icon: Book, label: 'Subjects', path: '/admin/subjects' },
        { id: 'students', icon: Users, label: 'Students', path: '/admin/students' },
        { id: 'payments', icon: Banknote, label: 'Payments', path: '/admin/payments' },
        { id: 'registrars', icon: PersonStanding, label: 'Registrars', path: '/admin/registrars' },
        { id: 'profile', icon: User, label: 'Profile', path: '/admin/profile' },
    ];

    return (
        <Sidebar 
            title="TMS Admin"
            subtitle="Management Panel"
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            email={user?.email || ''}
            firstname={user?.firstname || ''}
            lastname={user?.lastname || ''}
            menuItems={menuItems}
        />
    )
}