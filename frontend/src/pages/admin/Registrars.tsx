import { useState } from "react";
import { AddButton } from "../../components/Button"
import { Title } from "../../components/Text"

const Registrars = () => {
    const [showModal, setShowModal] = useState(false);
    console.log(showModal)
    return (
        <div className="p-5 w-full md:h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <Title label="School Registrars" />
                <AddButton onClick={() => setShowModal(true)} label="Create New Registrar" />
            </div>

        </div>
    )
}

export default Registrars