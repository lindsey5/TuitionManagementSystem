import { useState } from "react"
import { PasswordField } from "../Textfield"

const ChangePassword = ({ passwordApiUrl } : { passwordApiUrl : string}) => {
    const [password, setPassword] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    })

    return (
        <form className="w-full border border-gray-300 space-y-6 shadow-md p-5 rounded-lg">
            <div className="grid md:grid-cols-2 gap-4">
                <PasswordField 
                    value={password.currentPassword} 
                    label="Current Password" 
                    onChange={(e) => setPassword(prev => ({ ...prev, currentPassword: e.target.value }))} 
                    placeholder="Enter your current password"
                />
                <PasswordField 
                    value={password.newPassword}
                    label="New Password"
                    onChange={(e) => setPassword(prev => ({ ...prev, newPassword: e.target.value }))} 
                    placeholder="Enter your new password"
                />
                <PasswordField 
                    value={password.confirmNewPassword} 
                    label="Confirm New Password" 
                    onChange={(e) => setPassword(prev => ({ ...prev, confirmNewPassword: e.target.value }))} 
                    placeholder="Confirm your new password"
                />
            </div>

        </form>
    )
}


export default ChangePassword