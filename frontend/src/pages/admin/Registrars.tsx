import { useState } from "react";
import { AddButton, DeleteButton, EditButton } from "../../components/Button"
import { Title } from "../../components/Text"
import RegistrarModal from "../../components/Modals/RegistrarModal";
import useFetch from "../../hooks/useFetch";
import PurpleTable from "../../components/Table";
import { CircularProgress } from "@mui/material";
import { confirmDialog, errorAlert, successAlert } from "../../utils/swal";
import { deleteData } from "../../utils/api";

const Registrars = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedRegistrar, setSelectedRegistrar] = useState<Registrar>()
    const { data, loading } = useFetch('/api/registrars');

    const handleClose = () => {
        setShowModal(false)
        setSelectedRegistrar(undefined)
    }

    const handleEdit = (registrar : Registrar) => {
        setShowModal(true)
        setSelectedRegistrar(registrar)
    }
    
    const handleDelete = async (id: string) => {
        if (await confirmDialog("Delete Registrar?", "This action cannot be undone.")) {

            const response = await deleteData(`/api/registrars/${id}`);

            if (!response.success) {
                errorAlert("Error", response.message || "Failed to delete registrar.");
                return;
            }

            await successAlert("Deleted", "Registrar has been removed successfully.");
            window.location.reload();
        }
    };


    return (
        <div className="md:h-screen p-5 w-full flex flex-col">
            <RegistrarModal 
                isOpen={showModal}
                registrar={selectedRegistrar}
                onClose={handleClose}
            />
            <div className="flex items-center justify-between mb-6">
                <Title label="School Registrars" />
                <AddButton onClick={() => setShowModal(true)} label="Create New Registrar" />
            </div>
            {loading ? (
            <div className="w-full flex justify-center items-center h-64">
                <CircularProgress />
            </div>) 
            : 
            data?.registrars.length === 0 ? (
                <p className="text-center text-gray-500 mt-20">No registrars found.</p>
            ) :
            <PurpleTable 
                columns={['#', 'Firstname', 'Lastname', 'Email', 'Actions']}
                data={data?.registrars.map((registrar : Registrar, i : number) => ({
                    '#' : i + 1,
                    'Firstname' : registrar.firstname,
                    'Lastname' : registrar.lastname,
                    'Email' : registrar.email,
                    'Created At' : registrar.createdAt,
                    "Actions" : (
                        <div className="flex items-center gap-4">
                            <EditButton onClick={() => handleEdit(registrar)} />
                            <DeleteButton onClick={() => handleDelete(registrar._id)} />
                        </div>
                    )
                })) || []}
            />}
        </div>
    )
}

export default Registrars