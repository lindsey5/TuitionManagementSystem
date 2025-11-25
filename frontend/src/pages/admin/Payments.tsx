import { useState } from "react";
import { AddButton } from "../../components/Button";
import { Title } from "../../components/Text";
import useFetch from "../../hooks/useFetch";
import PurpleTable from "../../components/Table";
import { CircularProgress, Pagination } from "@mui/material";
import { useDebounce } from "../../hooks/useDebounce";
import { SearchField } from "../../components/Textfield";
import PaymentModal from "../../components/Modals/PaymentModal";
import { formatNumberToPeso } from "../../utils/utils";
import { formatDateTime } from "../../utils/date";
import ReceiptModal from "../../components/Modals/ReceiptModal";
import { Eye } from "lucide-react";

const Payments = () => {
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const searchDebounce = useDebounce(searchTerm, 500);
    const [selectedPayment, setSelectedPayment] = useState<string>();
    const [page, setPage] = useState(1);
    const { data, loading } = useFetch(`/api/payments?page=${page}&limit=50&searchTerm=${searchDebounce}`);

    const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };
    return (
        <div className="p-5 w-full md:h-full flex flex-col">
            <PaymentModal isOpen={showModal} onClose={() => setShowModal(false)}/>
            <div className="flex items-center justify-between mb-6">
                <Title label="Payment History" />
                <AddButton onClick={() => setShowModal(true)} label="Create Payment" />
            </div>

            <div className="flex md:flex-row flex-col md:items-center md:justify-between gap-4">
                <div className="mb-6 md:w-1/2">
                    <SearchField 
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setPage(1)
                        }}
                        value={searchTerm}
                        placeholder="Search by student id"
                    />
                </div>
            </div>

            {loading ? (
            <div className="w-full flex justify-center items-center h-64">
                <CircularProgress />
            </div>) 
            : 
            data?.payments.length === 0 ? (
                <p className="text-center text-gray-500 mt-20">No payments found.</p>
            ) :
            <PurpleTable 
                columns={['#', 'Student ID', 'Firstname', 'Lastname', 'Semester', "Amount", "Payment Date", "Action"]}
                data={data?.payments.map((payment : Payment, i : number) => ({
                    '#' : i + 1,
                    'Student ID' : payment.student_id.student_id,
                    'Firstname' : payment.student_id.firstname,
                    "Lastname" : payment.student_id.lastname,
                    "Semester" : `${payment.semester.term} (${payment.semester.schoolYear})`,
                    "Amount" : formatNumberToPeso(payment.amount),
                    "Payment Date" : formatDateTime(payment.createdAt),
                    "Action" : (
                        <button 
                            className="p-2 rounded hover:bg-purple-100 transition"
                            onClick={() => setSelectedPayment(payment._id)}
                        >
                            <Eye className="w-5 h-5 text-purple-600" />
                        </button>
                    )
                })) || []}
            />}
            <ReceiptModal 
                open={selectedPayment !== undefined}
                onClose={() => setSelectedPayment(undefined)}
                payment_id={selectedPayment || ''}
            />
            {data?.payments.length > 0 && (
                <Pagination
                    sx={{ marginTop: '20px' }}
                    page={page}
                    count={data?.totalPages || 1}
                    onChange={handleChange}
                    color="secondary"
                />
            )}
        </div>
    )
}

export default Payments;