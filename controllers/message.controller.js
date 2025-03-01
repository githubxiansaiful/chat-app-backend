import User from "../models/user.model.js";
import MessageUser from "../models/message.model.js";

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
                { myId: senderId, reciverId: userToChatId },
                { senderId: userToChatId, reciverId: myId }
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getmessages controller", error.message);
        res.status(500).json({ error: "Internal server error." })
    }
}