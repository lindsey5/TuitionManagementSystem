import { Title } from "../../components/Text";
import DashboardCards from "../../components/ui/DashboardCards";
import MonthlyIncomes from "../../components/ui/MonthlyIncomes";
import StudentCountPerCourse from "../../components/ui/StudentCountPerCourse";

const Dashboard = () => {

    return (
        <div className="p-5 w-full flex flex-col gap-10">
            <Title label="Dashboard" />
            <DashboardCards />
            <MonthlyIncomes />
            <StudentCountPerCourse />
        </div>
    )
}

export default Dashboard