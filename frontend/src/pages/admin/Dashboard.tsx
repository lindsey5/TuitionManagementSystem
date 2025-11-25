import { Title } from "../../components/Text";
import DashboardCards from "../../components/ui/DashboardCards";
import LineChart from "../../components/ui/LineChart";
import MonthlyIncomes from "../../components/ui/MonthlyIncomes";
import useFetch from "../../hooks/useFetch"

const Dashboard = () => {

    return (
        <div className="p-5 w-full flex flex-col gap-10">
            <Title label="Dashboard" />
            <DashboardCards />
            <MonthlyIncomes />
        </div>
    )
}

export default Dashboard