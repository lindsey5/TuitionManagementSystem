import { Modal, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { PurpleTextField } from "../Textfield";
import { postData, updateData } from "../../utils/api";
import LoadingScreen from "../Loading";
import { confirmDialog, errorAlert, successAlert } from "../../utils/swal";
import useFetch from "../../hooks/useFetch";

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student?: Student;
}

const StudentModal = ({ isOpen, onClose, student }: StudentModalProps) => {
    const [studentId, setStudentId] = useState("");
    const [firstname, setFirstname] = useState("");
    const [middlename, setMiddlename] = useState("");
    const [lastname, setLastname] = useState("");
    const [courseId, setCourseId] = useState<string>("");
    const [gender, setGender] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch all courses
    const { data: courseData } = useFetch("/api/courses");

    useEffect(() => {
        if (student) {
        setStudentId(student.student_id || "");
        setFirstname(student.firstname || "");
        setMiddlename(student.middlename || "");
        setLastname(student.lastname || "");
        setCourseId(student.course?._id || "");
        setGender(student.gender || "");
        setEmail(student.email || "");
        } else {
        setStudentId("");
        setFirstname("");
        setMiddlename("");
        setLastname("");
        setCourseId("");
        setGender("");
        setEmail("");
        }
    }, [student]);

    const handleSave = async () => {
        const action = student ? "update" : "add";

        if (
        await confirmDialog("Are you sure?", `Do you want to ${action} this student?`)
        ) {
        if (!studentId || !firstname || !lastname || !courseId || !gender || !email) {
            errorAlert("Missing Information", "Please fill in all required fields.");
            return;
        }

        setLoading(true);

        const studentData = {
            student_id: studentId,
            firstname,
            middlename,
            lastname,
            course: courseId,
            gender,
            email,
        };

        const response = !student
            ? await postData("/api/students", studentData)
            : await updateData(`/api/students/${student._id}`, studentData);

        if (!response.success) {
            setLoading(false);
            errorAlert("Error", response.message || "Failed to save student.");
            return;
        }

        await successAlert("Success", `Student ${action}ed successfully.`);
        window.location.reload();
        }
    };

    return (
        <Modal open={isOpen} onClose={onClose} sx={{ zIndex: 1 }}>
        <div className="absolute top-1/2 left-1/2 w-[550px] -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-md p-5">
            <LoadingScreen loading={loading} />

            <h2 className="text-lg font-semibold text-purple-700 mb-4">
            {student ? "Edit Student" : "Add Student"}
            </h2>

            {/* Grid Layout for Inputs */}
            <div className="grid grid-cols-2 gap-3">
            <PurpleTextField label="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} fullWidth />

            <PurpleTextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />

            <PurpleTextField label="First Name" value={firstname} onChange={(e) => setFirstname(e.target.value)} fullWidth />

            <PurpleTextField label="Middle Name (Optional)" value={middlename} onChange={(e) => setMiddlename(e.target.value)} fullWidth />

            <PurpleTextField label="Last Name" value={lastname} onChange={(e) => setLastname(e.target.value)} fullWidth />

            <PurpleTextField select label="Gender" value={gender} onChange={(e) => setGender(e.target.value)} fullWidth>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
            </PurpleTextField>
            </div>

            {/* Full Width Dropdown for Course */}
            <PurpleTextField select label="Course" value={courseId} onChange={(e) => setCourseId(e.target.value)} fullWidth margin="normal">
            {courseData?.courses?.map((c: Course) => (
                <MenuItem key={c._id} value={c._id}>
                {c.name}
                </MenuItem>
            ))}
            </PurpleTextField>

            <div className="flex justify-end gap-2 mt-4">
            <button onClick={onClose} className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100 transition cursor-pointer">
                Cancel
            </button>
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500 transition cursor-pointer">
                <Check size={18} />
                Save
            </button>
            </div>
        </div>
        </Modal>
    );
};

export default StudentModal;
