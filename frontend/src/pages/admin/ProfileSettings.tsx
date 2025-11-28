import { useState } from "react"
import { Title } from "../../components/Text"
import ManageProfile from "../../components/ui/ManageProfile"
import { useUser } from "../../contexts/UserContext"

const ProfileSettings = <T extends ProfileBase>({ profileApiUrl } : { profileApiUrl : string}) => {
    const [activeTab, setActiveTab] = useState<'Profile' | 'Password'>('Profile')
    const { user } = useUser<T>();

    return (
        <div className="p-5 w-full md:h-full flex flex-col gap-5">
            <Title label="Profile Settings" />
            <div className="flex rounded-lg shadow-lg border border-gray-300">
                <button
                    className={`px-3 hover:bg-purple-200 p-3 flex-1 ${activeTab === 'Profile' && 'rounded-b-md border-b-5 border-purple-500'}`}
                    onClick={() => setActiveTab('Profile')}
                >Manage Profile</button>
                <button
                    className={`px-3 hover:bg-purple-200 p-3 flex-1 ${activeTab === 'Password' &&'rounded-b-md border-b-5 border-purple-500'}`}
                    onClick={() => setActiveTab('Password')}
                >Manage Password</button>
            </div>
            {activeTab === 'Profile' && <ManageProfile<T> user={user} profileApiUrl={profileApiUrl}/>}
        </div>
    )
}

export default ProfileSettings