import { Navigate, useParams } from "react-router-dom";
import { Title } from "../../../components/Text";
import { AddButton } from "../../../components/Button";
import { useEffect, useState } from "react";
import SemesterModal from "./ui/SemesterModal";
import useFetch from "../../../hooks/useFetch";
import { PurpleSelect } from "../../../components/Select";
import { Button, CircularProgress, MenuItem } from "@mui/material";
import { confirmDialog, errorAlert } from "../../../utils/swal";
import { deleteData } from "../../../utils/api";

const StudentSubjects = () => {
    const { id } = useParams();
    const [selectedSemester, setSelectedSemester] = useState<string>("");
    const { data : studentRes, loading : studentLoading } = useFetch(`/api/students/${id}`);
    const { data : semesterRes, loading : semesterLoading } = useFetch(`/api/semesters/${id}`);
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

    return (
        <div className="p-5 w-full">
            <div className="flex items-center justify-between mb-4">
                <Title label="Enrolled Subjects" />
                <div className="flex gap-3">
                    <AddButton onClick={() => setShowSemesterModal(true)} label="Add Semester" />
                    {selectedSemester && <Button sx={{ color: 'red'}} onClick={handleDeleteSemester}>Delete this semester</Button>}
                </div>
            </div>

            <div className="flex justify-between gap-5">
                {studentLoading ? <CircularProgress /> : 
                    <div className="mt-2 space-y-2">
                        <h1>Student ID: {studentRes?.student.student_id}</h1>
                        <h1>Student Name: {studentRes?.student.firstname} {studentRes?.student.middlename} {studentRes?.student.lastname}</h1>
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

            <SemesterModal 
                isOpen={showSemesterModal}
                onClose={() => setShowSemesterModal(false)}
                student={studentRes?.student}
            />
        </div>
    )
}

export default StudentSubjects