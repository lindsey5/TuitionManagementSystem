import { useState } from "react";
import { AddButton, DeleteButton, EditButton } from "../../../components/Button";
import { Title } from "../../../components/Text";
import StudentModal from "./ui/StudentModal"; // ✅ Change Modal
import useFetch from "../../../hooks/useFetch";
import PurpleTable from "../../../components/Table";
import { CircularProgress } from "@mui/material";
import { deleteData } from "../../../utils/api";
import { confirmDialog, errorAlert, successAlert } from "../../../utils/swal";

const Students = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student>();
    const { data, loading } = useFetch("/api/students");
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedStudent(undefined);
    };

    const handleEdit = (student: Student) => {
        setSelectedStudent(student);
        setShowModal(true);
    };

    const handleDelete = async (studentId: string) => {
        if (await confirmDialog("Are you sure?", "Do you really want to delete this student?")) {
        const response = await deleteData(`/api/students/${studentId}`);
        if (!response.success) {
            errorAlert("Error", response.message || "Failed to delete student.");
            return;
        }
        await successAlert("Deleted", "Student deleted successfully.");
        window.location.reload();
        }
    };

    return (
        <div className="p-5 w-full">
        {/* Header */}
        <div className="flex items-center justify-between">
            <Title label="Students" />
            <AddButton onClick={() => setShowModal(true)} label="Add Student" />
        </div>

        {/* Modal */}
        <StudentModal isOpen={showModal} student={selectedStudent} onClose={handleCloseModal} />

        {loading ? (
            <div className="w-full flex justify-center items-center h-64">
            <CircularProgress />
            </div>
        ) : data?.students?.length === 0 ? (
            <p className="text-center text-gray-500 mt-20">
            No students available. Click "Add Student" to create one.
            </p>
        ) : (
            <PurpleTable
            columns={["#", "Student ID", "Full Name", "Course", "Gender", "Email", "Actions"]}
            data={
                data?.students?.map((student: Student, i: number) => ({
                "#": i + 1,
                "Student ID": student.student_id,
                "Full Name": `${student.firstname} ${student.middlename || ""} ${student.lastname}`,
                "Course": student.course?.name || "N/A",
                "Gender": student.gender,
                "Email": student.email,
                Actions: (
                    <div className="flex items-center gap-4">
                    <EditButton onClick={() => handleEdit(student)} />
                    <DeleteButton onClick={() => handleDelete(student._id as string)} />
                    </div>
                ),
                })) || []
            }
            />
        )}
        </div>
    );
};

export default Students;
