import cloudnary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../model/message.mode.js";
import User from "../model/user.model.js";

export const getAllContacts = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filterUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")
        res.status(200).json(filterUsers)
    } catch (e) {
        console.log(e);
        res.status(400).json({ message: "Something went wrong" })
    }
}

export const getMessagesByUderId = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id: userToChatId } = req.params;
        const message = await Message.find({
            $or: [
                {
                    senderId: myId, receiverId: userToChatId
                },
                {
                    senderId: userToChatId, receiverId: myId
                }
            ]
        })

        res.status(200).json(message)
    } catch (e) {
        console.log(e)
        res.status(400).json({ message: "Something went wrong" })
    }
}

export const sendMessage = async (req, res) => {
    try {

        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;


        if (!text && !image) {
            return res.status(400).json({ message: "Text or image is required." });
        }
        if (senderId.equals(receiverId)) {
            return res.status(400).json({ message: "Cannot send messages to yourself." });
        }
        const receiverExists = await User.exists({ _id: receiverId });
        if (!receiverExists) {
            return res.status(404).json({ message: "Receiver not found." });
        }

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudnary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url
        }
        const newMessage = new Message({
            senderId, receiverId, text, image: imageUrl
        })
        await newMessage.save();

        const recieverSocketId = getReceiverSocketId(receiverId);
        if (recieverSocketId) {
            io.to(recieverSocketId).emit("newMessage", newMessage)
        }
        res.status(201).json(newMessage)



        ///TODO send message in real time if user is online with SOCKET
    } catch (e) {
        console.log(e)
        res.status(400).json({ message: "Something went wrong" })
    }
}

export const getChatsPartners = async (req, res) => {

    try {
        const loggedInUserId = req.user._id;

        const message = await Message.find({

            $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }]
        });
        const chatPartnerId = [...new Set(message.map(msg => msg.senderId.toString() === loggedInUserId.toString() ? msg.receiverId.toString() : msg.senderId.toString()))]

        const chatPartner = await User.find({ _id: { $in: chatPartnerId } }).select("-password");

        res.status(200).json(chatPartner)

    } catch (e) {
        res.status(500).json({ message: "Something went wrong" });
    }
}