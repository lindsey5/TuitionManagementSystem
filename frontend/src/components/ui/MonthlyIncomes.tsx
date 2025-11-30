import { CircularProgress } from "@mui/material";
import useFetch from "../../hooks/useFetch";
import LineChart from "./LineChart"

const MonthlyIncomes = () => {
    const { data, loading } = useFetch('/api/incomes/monthly');

    return (
        <div className="h-[500px] bg-white border border-gray-200 shadow-lg w-full relative flex justify-center">
            {loading ? <CircularProgress /> : (
                <LineChart 
                    title={`Monthly Incomes ${new Date().getFullYear()}`}
                    data={data?.incomes.map((income : any) => ({ label: income.month, value: income.total }))}
                    yName="Income"
                />
            )}
        </div>
    )
}

export default MonthlyIncomes