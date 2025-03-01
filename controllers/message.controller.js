import User from "../models/user.model.js";
import MessageUser from "../models/message.model.js";
import Message from "../models/message.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    } catch (error) {
        console.error("Error in getUsersForSiderbar", error.message);
        res.status(500).json({ error: "Internal server error." })
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { myId: senderId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getmessages controller", error.message);
        res.status(500).json({ error: "Internal server error." })
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            // Upload base64 image to cloudinary server
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        // todo: realtime functionality goes ger => socket.io

        res.status(2001).json(newMessage);
        
    } catch (error) {
        console.error("Error in sendMessage controller", error.message);
        res.status(500).json({ error: "Internal server error." })
    }
}