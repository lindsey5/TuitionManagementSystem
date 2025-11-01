import { useState } from 'react';
import { 
    Home, 
    Users, 
    GraduationCap, 
    DollarSign, 
    Settings, 
    LogOut,
    ChevronLeft,
    ChevronRight,
    Bell,
    BookOpen,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AdminSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/admin' },
        { id: 'courses', icon: BookOpen, label: 'Courses', path: '/admin/courses' },
        { id: 'students', icon: Users, label: 'Students', path: '/admin/students' },
        { id: 'payments', icon: DollarSign, label: 'Payments', path: '/admin/payments' },
        { id: 'notifications', icon: Bell, label: 'Notifications', path: '/admin/notifications' },
        { id: 'settings', icon: Settings, label: 'Settings', path: '/admin/settings' },

    ];

    return (
        <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div 
            className={`${
            isCollapsed ? 'w-20' : 'w-64'
            } bg-gradient-to-b from-purple-900 to-purple-800 text-white transition-all duration-300 ease-in-out flex flex-col shadow-2xl`}
        >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-purple-700">
            {!isCollapsed && (
                <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                    <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="font-bold text-lg">TMS Admin</h1>
                    <p className="text-xs text-purple-300">Management Panel</p>
                </div>
                </div>
            )}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
                {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
            </div>

            {/* Main Menu Items */}
            <nav className="flex-1 py-6 overflow-y-auto">
            <ul className="space-y-2 px-3">
                {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                    <li key={item.id}>
                    <button
                        className={`cursor-pointer w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                        location.pathname === item.path
                            ? 'bg-purple-600 shadow-lg transform scale-105'
                            : 'hover:bg-purple-700/50'
                        }`}
                        onClick={() => navigate(item.path)}
                    >
                        <Icon size={20} className="flex-shrink-0" />
                        {!isCollapsed && (
                        <span className="font-medium">{item.label}</span>
                        )}
                    </button>
                    </li>
                );
                })}
                <li>
                    <button
                        className="cursor-pointer w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 hover:bg-purple-700/50"
                    >
                        <LogOut size={20} className="flex-shrink-0" />
                        {!isCollapsed && (
                        <span className="font-medium">Logout</span>
                        )}
                    </button>
                </li>
            </ul>
            </nav>

            {/* User Profile */}
            {!isCollapsed && (
            <div className="p-4 border-t border-purple-700">
                <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-bold">
                    AD
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-sm">Admin User</p>
                    <p className="text-xs text-purple-300">admin@tms.com</p>
                </div>
                </div>
            </div>
            )}
        </div>

        </div>
    );
}