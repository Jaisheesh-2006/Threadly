import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getSocketId, io } from "../lib/socket.js";
export const getUsersForSidebar = async (req, res) => {
  try {
    const userLoggedIn = req.user._id;
    const otherUsers = await User.find({ _id: { $ne: userLoggedIn } }).select(
      "-password"
    );
    res.status(200).json(otherUsers);
  } catch (error) {
    console.log("Error in message controller : " + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { receiverId: userToChatId, senderId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages : " + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const { text, image } = req.body;

    let imageUrl;
    if (image) {
      const uploaderResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploaderResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    //todo real time functionality will be added here using socket.io
    const receiverSocketId=getSocketId(receiverId)
    io.to(receiverSocketId).emit("newMessage",newMessage)

    res.status(200).json(newMessage)
  } catch (error) {
    console.log("Error in sendMessage controller : "+error)
    res.status(500).json({message:"Internal server error"})
  }
};
