import { Title } from "../../components/Text";
import { useEffect, useMemo, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { PurpleSelect } from "../../components/Select";
import {  CircularProgress, MenuItem } from "@mui/material";
import PurpleTable from "../../components/Table";
import { formatNumberToPeso } from "../../utils/utils";
import { useUser } from "../../contexts/UserContext";
import { formatDateLong } from "../../utils/date";

const StudentEnrolledSubjects = () => {
    const { user, loading : studentLoading } = useUser<Student>();
    const [selectedSemester, setSelectedSemester] = useState<string>("");
    const { data : semestersRes, loading : semestersLoading } = useFetch(user?._id ? `/api/semesters` : '');
    const { data : enrolledSubjectsRes, loading : enrolledSubjectsLoading } = useFetch(user?._id ? `/api/enrolled-subjects/me?semester=${selectedSemester}` : '')

    useEffect(() => {
        if(semestersRes?.semesters.length > 0 && !semestersLoading) setSelectedSemester(semestersRes.semesters[0]._id)
    }, [semestersRes])

    const semester = useMemo<Semester | undefined>(() => {
        if(!semestersRes?.semesters || semestersLoading) return undefined
        
        return semestersRes.semesters.find((semester : Semester) => semester._id === selectedSemester)
        
    }, [selectedSemester])

    const { data : semesterData } = useFetch(semester ?  `/api/semesters/data/${semester._id}` : '')

    const totalTuition = useMemo(() => {
        if(!enrolledSubjectsRes?.enrolledSubjects) return 0

        return enrolledSubjectsRes.enrolledSubjects.reduce((total : number, enrolledSubject : EnrolledSubject) => {
            return total + (enrolledSubject.semester.pricePerUnit * enrolledSubject.subject.units)
        }, 0);

    }, [enrolledSubjectsRes])

    return (
        <div className="p-5 w-full md:h-full flex flex-col">
            <Title label="Enrolled Subjects" />

            <div className="flex flex-col md:flex-row md:justify-between gap-5 mb-6">
                {studentLoading ? <CircularProgress /> : 
                    <div className="mt-2 space-y-2">
                        <h1>Student ID: {user?.student_id}</h1>
                        <h1>Student Name: {user?.firstname} {user?.middlename} {user?.lastname} {selectedSemester && `(${semester?.enrollmentStatus})`}</h1>
                        {selectedSemester && (
                            <>
                            <h1>Semester: {semester?.term} Term ({semester?.schoolYear})</h1>
                            <h1>Year Level: {semester?.yearLevel}</h1>
                            <h1>Price Per Unit: {formatNumberToPeso(semester?.pricePerUnit || 0)}</h1>
                            <h1>Enrollment Classification: {semester?.classification}</h1>
                            {semester?.due_date && <h1>Due Date: {formatDateLong(semester?.due_date)}</h1>}
                            </>
                        )}
                    </div>
                }
                <div className="md:w-[400px]">
                    <PurpleSelect
                        label="Semester"
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        >
                        {semestersRes?.semesters.map((semester : Semester) => <MenuItem value={semester._id}>{semester.term} - {semester.schoolYear}</MenuItem>)}
                    </PurpleSelect>
                </div>
                <div className="md:hidden block space-y-2">
                    <h1>Total Tuition: {formatNumberToPeso(totalTuition || 0)}</h1>
                    <h1>Paid Amount: {formatNumberToPeso(semesterData?.totalPaid || 0)}</h1>
                    <h1 className="font-semibold text-lg">Remaining Balance: {formatNumberToPeso(semesterData?.balance || 0)}</h1>
                </div>
            </div>

            {semestersRes?.semesters.length < 1 && (
                <p className="text-center text-gray-500 mt-20">No enrolled semesters yet</p>
            )}

            {selectedSemester && enrolledSubjectsRes?.enrolledSubjects.length < 1 && (
                <p className="text-center text-gray-500 mt-20">No enrolled subjects yet</p>
            )}

            {enrolledSubjectsLoading && (
                <div className="flex justify-center">
                    <CircularProgress />
                </div>
            )}
            
            {!enrolledSubjectsLoading && enrolledSubjectsRes?.enrolledSubjects.length > 0 && (
                <div className="p-3 bg-white rounded-md border border-gray-200 shadow-lg min-h-0 flex flex-col flex-grow gap-5">
                <PurpleTable 
                    columns={['Subject', 'Code', 'Units', 'Semester', 'Amount']}
                    data={enrolledSubjectsRes?.enrolledSubjects.map((enrolledSubject : EnrolledSubject) => ({
                        "Subject": enrolledSubject.subject.name,
                        "Code": enrolledSubject.subject.code,
                        "Units": enrolledSubject.subject.units,
                        "Semester": `${enrolledSubject.semester.term} Term - ${enrolledSubject.semester.schoolYear}`,
                        "Amount": formatNumberToPeso(enrolledSubject.semester.pricePerUnit * enrolledSubject.subject.units)
                    })) || []}
                />
                <div className="flex justify-end">
                    <div className="space-y-2">
                        <h1>Total Tuition: {formatNumberToPeso(totalTuition || 0)}</h1>
                        {semester?.discount !== 0 && <h1 className="text-red-500">Discount: - {semester?.discount} %</h1>}
                        <h1>Paid Amount: {formatNumberToPeso(semesterData?.totalPaid || 0)}</h1>
                        <h1 className="font-semibold text-lg">Remaining Balance: {formatNumberToPeso(semester?.remainingBalance || 0)}</h1>
                    </div>
                </div>
                </div>
            )}
        </div>
    )
}

export default StudentEnrolledSubjects