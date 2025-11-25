import { Navigate, useParams } from "react-router-dom";
import { Title } from "../../components/Text";
import { AddButton } from "../../components/Button";
import { useEffect, useMemo, useState } from "react";
import SemesterModal from "../../components/Modals/SemesterModal";
import useFetch from "../../hooks/useFetch";
import { PurpleSelect } from "../../components/Select";
import { Button, CircularProgress, MenuItem } from "@mui/material";
import { confirmDialog, errorAlert } from "../../utils/swal";
import { deleteData } from "../../utils/api";
import AddEnrolledSubject from "../../components/Modals/AddEnrolledSubject";
import PurpleTable from "../../components/Table";
import { formatNumberToPeso } from "../../utils/utils";

const StudentSubjects = () => {
    const { id } = useParams();
    const [selectedSemester, setSelectedSemester] = useState<string>("");
    const [showAddSubject, setShowAddSubject] = useState(false);
    const { data : studentRes, loading : studentLoading } = useFetch(`/api/students/${id}`);
    const { data : semesterRes, loading : semesterLoading } = useFetch(`/api/semesters/${id}`);
    const { data : enrolledSubjectsRes, loading : enrolledSubjectsLoading } = useFetch(`/api/enrolled-subjects?student_id=${id}&semester=${selectedSemester}`)
    const [showSemesterModal, setShowSemesterModal] = useState(false);

    useEffect(() => {
        if(semesterRes?.semesters.length > 0 && !semesterLoading) setSelectedSemester(semesterRes.semesters[0]._id)
    }, [semesterRes])

    if(!studentRes?.success && !studentLoading){
        return <Navigate to="/admin/students" />
    }

    const handleDeleteSemester = async () => {
        if (await confirmDialog("Are you sure?", "Do you really want to delete this semester?")) {
            const response = await deleteData(`/api/semesters/${selectedSemester}`);
            if (!response.success) {
                errorAlert("Error", response.message || "Failed to delete semester.");
                return;
            }
            window.location.reload();
        }
    };
    const semester = useMemo<Semester | undefined>(() => {
        if(!semesterRes?.semesters || semesterLoading) return undefined
        
        return semesterRes.semesters.find((semester : Semester) => semester._id === selectedSemester)
        
    }, [selectedSemester])

    const { data : semesterData  } = useFetch(semester ?  `/api/semesters/data/${semester._id}` : '')

    const totalTuition = useMemo(() => {
        if(!enrolledSubjectsRes?.enrolledSubjects) return 0

        return enrolledSubjectsRes.enrolledSubjects.reduce((total : number, enrolledSubject : EnrolledSubject) => {
            return total + (enrolledSubject.semester.pricePerUnit * enrolledSubject.subject.units)
        }, 0);

    }, [enrolledSubjectsRes])

    return (
        <div className="p-5 w-full md:h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <Title label="Enrolled Subjects" />
                <div className="flex gap-3">
                    <AddButton onClick={() => setShowSemesterModal(true)} label="Add Semester" />
                    {selectedSemester && <Button sx={{ color: 'red'}} onClick={handleDeleteSemester}>Delete this semester</Button>}
                </div>
            </div>

            <div className="flex justify-between gap-5 mb-6">
                {studentLoading ? <CircularProgress /> : 
                    <div className="mt-2 space-y-2">
                        <h1>Student ID: {studentRes?.student.student_id}</h1>
                        <h1>Student Name: {studentRes?.student.firstname} {studentRes?.student.middlename} {studentRes?.student.lastname} {selectedSemester && `(${semester?.enrollmentStatus})`}</h1>
                        {selectedSemester && (
                            <>
                            <h1>Semester: {semester?.term} Term ({semester?.schoolYear})</h1>
                            <h1>Price Per Unit: {formatNumberToPeso(semester?.pricePerUnit || 0)}</h1>
                            </>
                        )}
                    </div>
                }
                <div className="w-[400px]">
                    <PurpleSelect
                        label="Semester"
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        >
                        {semesterRes?.semesters.map((semester : Semester) => <MenuItem value={semester._id}>{semester.term} - {semester.schoolYear}</MenuItem>)}
                    </PurpleSelect>
                </div>
            </div>

            {semesterRes?.semesters.length < 1 && (
                <p className="text-center text-gray-500 mt-20">No semesters yet. Please add new one</p>
            )}

            {selectedSemester && enrolledSubjectsRes?.enrolledSubjects.length < 1 && (
                <p className="text-center text-gray-500 mt-20">No enrolled subjects found. Please add new one</p>
            )}

            {enrolledSubjectsLoading && (
                <div className="flex justify-center">
                    <CircularProgress />
                </div>
            )}
            
            <div className="p-3 bg-white rounded-md border border-gray-200 shadow-lg min-h-0 flex flex-col flex-grow gap-5">
            {!enrolledSubjectsLoading && enrolledSubjectsRes?.enrolledSubjects.length > 0 && (
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
            )}
                <div className="flex justify-end">
                    <div className="space-y-2">
                        <h1>Total Tuition: {formatNumberToPeso(totalTuition || 0)}</h1>
                        <h1>Paid Amount: {formatNumberToPeso(semesterData?.totalPaid || 0)}</h1>
                        <h1 className="font-semibold text-lg">Remaining Balance: {formatNumberToPeso(semesterData?.balance || 0)}</h1>
                    </div>
                </div>
            </div>

           {selectedSemester && enrolledSubjectsRes?.enrolledSubjects.length > 0 && (
                <div className="flex mt-6 items-center justify-end">
                    {selectedSemester && (
                        <AddButton label="Add subject" onClick={() => setShowAddSubject(true)}/>
                    )}
                </div>
            )}

            <AddEnrolledSubject 
                isOpen={showAddSubject}
                onClose={() => setShowAddSubject(false)}
                semester={selectedSemester}
                student_id={id as string}
            />

            <SemesterModal 
                isOpen={showSemesterModal}
                onClose={() => setShowSemesterModal(false)}
                student={studentRes?.student}
            />
        </div>
    )
}

export default StudentSubjects