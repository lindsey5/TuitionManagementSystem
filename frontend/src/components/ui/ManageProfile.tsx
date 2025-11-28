import { useEffect, useState } from "react";
import { PurpleTextField } from "../Textfield";
import { PurpleButton } from "../Button";
import { confirmDialog, errorAlert, successAlert } from "../../utils/swal";
import { updateData } from "../../utils/api";
import LoadingScreen from "../Loading";

const ManageProfile = <T extends ProfileBase>({ user : userState, profileApiUrl } : { user: T | null; profileApiUrl: string}) => {
    const [user, setUser] = useState<T>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(userState) setUser(userState);
    }, [userState])

    const handleSave = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(await confirmDialog('Save changes?', 'Do you want to change your profile information?')){
            setLoading(true);
            const response = await updateData(profileApiUrl, user);
            setLoading(false);
            if(!response.success){
                await errorAlert('Failed', response.message || 'Something went wrong.')
                return
            }

            await successAlert('Success', response.message || 'Profile updated successfully.')
            window.location.reload();
        }
    }

    return (
        <form onSubmit={handleSave} className="w-full border border-gray-300 space-y-6 shadow-md p-5 rounded-lg">
            <LoadingScreen loading={loading}/>
            <p className="text-purple-500 text-sm">Id: {user?._id}</p>
            <div className="grid md:grid-cols-2 gap-4">
                <PurpleTextField 
                    placeholder="Enter Firstname"
                    value={user?.firstname || ''}
                    label="Firstname"
                    required
                    onChange={(e) => setUser(prev => ({...prev!, firstname: e.target.value }))}
                />
                <PurpleTextField 
                    placeholder="Enter Lastname"
                    value={user?.lastname || ''}
                    label="Lastname"
                    required
                    onChange={(e) => setUser(prev => ({...prev!, lastname: e.target.value }))}
                />
                <PurpleTextField 
                    placeholder="Enter Email"
                    value={user?.email || ''}
                    label="Email"
                    required
                    type="email"
                    onChange={(e) => setUser(prev => ({...prev!, email: e.target.value }))}
                />
            </div>
            <div className="flex justify-end">
                <PurpleButton type="submit">Save Changes</PurpleButton>
            </div>
        </form>
    )
}

export default ManageProfile