import { X } from 'lucide-react';
import { Modal } from '@mui/material';
import useFetch from '../../hooks/useFetch';
import { formatDateLong, formatDateTime } from '../../utils/date';
import { formatNumberToPeso } from '../../utils/utils';
import LoadingScreen from '../Loading';

interface ReceiptModalProps {
  open: boolean;
  onClose: () => void;
  payment_id: string
}

const ReceiptModal = ({ open, onClose, payment_id } : ReceiptModalProps) => {
    if (!open) return null;

    const { data, loading } = useFetch(`/api/payments/${payment_id}`);
   
    if(loading) {
        return <LoadingScreen loading />
    }

    console.log(data)

    return (
            <Modal 
                open={open} 
                onClose={onClose}
                sx={{
                    zIndex: 99,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <>
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-auto relative">
                <div className="absolute right-3 top-3 z-10 flex gap-2">
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={18} className="text-gray-600" />
                    </button>
                </div>
                <div id="receipt-content" className="p-6 font-mono text-sm bg-white">

                {/* Receipt Info */}
                <div className="mb-4 text-center">
                    <p className="font-bold text-lg mb-1">TUITION PAYMENT RECEIPT</p>
                    <p className="text-sm">Semester: {data?.payment.semester.term} ({data?.payment.semester.schoolYear})</p>
                    <p className="text-sm">Price per unit: {formatNumberToPeso(data?.payment.semester.pricePerUnit)}</p>
                    {data?.payment.semester.due_date && <p className="text-sm">Due Date:{formatDateLong(data?.payment.semester.due_date)}</p>}
                    <p className="text-sm">Payment Date:{formatDateTime(data?.payment.createdAt)}</p>
                </div>

                {/* Items */}
                <div className="mb-4">
                    <div className="border-b border-dashed border-gray-400 pb-1 mb-2">
                    <div className="flex justify-between font-bold">
                        <span>SUBJECT</span>
                        <span>AMOUNT</span>
                    </div>
                    </div>
                    
                    {data?.enrolledSubjects.map((subject : EnrolledSubject, idx : number) => (
                    <div key={idx} className="mb-2">
                        <div className="flex justify-between">
                        <span className="flex-1 pr-2">{subject.subject.name} ({subject.subject.code})</span>
                        <span className="whitespace-nowrap">{formatNumberToPeso(subject.subject.units * data?.payment.semester.pricePerUnit)}</span>
                        </div>
                        <div className="text-xs text-gray-600 ml-2">
                            {subject.subject.units} Units
                        </div>
                    </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="border-t-2 border-dashed border-gray-400 pt-3 mb-4">
                    <div className="flex justify-between mb-1">
                    <span>TOTAL TUITION:</span>
                    <span>{formatNumberToPeso(data?.payment.semester.totalTuition || 0)}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                    <span>BALANCE BEFORE PAYMENT:</span>
                    <span>{formatNumberToPeso(data?.payment.balance || 0)}</span>
                    </div>
                    <div className="border-t border-gray-300 pt-2 mt-2">
                        <div className="flex justify-between mt-3 mb-1">
                            <span>Payment:</span>
                            <span>{formatNumberToPeso(data?.payment.amount || 0)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-base">
                            <span>REMAINING BALANCE:</span>
                            <span>{formatNumberToPeso(data?.payment.semester.remainingBalance || 0)}</span>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            </>
        </Modal>
    );
};

export default ReceiptModal;