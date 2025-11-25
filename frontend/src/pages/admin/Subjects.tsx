import { useState } from "react";
import { AddButton, DeleteButton, EditButton } from "../../components/Button";
import { Title } from "../../components/Text";
import SubjectModal from "../../components/Modals/SubjectModal";
import useFetch from "../../hooks/useFetch";
import PurpleTable from "../../components/Table";
import { CircularProgress, Pagination } from "@mui/material";
import { deleteData } from "../../utils/api";
import { confirmDialog, errorAlert, successAlert } from "../../utils/swal";
import { useDebounce } from "../../hooks/useDebounce";
import { SearchField } from "../../components/Textfield";

const Subjects = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<Subject>();
    const [searchTerm, setSearchTerm] = useState('');
    const searchDebounce = useDebounce(searchTerm, 500);
    const [page, setPage] = useState(1);
    const { data, loading } = useFetch(`/api/subjects?searchTerm=${searchDebounce}&page=${page}&limit=${30}`);

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
    
    const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <div className="p-5 w-full md:h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
            <Title label="Subjects" />
            <AddButton onClick={() => setShowModal(true)} label="Add Subject" />
        </div>

        <div className="mb-6 md:w-1/2">
            <SearchField 
                onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setPage(1)
                }}
                value={searchTerm}
                placeholder="Search by name or code"
            />
        </div>

        {/* Modal */}
        <SubjectModal isOpen={showModal} subject={selectedSubject} onClose={handleCloseModal} />

        {loading ? (
            <div className="w-full flex justify-center items-center h-64">
            <CircularProgress />
            </div>
        ) : data?.subjects.length === 0 ? (
            <p className="text-center text-gray-500 mt-20">
            No subjects found.
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

        {data?.subjects.length > 0 && (
            <Pagination
                sx={{ marginTop: '20px' }}
                page={page}
                count={data?.totalPages || 1}
                onChange={handleChange}
                color="primary"
            />
        )}
        </div>
    );
};

export default Subjects;

