import { Modal, MenuItem } from "@mui/material";
import { memo, useState } from "react";
import { Check } from "lucide-react";
import { confirmDialog, errorAlert, successAlert } from "../../utils/swal";
import { postData } from "../../utils/api";
import LoadingScreen from "../Loading";
import { PurpleTextField } from "../Textfield";
import { PurpleSelect, SchoolYear } from "../Select";
import { getTomorrow } from "../../utils/date";

interface SemesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student; 
}

const SemesterModal = ({ isOpen, onClose, student }: SemesterModalProps) => {
    const [term, setTerm] = useState<"1st" | "2nd" | "Summer">("1st");
    const [dueDate, setDueDate] = useState<string>("");
    const [schoolYear, setSchoolYear] = useState<string>("");
    const [enrollmentStatus, setEnrollmentStatus] = useState<"Regular" | "Irregular">("Regular");
    const [classification, setClassification] = useState<Semester['classification']>('regular');
    const [discount, setDiscount] = useState(0);
    const [pricePerUnit, setPricePerUnit] = useState<number>();
    const [loading, setLoading] = useState(false);

    const handleSaveSemester = async () => {
        if(!schoolYear){
            errorAlert('Failed', 'Please select school year.')
            return;
        }

        if(!pricePerUnit){
            errorAlert('Failed', 'Please add price per units.')
            return;
        }

        if(classification !== 'regular' && !discount){
            errorAlert('Failed', 'Please add discount')
            return;
        }

        if(classification !== 'full_scholar' && !dueDate){
            errorAlert('Failed', 'Please select due date.');
            return;
        }

        if (await confirmDialog("Are you sure?", "Do you really want to add this semester?")) {
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
                pricePerUnit,
                classification,
                discount,
                due_date: dueDate
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
        <div className="w-full max-w-2xl absolute top-1/2 left-1/2 w-96 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-md p-5">
            <LoadingScreen loading={loading} />

            {/* Title */}
            <h2 className="text-lg font-semibold text-purple-700 mb-4">
            Add Semester
            </h2>

            <div className="w-full max-w-6xl grid md:grid-cols-2 gap-4 items-center">
                {/* School Year */}
                <SchoolYear schoolYear={schoolYear} setSchoolYear={setSchoolYear}/>

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
                <PurpleSelect
                    label="Enrollment Classification"
                    value={classification}
                    onChange={(e) => {
                        if(e.target.value === 'full_scholar') setDiscount(100);
                        else setDiscount(0);
                        setDueDate('');
                        setClassification(e.target.value as Semester['classification'])
                    }}
                >
                    <MenuItem value="regular">Regular</MenuItem>
                    <MenuItem value="full_scholar">Full Scholar</MenuItem>
                    <MenuItem value="partial_scholar">Partial Scholar</MenuItem>
                    <MenuItem value="academic_grant">Academic Grant</MenuItem>
                    <MenuItem value="athlete_scholar">Athlete Scholar</MenuItem>
                    <MenuItem value="sponsored">Sponsored</MenuItem>
                </PurpleSelect>

                {classification !== 'full_scholar' && classification !== 'regular' && <PurpleTextField
                    label="Discount %"
                    type="number"
                    value={discount || ''}
                    onKeyDown={(e) => {
                        if (e.key === '-' || e.key === '.') e.preventDefault();
                    }}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    fullWidth
                />}

                <PurpleTextField
                    label="Price (Per Unit)"
                    type="number"
                    value={pricePerUnit || ''}
                    onChange={(e) => setPricePerUnit(Number(e.target.value))}
                    fullWidth
                />
                {classification !== 'full_scholar' && <PurpleTextField
                    label="Due Date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: getTomorrow() }}
                />}
            </div>

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