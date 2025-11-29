import { Banknote, Book, User, Users } from "lucide-react";
import { useUser } from "../../contexts/UserContext";
import Sidebar from "./Sidebar";

export default function RegistrarSidebar({ isCollapsed, setIsCollapsed } : { isCollapsed : boolean, setIsCollapsed : React.Dispatch<React.SetStateAction<boolean>>} ){
    const { user } = useUser<Admin>();

    const menuItems = [
        { id: 'subjects', icon: Book, label: 'Subjects', path: '/registrar' },
        { id: 'students', icon: Users, label: 'Students', path: '/registrar/students' },
        { id: 'payments', icon: Banknote, label: 'Payments', path: '/registrar/payments' },
        { id: 'profile', icon: User, label: 'Profile', path: '/registrar/profile' },
    ];

    return (
        <Sidebar 
            title="TMS Registrar"
            subtitle="Tuition & Enrollment Management"
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            email={user?.email || ''}
            firstname={user?.firstname || ''}
            lastname={user?.lastname || ''}
            menuItems={menuItems}
        />
    )
}