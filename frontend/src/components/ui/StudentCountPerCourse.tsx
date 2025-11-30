import { CircularProgress } from "@mui/material"
import useFetch from "../../hooks/useFetch"
import BarChart from "./BarChart"


const StudentCountPerCourse = () => {
    const { data, loading } = useFetch('/api/students/count')

    return (
        <div className="h-[500px] bg-white border border-gray-200 shadow-lg w-full relative flex justify-center">
            {loading ? <CircularProgress /> : (
                <BarChart 
                    title="Student Count"
                    data={data?.data.map((count : any) => ({ label: count.courseName, value: count.count }))}
                    yName="Count"
                    xName="Course"
                />
            )}
        </div>
    )
}

export default StudentCountPerCourse