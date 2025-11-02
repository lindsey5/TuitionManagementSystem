import { useState } from "react";
import { AddButton, DeleteButton, EditButton } from "../../../components/Button";
import { Title } from "../../../components/Text";
import SubjectModal from "./ui/SubjectModal";
import useFetch from "../../../hooks/useFetch";
import PurpleTable from "../../../components/Table";
import { CircularProgress } from "@mui/material";
import { deleteData } from "../../../utils/api";
import { confirmDialog, errorAlert, successAlert } from "../../../utils/swal";

const Subjects = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<Subject>();
    const { data, loading } = useFetch('/api/subjects'); // ✅ Updated endpoint

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedSubject(undefined);
    };

    const handleEdit = (subject: Subject) => {
        setSelectedSubject(subject);
        setShowModal(true);
    };

    const handleDelete = async (subjectId: string) => {
        if (await confirmDialog('Are you sure?', 'Do you really want to delete this subject?')) {
        const response = await deleteData(`/api/subjects/${subjectId}`);
        if (!response.success) {
            errorAlert('Error', response.message || 'Failed to delete subject.');
            return;
        }
        await successAlert('Deleted', 'Subject deleted successfully.');
        window.location.reload();
        }
    };

    return (
        <div className="p-5 w-full">
        <div className="flex items-center justify-between">
            <Title label="Subjects" />
            <AddButton onClick={() => setShowModal(true)} label="Add Subject" />
        </div>

        {/* Modal */}
        <SubjectModal isOpen={showModal} subject={selectedSubject} onClose={handleCloseModal} />

        {loading ? (
            <div className="w-full flex justify-center items-center h-64">
            <CircularProgress />
            </div>
        ) : data?.subjects.length === 0 ? (
            <p className="text-center text-gray-500 mt-20">
            No subjects available. Click "Add Subject" to create one.
            </p>
        ) : (
            <PurpleTable
            columns={['#', 'Subject Name', 'Subject Code', 'Units', 'Actions']}
            data={data?.subjects.map((subject: Subject, i: number) => ({
                '#': i + 1,
                'Subject Name': subject.name,
                'Subject Code': subject.code,
                'Units': subject.units,
                'Actions': (
                <div className="flex items-center gap-4">
                    <EditButton onClick={() => handleEdit(subject)} />
                    <DeleteButton onClick={() => handleDelete(subject._id as string)} />
                </div>
                ),
            })) || []}
            />
        )}
        </div>
    );
};

export default Subjects;
