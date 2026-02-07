import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { userAuthStore } from "./useAuthStore";


export const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: localStorage.getItem("isSoundEnabled") === "true",

    toggleSound: () => {
        const newValue = !get().isSoundEnabled;
        localStorage.setItem("isSoundEnabled", String(newValue));
        set({ isSoundEnabled: newValue });
    }

    ,
    setActiveTab: (tab) => set({ activeTab: tab }),
    setSelectedUser: (user) => set({ selectedUser: user }),

    getAllContacts: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/message/contact")
            set({ allContacts: res.data });


        } catch (e) {
            toast.error(e.response.data.messages)
        } finally {
            set({ isUsersLoading: false });

        }

    },
    getMyChatPartners: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/message/chats")
            set({ chats: res.data });


        } catch (e) {
            toast.error(e.response.data.messages)
        } finally {
            set({ isUsersLoading: false });

        }
    }
    ,
    getMessagesByUserId: async (userId) => {
        try {
            set({ isMessagesLoading: true })
            const res = await axiosInstance.get(`/message/${userId}`)
            set({ messages: res.data })
        } catch (e) {
            toast.error("Failed to fetch chats");
        } finally {
            set({ isMessagesLoading: false })

        }
    },

    sendMessage: async (messageData) => {


        const { authUser } = userAuthStore.getState()
        const tempId = `temp-${Date.now()}`
        const { selectedUser, messages } = get();

        const optimisticMessage = {
            _id: tempId,
            senderId: authUser._id,
            receiverId: selectedUser._id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
            isOptimistic: true
        }

        ///Force update the UI by adding the message

        set({ messages: [...messages, optimisticMessage] })
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData)
            set({ messages: messages.concat(res.data) })
        } catch (e) {
            set({ messages: messages })

            toast.error("Something went wrong")
        }
    },


    subscribeToMessages: () => {
        const { selectedUser, isSoundEnabled } = get();
        if (!selectedUser) return;

        const socketConnection = userAuthStore.getState().socket;
        socketConnection.on('newMessage', (newMessage) => {
            const currentMessage = get().messages;
            set({ messages: [...currentMessage, newMessage] })
            if (isSoundEnabled) {
                const notificationSound = new Audio("sounds/notification.mp3");
                notificationSound.currentTime = 0;

                notificationSound.play().catch((e) => console.log("Error playing sound: ", e))

            }
        })



    },

    unSubscribeFromMessages: () => {
        const socket = userAuthStore.getState().socket;
        socket.off("newMessage")
    }



}))