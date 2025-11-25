import { Banknote, Book, BookOpen, UserCheck, Users } from "lucide-react"
import DashboardCard from "./DashboardCard"
import useFetch from "../../hooks/useFetch"
import { formatNumberToPeso } from "../../utils/utils";

const DashboardCards = () => {
    const { data } = useFetch('/api/dashboard');

    return (
        <div className="grid md:grid-cols-2 lg: lg:grid-cols-4 gap-5">
            <DashboardCard
                title="Today's Income"
                value={formatNumberToPeso(data?.data.daily || 0)}
                icon={<Banknote size={28} />}
            />
            <DashboardCard
                title="This Week"
                value={formatNumberToPeso(data?.data.weekly || 0)}
                icon={<Banknote size={28} />}
            />
            <DashboardCard
                title="This Month"
                value={formatNumberToPeso(data?.data.monthly || 0)}
                icon={<Banknote size={28} />}
            />
            <DashboardCard
                title="This Year"
                value={formatNumberToPeso(data?.data.yearly || 0)}
                icon={<Banknote size={28} />}
            />
            <DashboardCard
                title="Total Students"
                value={data?.data.totalStudents || 0}
                icon={<Users size={28} />}
            />
            <DashboardCard
                title="Total Subjects"
                value={data?.data.totalSubjects || 0}
                icon={<Book size={28} />}
            />
            <DashboardCard
                title="Total Courses"
                value={data?.data.totalCourses || 0}
                icon={<BookOpen size={28} />}
            />
            <DashboardCard 
                title="Total Registrars"
                value={data?.data.totalRegistrars || 0}
                icon={<UserCheck size={28}/>}
            />
        </div>
    )
}

export default DashboardCards