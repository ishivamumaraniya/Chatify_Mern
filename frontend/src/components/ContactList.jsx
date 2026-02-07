



import { useEffect } from 'react'
import { userAuthStore } from '../store/useAuthStore'
import { useChatStore } from '../store/useChatStore'
import UsersLoadingSkeleton from './UserLoadingSkeleton'

function ContactList() {
    const { getAllContacts, allContacts, isUsersLoading, setSelectedUser } = useChatStore()
    const { onlineUsers } = userAuthStore()

    useEffect(() => {
        getAllContacts()
    }, [])


    if (isUsersLoading) return <UsersLoadingSkeleton />
    return (
        <>

            {allContacts.map(contact => (


                <div key={contact._id} className='bg-cyan-500/10 p-2 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors' onClick={() => setSelectedUser(contact)}>

                    <div className='flex items-center gap-3'>
                        <div className={`avatar ${onlineUsers.includes(contact._id) ? "online" : "offline"}`}>
                            <div className='size-10 rounded-full'>
                                <img src={contact.profilePic || "/avatar.png"} alt={contact.fullName} className='w-full h-full object-cover rounded-full' />
                            </div>
                        </div>

                        <h4 className='text-slate-200 font-medium truncate'>{contact.fullName}</h4>
                    </div>



                </div>
            ))}

        </>
    )
}

export default ContactList