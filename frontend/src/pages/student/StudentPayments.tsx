import { useState } from "react";
import { Title } from "../../components/Text";
import useFetch from "../../hooks/useFetch";
import PurpleTable from "../../components/Table";
import { CircularProgress, MenuItem, Pagination } from "@mui/material";
import PaymentModal from "../../components/Modals/PaymentModal";
import { formatNumberToPeso } from "../../utils/utils";
import { formatDateTime } from "../../utils/date";
import ReceiptModal from "../../components/Modals/ReceiptModal";
import { Eye } from "lucide-react";
import { PurpleSelect } from "../../components/Select";

const StudentPayments = () => {
    const [showModal, setShowModal] = useState(false);
    const [semester, setSemester] = useState<string>('All');
    const [selectedPayment, setSelectedPayment] = useState<string>();
    const { data : semestersRes } = useFetch('/api/semesters');
    const [page, setPage] = useState(1);
    const { data, loading } = useFetch(`/api/payments/me?page=${page}&limit=50&semester=${semester || ''}`);

    const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };
    return (
        <div className="p-5 w-full md:h-full flex flex-col">
            <PaymentModal isOpen={showModal} onClose={() => setShowModal(false)}/>
            <div className="flex md:items-center md:flex-row flex-col md:justify-between mb-6">
                <Title label="Payment History" />
                <div className="w-full md:w-[400px]">
                    <PurpleSelect
                        label="Semester"
                        value={semester}
                        onChange={(e) => {
                            setSemester(e.target.value)
                            setPage(1)
                        }}
                        >
                        <MenuItem value="All">All</MenuItem>
                        {semestersRes?.semesters.map((semester : Semester) => <MenuItem value={semester._id}>{semester.term} - {semester.schoolYear}</MenuItem>)}
                    </PurpleSelect>
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
            {data?.students.length > 0 && (
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

export default StudentPayments;