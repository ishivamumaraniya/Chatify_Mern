import { useEffect, useRef } from 'react'
import { userAuthStore } from '../store/useAuthStore'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader'
import ChatScreenLoading from './chatScreenLoading'
import MessageInput from './MessageInput'
import NoChatHistoryPlaceholder from './NoChatHistory'

function ChatContent() {

  const { selectedUser, getMessagesByUserId, messages, isMessagesLoading, subscribeToMessages, unSubscribeFromMessages } = useChatStore()
  const { authUser } = userAuthStore()
  const messageEndRef = useRef(null)


  useEffect(() => {
    getMessagesByUserId(selectedUser._id)
    subscribeToMessages()
    return () => unSubscribeFromMessages()
  }, [getMessagesByUserId, selectedUser, subscribeToMessages, unSubscribeFromMessages])

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])




  if (isMessagesLoading) return <ChatScreenLoading />

  return (
    <>

      <ChatHeader />
      <div className='flex-1 px-6 overflow-y-auto py-8'>

        {messages.length > 0 ? (<div className='max-w-3xl mx-auto space-y-6'>
          {messages.map(msg => (<div key={msg._id} className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`}>


            <div className={
              `chat-bubble relative ${msg.senderId === authUser._id ? "bg-cyan-600 text-white" : "bg-slate-800 text-white"}`
            }>

              {msg.image && (<img src={msg.image} alt='Shared' className='rounded-lg-48 object-cover max-h-[180px]' />)}
              {msg.text && <p className='mt-1'>{msg.text}</p>}

              <p className='text-xs mt-1 opacity-75 flex items-center gap-1'>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}
              </p>


            </div>
          </div>))}

          <div ref={messageEndRef} />

        </div>) : <NoChatHistoryPlaceholder name={selectedUser.fullName} />}
      </div>


      <MessageInput />
    </>

  )
}

export default ChatContent