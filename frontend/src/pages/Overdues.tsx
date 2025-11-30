import { CircularProgress, Pagination } from "@mui/material"
import { Title } from "../components/Text"
import useFetch from "../hooks/useFetch"
import PurpleTable from "../components/Table"
import { formatDateLong } from "../utils/date";
import { formatNumberToPeso } from "../utils/utils";
import { PurpleButton } from "../components/Button";
import { useState } from "react";
import { postData } from "../utils/api";
import { errorAlert, successAlert } from "../utils/swal";

interface OverdueStudent extends Omit<Semester, 'student_id'>{
    student_id: Student;
}

const OverdueStudents = () => {
    const [page, setPage] = useState(1);
    const { data, loading } = useFetch(`/api/students/overdue?page=${page}&limit=50`)
    
    const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const notify = async (student_id : string, semester_id : string) => {
        const response = await postData(`/api/students/notify/${student_id}?semester=${semester_id}`, {})
        if(!response.success){
            errorAlert('Failed', response.message || 'Failed to notify student. Please try again.');
            return;
        }

        successAlert('Success!', 'Student successfully notify')
    }

    return (    
        <div className="p-5 w-full md:h-full flex flex-col gap-10">
            <Title label="Overdue Students" />
            {loading ? (
            <div className="w-full flex justify-center items-center h-64">
                <CircularProgress />
            </div>) 
            : 
            data?.students.length === 0 ? (
                <p className="text-center text-gray-500 mt-20">No overdues yet.</p>
            ) :
            <PurpleTable 
                columns={['#', 'Student ID', 'Fullname', 'Course', 'Semester', "Total Tuition", "Due Date", 'Remaining Balance', "Action"]}
                data={data?.students.map((student: OverdueStudent, i : number) => ({
                    "#" : i + 1,
                    "Student ID": student.student_id.student_id,
                    "Fullname" : `${student.student_id.firstname} ${student.student_id.middlename} ${student.student_id.lastname}`,
                    "Course" : student.course.code,
                    "Semester" : `${student.term} (${student.schoolYear})`,
                    "Total Tuition" : formatNumberToPeso(student.totalTuition),
                    'Due Date' : formatDateLong(student.due_date),
                    'Remaining Balance' : formatNumberToPeso(student.remainingBalance),
                    'Action': <PurpleButton onClick={() => notify(student.student_id._id, student._id)}>Notify</PurpleButton>
                })) || []}
            />}
            {data?.students.length > 0 && !loading && (
                <Pagination
                    sx={{ marginTop: '20px' }}
                    page={page}
                    count={data?.totalPages || 1}
                    onChange={handleChange}
                    color="secondary"
                />
            )}
        </div>
    )
}

export default OverdueStudents