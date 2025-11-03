import { Modal, MenuItem } from "@mui/material";
import { memo, useState } from "react";
import { Check } from "lucide-react";
import { confirmDialog, errorAlert, successAlert } from "../../../../utils/swal";
import { postData } from "../../../../utils/api";
import LoadingScreen from "../../../../components/Loading";
import { PurpleTextField } from "../../../../components/Textfield";
import { PurpleSelect } from "../../../../components/Select";

interface SemesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student; 
}

const SemesterModal = ({ isOpen, onClose, student }: SemesterModalProps) => {
    const [term, setTerm] = useState<"1st" | "2nd" | "Summer">("1st");
    const [schoolYear, setSchoolYear] = useState<string>("");
    const [enrollmentStatus, setEnrollmentStatus] = useState<"Regular" | "Irregular">("Regular");
    const [loading, setLoading] = useState(false);

    const handleSaveSemester = async () => {
        if (
        await confirmDialog("Are you sure?", "Do you really want to add this semester?")
        ) {
        if (!term || !schoolYear || !enrollmentStatus) {
            errorAlert("Missing Information", "Please provide term, school year, and enrollment status.");
            return;
        }

        // Validate school year format
        if (!/^\d{4}-\d{4}$/.test(schoolYear)) {
            errorAlert("Invalid Format", "School year must be in the format YYYY-YYYY (e.g., 2025-2026).");
            return;
        }

        setLoading(true);

        const payload = {
            student_id: student._id,
            term,
            schoolYear,
            enrollmentStatus,
            course: student.course._id,
        };

        const response = await postData("/api/semesters", payload);

        if (!response.success) {
            errorAlert("Error", response.message || "Failed to save semester.");
            setLoading(false);
            return;
        }
         await successAlert("Success", `Semester added successfully.`);
        window.location.reload();
        }
    };

    return (
        <Modal open={isOpen} onClose={onClose} sx={{ zIndex: 1 }}>
        <div className="absolute top-1/2 left-1/2 w-96 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-md p-5">
            <LoadingScreen loading={loading} />

            {/* Title */}
            <h2 className="text-lg font-semibold text-purple-700 mb-4">
            Add Semester
            </h2>

            {/* School Year */}
            <PurpleTextField
            label="School Year (e.g., 2025-2026)"
            value={schoolYear}
            onChange={(e) => setSchoolYear(e.target.value)}
            fullWidth
            margin="normal"
            />

            {/* Term */}
            <PurpleSelect
                label="Term"
                value={term}
                onChange={(e) => setTerm(e.target.value as "1st" | "2nd" | "Summer")}
            >
                <MenuItem value="1st">1st</MenuItem>
                <MenuItem value="2nd">2nd</MenuItem>
                <MenuItem value="Summer">Summer</MenuItem>
            </PurpleSelect>

            {/* Enrollment Status */}
            <PurpleSelect
            label="Enrollment Status"
            value={enrollmentStatus}
            onChange={(e) => setEnrollmentStatus(e.target.value as "Regular" | "Irregular")}
            >
            <MenuItem value="Regular">Regular</MenuItem>
            <MenuItem value="Irregular">Irregular</MenuItem>
            </PurpleSelect>

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-4">
            <button
                onClick={onClose}
                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100 transition cursor-pointer"
            >
                Cancel
            </button>
            <button
                onClick={handleSaveSemester}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500 transition cursor-pointer"
            >
                <Check size={18} />
                Save
            </button>
            </div>
        </div>
        </Modal>
    );
};

export default memo(SemesterModal);