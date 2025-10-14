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
    type LucideIcon,
} from 'lucide-react';
import { postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

type UserType = {
    id: 'admin' | 'registrar' | 'student';
    label: string;
    icon: LucideIcon;
    description: string;
};

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [userType, setUserType] = useState<UserType['id'] | null>(null);
    const [step, setStep] = useState<number>(1);
    const navigate = useNavigate()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const user = userType === 'admin' ? 'admin' : userType === 'registrar' ? 'regitrar' : 'student' 

        const response = await postData(`/api/auth/${user}`, { email, password})


        if(!response.success){
            alert(response.message);
            return;
        }

        navigate(`/${user}`);
    };

    const userTypes: UserType[] = [
        {
        id: 'admin',
        label: 'Administrator',
        icon: Shield,
        description: 'Manages system users and financial records',
        },
        {
        id: 'registrar',
        label: 'Registrar',
        icon: ClipboardList,
        description: 'Oversees student enrollment and tuition records',
        },
        {
        id: 'student',
        label: 'Student',
        icon: GraduationCap,
        description: 'Access tuition balance and payment history',
        },
    ];

    const selectUserType = (type: UserType['id']) => {
        setUserType(type);
        setTimeout(() => setStep(2), 300);
    };

    const goBack = () => {
        setStep(1);
        setUserType(null);
    };

    const selectedType = userTypes.find((t) => t.id === userType);

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
        <div className="w-full max-w-md relative z-10">
            {/* Logo Header */}
            <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-3xl mb-5 shadow-md">
                <BookOpen className="w-10 h-10 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-purple-900 mb-2">Tuition Management</h1>
            </div>

            {/* Main Card */}
            <div className="bg-white border border-purple-100 rounded-3xl shadow-xl overflow-hidden">
            {step === 1 ? (
                // Step 1: Select User Type
                <div className="p-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-purple-900 mb-2">Welcome Back</h2>
                    <p className="text-purple-600 text-sm">Please select your role to sign in</p>
                </div>

                <div className="space-y-3">
                    {userTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                        <button
                        key={type.id}
                        onClick={() => selectUserType(type.id)}
                        className="w-full group cursor-pointer"
                        >
                        <div className="relative flex items-center gap-4 p-5 rounded-2xl bg-purple-50 border-2 border-purple-100 transition-all duration-300 group-hover:bg-purple-100 group-hover:border-purple-300 group-hover:shadow-lg group-hover:scale-[1.02]">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg">
                            <Icon className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                            <div className="font-bold text-lg text-purple-900">{type.label}</div>
                            <div className="text-sm text-purple-600">{type.description}</div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-purple-600 transition-transform group-hover:translate-x-2" />
                        </div>
                        </button>
                    );
                    })}
                </div>

                </div>
            ) : (
                // Step 2: Login Form
                <form onSubmit={handleSubmit}>
                <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-8">
                    <button
                    type="button"
                    onClick={goBack}
                    className="text-white/90 hover:text-white text-sm mb-4 flex items-center gap-2 transition-colors"
                    >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Change Role
                    </button>
                    <div className="flex items-center gap-4">
                    {selectedType && (
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <selectedType.icon className="w-7 h-7 text-white" />
                        </div>
                    )}
                    <div>
                        <h2 className="text-2xl font-bold text-white">{selectedType?.label}</h2>
                        <p className="text-purple-100 text-sm">{selectedType?.description}</p>
                    </div>
                    </div>
                </div>

                <div className="p-8 space-y-6 bg-white">
                    <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-bold text-purple-900 mb-2"
                    >
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                        <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="w-full pl-12 pr-4 py-3.5 bg-purple-50 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white outline-none transition text-purple-900 placeholder-purple-400"
                        required
                        />
                    </div>
                    </div>

                    <div>
                    <div className="flex items-center justify-between mb-2">
                        <label
                        htmlFor="password"
                        className="block text-sm font-bold text-purple-900"
                        >
                        Password
                        </label>
                        <button
                        type="button"
                        className="text-xs text-purple-600 hover:text-purple-800 font-semibold"
                        >
                        Forgot Password?
                        </button>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                        <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-12 pr-12 py-3.5 bg-purple-50 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-white outline-none transition text-purple-900 placeholder-purple-400"
                        required
                        />
                        <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-600"
                        >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    </div>

                    <button
                    type="submit"
                    className="cursor-pointer w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-4 rounded-xl font-bold hover:from-purple-700 hover:to-purple-900 shadow-lg shadow-purple-500/50 transition-all duration-200 flex items-center justify-center gap-2 group"
                    >
                    Sign In 
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                </div>
                </form>
            )}
            </div>

            <p className="text-center text-xs text-purple-400 mt-8">
            © 2025 Tuition Management System. All Rights Reserved.
            </p>
        </div>
        </div>
    );
}
