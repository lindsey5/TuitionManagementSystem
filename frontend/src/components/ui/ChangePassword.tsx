import { useState } from "react"
import { PasswordField } from "../Textfield"
import { confirmDialog, successAlert } from "../../utils/swal"
import { updateData } from "../../utils/api"
import { PurpleButton } from "../Button"

const ChangePassword = ({ passwordApiUrl } : { passwordApiUrl : string}) => {
    const [password, setPassword] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    })
    const [error, setError] = useState('');

    const changePassword = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password.newPassword !== password.confirmNewPassword) {
            setError("New password and confirm password do not match.");
        }

        if (await confirmDialog('Confirm', 'Are you sure you want to change your password?')) {
            const response = await updateData(passwordApiUrl, { currentPassword: password.currentPassword, newPassword: password.newPassword});

            if(!response.success){
                setError(response.message);
                return;
            }
            
            await successAlert('Success', 'Your Password successfully updated!');
            window.location.reload();
        }
    }

    return (
        <form onSubmit={changePassword} className="w-full border border-gray-300 space-y-6 shadow-md p-5 rounded-lg">
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid md:grid-cols-2 gap-4">
                <PasswordField 
                    value={password.currentPassword} 
                    label="Current Password" 
                    required
                    onChange={(e) => setPassword(prev => ({ ...prev, currentPassword: e.target.value }))} 
                    placeholder="Enter your current password"
                />
                <PasswordField 
                    value={password.newPassword}
                    label="New Password"
                    required
                    onChange={(e) => setPassword(prev => ({ ...prev, newPassword: e.target.value }))} 
                    placeholder="Enter your new password"
                />
                <PasswordField 
                    value={password.confirmNewPassword} 
                    label="Confirm New Password" 
                    required
                    onChange={(e) => setPassword(prev => ({ ...prev, confirmNewPassword: e.target.value }))} 
                    placeholder="Confirm your new password"
                />
            </div>
            <div className="flex justify-end">
                <PurpleButton type="submit">Change Password</PurpleButton>
            </div>

        </form>
    )
}


export default ChangePassword