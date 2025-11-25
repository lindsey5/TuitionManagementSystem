import { useState } from "react";
import { AddButton, DeleteButton, EditButton } from "../../components/Button";
import { Title } from "../../components/Text";
import StudentModal from "../../components/Modals/StudentModal"; // ✅ Change Modal
import useFetch from "../../hooks/useFetch";
import PurpleTable from "../../components/Table";
import { CircularProgress, Pagination, Tooltip } from "@mui/material";
import { deleteData } from "../../utils/api";
import { confirmDialog, errorAlert, successAlert } from "../../utils/swal";
import { Book } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";
import { SearchField } from "../../components/Textfield";

const Students = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student>();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const searchDebounce = useDebounce(searchTerm, 500);
    const { data, loading } = useFetch(`/api/students?page=${page}&searchTerm=${searchDebounce}`);
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

    const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <div className="p-5 w-full md:h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
            <Title label="Students" />
            <AddButton onClick={() => setShowModal(true)} label="Add Student" />
        </div>

        <div className="mb-6 md:w-1/2">
            <SearchField 
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                placeholder="Search by firstname, middlename, lastname, student id or email"
            />
        </div>

        {/* Modal */}
        <StudentModal isOpen={showModal} student={selectedStudent} onClose={handleCloseModal} />

        {loading ? (
            <div className="w-full flex justify-center items-center h-64">
            <CircularProgress />
            </div>
        ) : data?.students?.length === 0 ? (
            <p className="text-center text-gray-500 mt-20">
            No students found.
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
                        <Tooltip title="Enrolled Subjects">
                            <button
                                className="flex items-center gap-2 py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition cursor-pointer"
                                onClick={() => navigate(`/admin/student-subjects/${student._id}`)}
                            >
                                <Book />
                            </button>
                        </Tooltip>
                    </div>
                ),
                })) || []
            }
            />
        )}

        {data?.students.length > 0 && (
            <Pagination
                sx={{ marginTop: '20px' }}
                page={page}
                count={data?.totalPages || 1}
                onChange={handleChange}
                color="secondary"
            />
            )}
        </div>
    );
};

export default Students;
