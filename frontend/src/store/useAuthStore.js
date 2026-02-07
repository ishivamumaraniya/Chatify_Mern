import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

const BASEURL = import.meta.env.MODE == "development" ? "http://localhost:3000" : "/"

export const userAuthStore = create((set, get) => ({

    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isProfileLoading: false,
    socket: null,
    onlineUsers: [],


    checkAuth: async () => {
        try {

            const res = await axiosInstance.get("/auth/check")
            set({ authUser: res.data })
            get().connectSocket()

        } catch (e) {
            console.log("Error in auth check", e)
            set({ authUser: null })

        } finally {
            set({ isCheckingAuth: false })
        }
    }

    ,

    signUp: async (data) => {
        set({ isSigningUp: true })
        try {

            const res = await axiosInstance.post("/auth/signup", data)
            set({ authUser: res.data })
            toast.success("Account Created Successfully")

            get().connectSocket();
        } catch (e) {
            toast.error(e.response.data.message)

        } finally {
            set({ isSigningUp: false })
        }
    },


    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });

            toast.success("Logged in successfully");

            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            const res = await axiosInstance.post("/auth/logout")
            set({ authUser: null })
            toast.success(res.data.message)
            get().disconnectSocket()

        } catch (e) {
            toast.error("Something went wrong");
            console.log(e);
        }
    },



    uploadProfile: async (data) => {

        try {
            set({ isProfileLoading: true })

            const res = await axiosInstance.post("/auth/update-profile", data)
            set({ authUser: res.data })
            toast.success("Profile updated successfully")
        } catch (e) {
            toast.error("Failed to update profile")

        } finally {
            set({ isProfileLoading: false })

        }
    },
    connectSocket: () => {
        try {
            const { authUser } = get();
            if (!authUser || get().socket?.connected) return;

            const socket = io(BASEURL, {
                withCredentials: true, // this ensures cookies are sent with the connection
            });

            socket.connect();

            set({ socket });

            // listen for online users event
            socket.on("getOnlineUsers", (userIds) => {
                set({ onlineUsers: userIds });
            });

        } catch (e) {
            console.log(e);
        }

    },


    disconnectSocket: () => {
        try {
            if (get().socket?.connected) get().socket.disconnect()

        } catch (e) {
            console.log(e)
        }
    }

}))