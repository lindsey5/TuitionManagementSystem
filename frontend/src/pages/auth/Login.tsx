import { useState, type FormEvent } from 'react';
import {
    BookOpen,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Shield,
    ClipboardList,
    GraduationCap,
    ArrowRight,
    ChevronLeft,
    type LucideIcon,
} from 'lucide-react';
import { postData } from '../../utils/api';
import { useUser } from '../../contexts/UserContext';
import { Navigate } from 'react-router-dom';

type UserType = {
    id: 'admin' | 'registrar' | 'student';
    label: string;
    icon: LucideIcon;
    description: string;
    color: string;
};

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [userType, setUserType] = useState<UserType['id'] | null>(null);
    const [step, setStep] = useState<number>(1);
    const { user, loading } = useUser<any>();

    if(loading) return;

    if(user?.role){
        return <Navigate to={`/${user.role}`}/>
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const user = userType === 'admin' ? 'admin' : userType === 'registrar' ? 'registrar' : 'student' 

        const response = await postData(`/api/auth/${user}`, { email, password})

        if(!response.success){
            alert(response.message);
            return;
        }

        window.location.href = `/${user}`
    };

    const userTypes: UserType[] = [
        {
            id: 'admin',
            label: 'Administrator',
            icon: Shield,
            description: 'Manages system users and financial records',
            color: 'from-purple-500 to-purple-600'
        },
        {
            id: 'registrar',
            label: 'Registrar',
            icon: ClipboardList,
            description: 'Oversees student enrollment and tuition records',
            color: 'from-purple-500 to-purple-600'
        },
        {
            id: 'student',
            label: 'Student',
            icon: GraduationCap,
            description: 'Access tuition balance and payment history',
            color: 'from-purple-500 to-purple-600'
        },
    ];

    const selectUserType = (type: UserType['id']) => {
        setUserType(type);
        setTimeout(() => setStep(2), 200);
    };

    const goBack = () => {
        setStep(1);
        setUserType(null);
    };

    const selectedType = userTypes.find((t) => t.id === userType);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-900 to-purple-800 p-12 flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-white text-xl font-bold">Tuition Management</span>
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                        Welcome to Your<br />Academic Portal
                    </h1>
                    <p className="text-purple-200 text-lg max-w-md">
                        Streamlined tuition management and academic administration in one secure platform.
                    </p>
                </div>
                <div className="relative z-10 text-purple-300 text-sm">
                    © 2025 Tuition Management System
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="inline-flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-purple-900 text-xl font-bold">Tuition Management</span>
                        </div>
                    </div>

                    {step === 1 ? (
                        // Step 1: Select User Type
                        <div className="space-y-6">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-purple-900 mb-2">Sign In</h2>
                                <p className="text-purple-600">Select your role to continue</p>
                            </div>

                            <div className="space-y-3">
                                {userTypes.map((type) => {
                                    const Icon = type.icon;
                                    return (
                                        <button
                                            key={type.id}
                                            onClick={() => selectUserType(type.id)}
                                            className="w-full group"
                                        >
                                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all duration-200">
                                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center shadow-md`}>
                                                    <Icon className="w-7 h-7 text-white" />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <div className="font-semibold text-purple-900">{type.label}</div>
                                                    <div className="text-sm text-purple-600">{type.description}</div>
                                                </div>
                                                <ArrowRight className="w-5 h-5 text-purple-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        // Step 2: Login Form
                        <div className="space-y-6">
                            <button
                                type="button"
                                onClick={goBack}
                                className="flex items-center gap-2 text-purple-600 hover:text-purple-900 transition-colors mb-4"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span className="text-sm font-medium">Change role</span>
                            </button>

                            {selectedType && (
                                <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border-2 border-purple-200 shadow-sm">
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${selectedType.color} flex items-center justify-center shadow-md`}>
                                        <selectedType.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-purple-900">{selectedType.label}</h3>
                                        <p className="text-sm text-purple-600">{selectedType.description}</p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-purple-900 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your.email@example.com"
                                            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label htmlFor="password" className="block text-sm font-medium text-purple-900">
                                            Password
                                        </label>
                                        <button type="button" className="text-xs text-purple-600 hover:text-purple-900 font-medium">
                                            Forgot password?
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            className="w-full pl-12 pr-12 py-3 bg-white border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 group shadow-lg"
                                >
                                    Sign In
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>
                        </div>
                    )}

                    <p className="text-center text-xs text-purple-400 mt-8 lg:hidden">
                        © 2025 Tuition Management System
                    </p>
                </div>
            </div>
        </div>
    );
}