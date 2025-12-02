import { MenuItem, Modal } from "@mui/material"
import { useState } from "react";
import { PurpleTextField } from "../Textfield";
import { fetchData, postData } from "../../utils/api";
import { confirmDialog, errorAlert } from "../../utils/swal";
import useFetch from "../../hooks/useFetch";
import { PurpleSelect } from "../Select";
import { formatNumberToPeso } from "../../utils/utils";
import { PurpleButton } from "../Button";
import ReceiptModal from "./ReceiptModal";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentModal = ({ isOpen, onClose } : PaymentModalProps) => {
    const [search, setSearch] = useState('');
    const [student, setStudent] = useState<Student>();
    const [semester, setSemester] = useState();
    const [amount, setAmount] = useState<number>();
    const { data } = useFetch(student ? `/api/semesters/${student?._id}` : '');
    const { data : semesterData } = useFetch(semester ? `/api/semesters/data/${semester}` : '');
    const [isSuccess, setIsSuccess] = useState(false);
    const [paymentId, setPaymentId] = useState<string>();
    const [loading, setLoading] = useState(false);

    const searchStudent = async () => {
        const response = await fetchData(`/api/students/search?searchTerm=${search}`);

        if(!response.success){
            await errorAlert('Failed', response.message || 'Something went wrong')
            return;
        }

        setStudent(response.student);

    }

    const cancel = () => {
        setStudent(undefined)
        setSearch('')
        setSemester(undefined)
    }

    const createPayment = async () => {
        if(await confirmDialog("Confirm Payment", "Are you sure you want to create this payment?")){
            setLoading(true)
            const response = await postData('/api/payments', {
                student_id: student?._id,
                amount,
                semester
            })
            setLoading(false)

            if(!response.success){
                await errorAlert('Failed', response.message || 'Something went wrong');
                return;
            }

            setIsSuccess(true)
            setPaymentId(response.payment._id);
        }
    }

    return (
        <>
        <ReceiptModal 
            open={isSuccess}
            payment_id={paymentId || ''}
            onClose={() => {
                setIsSuccess(false)
                window.location.reload();
            }}
        />
        <Modal open={isOpen} onClose={onClose} sx={{ zIndex: 1 }}>
            <div className="absolute top-1/2 left-1/2 w-96 -translate-x-1/2 -translate-y-1/2 space-y-4 bg-white rounded-lg shadow-md p-5">
                <h2 className="text-xl font-semibold text-purple-700">Create Payment</h2>
                {!student ? <PurpleTextField 
                    fullWidth
                    label="Search Student"
                    placeholder="Enter student id"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                /> : 
                    <>
                        <h1>Student id: {student.student_id}</h1>
                        <p>{`${student.firstname} ${student?.middlename} ${student.lastname}`}</p>
                        
                        {semesterData?.semester && (
                            <>
                            <p className="text-sm">Total Tuition: {formatNumberToPeso(semesterData?.semester.totalTuition || 0)}</p>
                            <p className="text-sm">Paid: {formatNumberToPeso(semesterData?.totalPaid || 0)}</p>
                            <p className="text-sm">Remaining Balance: {formatNumberToPeso(semesterData?.semester.remainingBalance || 0)}</p>
                            </>
                        )}
                        <PurpleSelect
                            label="Semester to pay"
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                            >
                            {data?.semesters.map((semester : Semester) => <MenuItem value={semester._id}>{semester.term} - {semester.schoolYear}</MenuItem>)}
                        </PurpleSelect>
                        <PurpleTextField
                            label="Amount"
                            type="number"
                            value={amount || ""}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            fullWidth
                        />
                    </>
                    
                }

            <div className="mt-4 flex justify-end gap-4">
                {student && <button
                    onClick={cancel}
                    className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                >
                    Cancel
                </button>}
                <PurpleButton
                    disabled={loading && student ? (!semester || !amount || !student || !semesterData?.semester) : !search}
                    onClick={student ? createPayment : searchStudent}
                >
                    {!student ? 'Search' : 'Create'}
                </PurpleButton>
            </div>


            </div>
        
        </Modal>
        </>
    )
}

export default PaymentModal