import bcrypt from "bcryptjs";
import cloudnary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../model/user.model.js";

export const signUp = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be atleast 6 characters" })
        }

        const user = await User.findOne({ email })
        if (user) return res.status(400).json({ message: "Email already exists" });
        /////
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName, email, password: hashedPassword
        })

        if (newUser) {
            await newUser.save();
            generateToken(newUser._id, res);

            res.status(201).json({

                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })

        } else {
            res.status(400).json({ message: "Invalid User Data" })
        }

    } catch (e) {
        return res.status(500).json({ message: "Something went wrong" })

    }
}

export const login = async (req, res) => {
    try {

        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Mandatory fields required" })
        const user = await User.findOne({ email })
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) return res.status(400).json({ message: "Incorrect password" })
        generateToken(user._id, res)
        if (user) {
            res.status(200).json(user)

        } else {
            res.status(400).json({ message: "No User Found" });
        }


    } catch (e) {
        return res.status(500).json({ message: "Something went wrong" })
    }
}

export const logout = (_, res) => {
    try {

        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Logged Out" })

    } catch (e) {
        res.status(500).json({ message: "Internal server" })
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        if (!profilePic) return res.status(400).json({ message: "Profile pic is required" });
        const userId = req.user._id;
        const uploadResponse = await cloudnary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })
        res.status(200).json(updatedUser)
    } catch (e) {
        res.status(500).json({ message: "Internal Server" });
    }
}