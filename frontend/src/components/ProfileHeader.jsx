import { LoaderIcon, LogOutIcon, Volume1Icon, VolumeOffIcon } from "lucide-react";
import { useRef, useState } from "react";
import { userAuthStore } from "../store/useAuthStore.js";
import { useChatStore } from "../store/useChatStore.js";


const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
    const { logout, authUser, uploadProfile, isProfileLoading, onlineUsers } = userAuthStore()
    const { isSoundEnabled, toggleSound } = useChatStore()
    const [selectedImage, setSelectedImage] = useState(null)
    const fileInputRef = useRef(null)
    const handleImageUpload = (e) => {
        const selectedFile = e.target.files[0]
        if (!selectedFile) return
        const reader = new FileReader()
        reader.readAsDataURL(selectedFile)
        reader.onloadend = async () => {
            const base64Image = reader.result
            setSelectedImage(base64Image)
            await uploadProfile({ profilePic: base64Image })
        }
    }
    return (
        <div className='p-6 border-b border-slate-700/50 '>

            <div className='flex items-center justify-between'>



                <div className='flex items-center gap-3'>

                    {/* Avatar */}
                    <div className={`avatar ${onlineUsers.includes(authUser._id) ? "online" : "offline"}`}>


                        <button className="size-14 rounded-full overflow-hidden relative group" onClick={() => fileInputRef.current.click()}>

                            {

                                isProfileLoading ? <LoaderIcon className="h-5 animate-spin text-center size-full" /> : <img src={selectedImage || authUser.profilePic || "/avatar.png"} alt="User Image" className="size-full object-cover" />
                            }
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="text-white text-xs">Change</span>
                            </div>

                        </button>

                        <input type='file' accept='image/*' ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                    </div>

                    {/* UserName Online */}

                    <div>

                        <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">{authUser.fullName}</h3>
                        <p className="text-slate-400 text-sm">Online</p>
                    </div>


                </div>



                {/* Action Buttons */}
                <div className="flex gap-4 items-center">
                    <button className="text-slate-400 hover:text-slate-200 transition-opacity" onClick={logout}>
                        <LogOutIcon className="size-5" />
                    </button>
                    <button className="text-slate-400 hover:text-slate-200 transition-opacity" onClick={() => {

                        mouseClickSound.currentTime = 0;
                        mouseClickSound.play().catch((e) => console.log("Mouse Sound Problem", e));
                        toggleSound()

                    }} >
                        {isSoundEnabled ? <Volume1Icon className="size-5" /> : <VolumeOffIcon className="size-5" />}
                    </button>
                </div>
            </div>


        </div>
    )
}

export default ProfileHeader