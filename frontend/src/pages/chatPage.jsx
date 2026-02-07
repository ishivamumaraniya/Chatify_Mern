import ActiveTabSwitch from "../components/ActiveTabSwitch"
import BorderAnimatedContainer from "../components/borderAnimatedContainer"
import ChatContent from "../components/ChatContent"
import ChatList from "../components/ChatList"
import ContactList from "../components/ContactList"
import NoConvPlaceHolder from "../components/NoConvPlaceHolder"
import ProfileHeader from "../components/ProfileHeader"
import { useChatStore } from "../store/useChatStore"

function ChatPage() {


  const { activeTab, selectedUser } = useChatStore()

  return (
    <div className="relative w-full max-w-6xl h-[700px]">

      <BorderAnimatedContainer>


        {/* Left */}

        <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col ">


          <ProfileHeader />
          <ActiveTabSwitch />
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {
              activeTab === "chats" ? <ChatList /> : <ContactList />
            }
          </div>

        </div>


        {/* Right */}

        <div className="flex-1 flex flex-col bg-slate-900 backdrop-blur-sm">
          {

            selectedUser ? <ChatContent /> : <NoConvPlaceHolder />
          }


        </div>

      </BorderAnimatedContainer>

    </div>
  )
}

export default ChatPage