import { Modal, Chip } from "@mui/material";
import { memo, useState } from "react";
import { Check } from "lucide-react";
import LoadingScreen from "../Loading";
import { SearchDropdown } from "../Textfield";
import { useDebounce } from "../../hooks/useDebounce";
import useFetch from "../../hooks/useFetch";
import { postData } from "../../utils/api";
import { confirmDialog, errorAlert, successAlert } from "../../utils/swal";

interface EnrolledSubjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    student_id: string; 
    semester: string
}

const AddEnrolledSubjectModal = ({ isOpen, onClose, student_id, semester }: EnrolledSubjectModalProps) => {
    const [subject, setSubject] = useState<Subject>();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const searchDebounce = useDebounce(searchTerm, 500);
    const { data : subjectsData, loading : subjectsLoading } = useFetch(`/api/subjects?searchTerm=${searchDebounce}`);
    const [loading, setLoading] = useState(false);

    const addSubject = async () => {
        if(await confirmDialog('Are you sure?', 'Do you want to add this subject?')){
            setLoading(true)
            const response = await postData('/api/enrolled-subjects', { student_id, semester, subject: subject?._id});
            setLoading(false);
            if (!response.success) {
                errorAlert("Error", response.message || "Failed to save student.");
                return;
            }

            await successAlert('Success', 'Subject successfully added');
            window.location.reload();
        }
    }

    return (
        <>
        <LoadingScreen loading={loading}/>
        <Modal open={isOpen} onClose={onClose} sx={{ zIndex: 1 }}>
        <div className="absolute top-1/2 left-1/2 w-96 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-md p-5">
            <LoadingScreen loading={loading} />

            {/* Title */}
            <h2 className="text-lg font-semibold text-purple-700 mb-4">
            Add Suject
            </h2>

            {!subject && (
            <SearchDropdown
                value={searchTerm}
                isLoading={subjectsLoading}
                placeholder="Search subject"
                onChange={(e) => setSearchTerm(e.target.value)}
                onSelect={(value) => setSubject(value)}
                options={
                subjectsData?.subjects.map((s: Subject) => ({
                    label: `${s.code} - ${s.name}`,
                    value: s,
                })) || []
                }
            />
            )}

            
            {subject && (
            <div className="flex gap-5 items-center">
                <h1 className="text-gray-500">Subject:</h1>
                <Chip
                onDelete={() => setSubject(undefined)}
                label={`${subject.code} - ${subject.name}`}
                />
            </div>
            )}


            {/* Actions */}
            <div className="flex justify-end gap-2 mt-4">
            <button
                onClick={onClose}
                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100 transition cursor-pointer"
            >
                Cancel
            </button>
            <button
                onClick={addSubject}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500 transition cursor-pointer"
            >
                <Check size={18} />
                Add
            </button>
            </div>
        </div>
        </Modal>
        </>
    );
};

export default memo(AddEnrolledSubjectModal);