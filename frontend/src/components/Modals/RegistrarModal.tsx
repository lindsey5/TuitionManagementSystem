import { Modal } from "@mui/material";
import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { PurpleTextField } from "../Textfield";
import { postData, updateData } from "../../utils/api";
import LoadingScreen from "../Loading";
import { confirmDialog, errorAlert, successAlert } from "../../utils/swal";

interface RegistrarModalProps {
    isOpen: boolean;
    onClose: () => void;
    registrar?: Registrar;
}

const RegistrarModal = ({ isOpen, onClose, registrar }: RegistrarModalProps) => {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (registrar) {
        setFirstname(registrar.firstname || "");
        setLastname(registrar.lastname || "");
        setEmail(registrar.email || "");
        setPassword(""); // leave blank for security
        } else {
        setFirstname("");
        setLastname("");
        setEmail("");
        setPassword("");
        }
    }, [registrar]);

    const handleSave = async () => {
        const action = registrar ? "update" : "add";

        if (
        await confirmDialog("Are you sure?", `Do you want to ${action} this registrar?`)
        ) {
        if (!firstname || !lastname || !email || (!registrar && !password)) {
            errorAlert("Missing Information", "Please fill in all required fields.");
            return;
        }

        setLoading(true);

        const registrarData: any = {
            firstname,
            lastname,
            email,
        };

        if (!registrar) registrarData.password = password; // password only when creating
        if (registrar && password) registrarData.password = password; // allow password update

        const response = !registrar
            ? await postData("/api/registrars", registrarData)
            : await updateData(`/api/registrars/${registrar._id}`, registrarData);

        if (!response.success) {
            setLoading(false);
            errorAlert("Error", response.message || "Failed to save registrar.");
            return;
        }

        await successAlert(
            "Success",
            `Registrar ${action}ed successfully.`
        );
        window.location.reload();
        }
    };

    return (
        <Modal open={isOpen} onClose={onClose} sx={{ zIndex: 1 }}>
        <div className="absolute top-1/2 left-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-md p-5">
            <LoadingScreen loading={loading} />

            <h2 className="text-lg font-semibold text-purple-700 mb-4">
            {registrar ? "Edit Registrar" : "Add Registrar"}
            </h2>

            <div className="grid grid-cols-2 gap-3">
            <PurpleTextField
                label="First Name"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                fullWidth
            />

            <PurpleTextField
                label="Last Name"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                fullWidth
            />

            <PurpleTextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
            />

            {!registrar && (
                <PurpleTextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                />
            )}

            {registrar && (
                <PurpleTextField
                label="New Password (Optional)"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                />
            )}
            </div>

            <div className="flex justify-end gap-2 mt-4">
            <button
                onClick={onClose}
                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100 transition cursor-pointer"
            >
                Cancel
            </button>
            <button
                onClick={handleSave}
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

export default RegistrarModal;
