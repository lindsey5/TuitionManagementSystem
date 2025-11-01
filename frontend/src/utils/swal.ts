import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const confirmDialog = async (
  title: string,
  text: string,
  icon: 'warning' | 'error' | 'success' | 'info' | 'question' = 'warning',
  confirmText = 'Yes',
  cancelText = 'Cancel',
): Promise<boolean> => {
    const result = await MySwal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        confirmButtonColor: '#059669', // emerald-600
        cancelButtonColor: '#6b7280',  // gray-500 
    });

    return result.isConfirmed === true;
};

export const successAlert = async (title: string, text: string) => {
    return await MySwal.fire({
        icon: 'success',
        title,
        text,
        confirmButtonColor: '#059669', // emerald-600
    });
};

export const errorAlert = async (title: string, text: string) => {
    return await MySwal.fire({
        icon: 'error',
        title,
        text,
        confirmButtonColor: '#059669', // emerald-600
    });
};