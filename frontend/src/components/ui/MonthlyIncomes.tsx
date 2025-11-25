import useFetch from "../../hooks/useFetch";
import LineChart from "./LineChart"

const MonthlyIncomes = () => {
    const { data } = useFetch('/api/incomes/monthly');

    return (
        <LineChart 
            title="Month Incomes"
            data={data?.incomes.map((income : any) => ({ label: income.month, value: income.total }))}
            yName="Income"
        />
    )
}

export default MonthlyIncomes