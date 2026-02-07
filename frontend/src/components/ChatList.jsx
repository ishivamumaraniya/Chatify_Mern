import { useEffect } from 'react'
import { userAuthStore } from '../store/useAuthStore'
import { useChatStore } from '../store/useChatStore'
import NoChatsFound from './NoChatsFound'
import UsersLoadingSkeleton from './UserLoadingSkeleton'

function ChatList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser } = useChatStore()
  const { onlineUsers } = userAuthStore()

  useEffect(() => {
    getMyChatPartners()
  }, [])

  if (isUsersLoading) return <UsersLoadingSkeleton />
  if (chats.length === 0) return <NoChatsFound />
  return (
    <>

      {chats.map(chat => (


        <div key={chat._id} className='bg-cyan-500/10 p-2 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors' onClick={() => setSelectedUser(chat)}>

          <div className='flex items-center gap-3'>
            <div className={`avatar ${onlineUsers.includes(chat._id) ? "online" : "offline"}`}>
              <div className='size-10 rounded-full'>
                <img src={chat.profilePic || "/avatar.png"} alt={chat.fullName} className='w-full h-full object-cover rounded-full' />
              </div>
            </div>

            <h4 className='text-slate-200 font-medium truncate'>{chat.fullName}</h4>
          </div>



        </div>
      ))}

    </>
  )
}

export default ChatList