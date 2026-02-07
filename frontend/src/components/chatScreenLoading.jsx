import { LoaderIcon } from "lucide-react";

const ChatScreenLoading = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <LoaderIcon className="size-8 animate-spin" />
        </div>
    )
}

export default ChatScreenLoading