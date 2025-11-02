import { Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { PurpleTextField } from "../../../../components/Textfield";
import { postData, updateData } from "../../../../utils/api";
import LoadingScreen from "../../../../components/Loading";
import { confirmDialog, errorAlert, successAlert } from "../../../../utils/swal";

interface SubjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    subject?: Subject; // optional when editing
}

const SubjectModal = ({ isOpen, onClose, subject }: SubjectModalProps) => {
    const [name, setName] = useState<string>("");
    const [code, setCode] = useState<string>("");
    const [units, setUnits] = useState<number>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setName(subject?.name || "");
        setCode(subject?.code || "");
        setUnits(subject?.units || 0);
    }, [subject]);

    const handleSaveSubject = async () => {
        const action = subject ? "update" : "add";

        if (
        await confirmDialog(
            "Are you sure?",
            `Do you really want to ${action} this subject?`
        )
        ) {
        if (!name || !code || !units) {
            errorAlert(
            "Missing Information",
            "Please provide subject name, code, and units."
            );
            return;
        }

        setLoading(true);

        const response = !subject
            ? await postData("/api/subjects", { name, code, units })
            : await updateData(`/api/subjects/${subject._id}`, { name, code, units });

        if (!response.success) {
            errorAlert("Error", response.message || "Failed to save subject.");
            setLoading(false);
            return;
        }

        await successAlert("Success", `Subject ${action}ed successfully.`);
        window.location.reload();
        }
    };

    return (
        <Modal open={isOpen} onClose={onClose} sx={{ zIndex: 1 }}>
        <div className="absolute top-1/2 left-1/2 w-96 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-md p-5">
            <LoadingScreen loading={loading} />

            <h2 className="text-lg font-semibold text-purple-700 mb-4">
            {subject ? "Edit Subject" : "Add Subject"}
            </h2>

            <PurpleTextField
            label="Subject Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            />

            <PurpleTextField
            label="Subject Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            fullWidth
            margin="normal"
            />

            <PurpleTextField
                label="Units"
                type="number"
                value={units || ""}
                onChange={(e) => setUnits(Number(e.target.value))}
                fullWidth
                margin="normal"
            />

            <div className="flex justify-end gap-2 mt-4">
            <button
                onClick={onClose}
                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100 transition cursor-pointer"
            >
                Cancel
            </button>
            <button
                onClick={handleSaveSubject}
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

export default SubjectModal;
