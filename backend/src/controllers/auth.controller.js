import cloudinary from "../lib/cloudinary.js";
import { generateToken, hashPassword, verifyPassword } from "../lib/utils.js";
import User from "../models/user.model.js";
import { loginSchema, signupSchema } from "../validators/auth-validate.js";

export const signup = async (req, res) => {
  try {
    //* validate using zod
    console.log(req.body)
    const { data, error } = signupSchema.safeParse(req.body);
    if (error) {
      const errorMessage = error.errors.map((err) => err.message);
      return res.status(400).json({ message: errorMessage });
    }
    const { fullName, email, password } = data;

    //* find if a user already exists
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    //* Hash the password
    const hashedPassword = await hashPassword(password);

    //* Insert the user into database
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      //* generate jwt token
      generateToken(newUser._id, res);
      //* save the user in DB
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log(`Error in singup controller : ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const login = async (req, res) => {
  try {
    const { data, error } = loginSchema.safeParse(req.body);
    
      if (error) {
        const errorMessage = error.errors.map((err) => err.message);
        return res.status(400).json({ message: errorMessage });
      }
      const { email, password } = data;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isPasswordValid = await verifyPassword(user.password, password);

      if (!isPasswordValid)
        return res.status(400).json({ message: "Invalid credentials" });
      generateToken(user._id, res);
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
      });
    }
   catch (error) {
    console.log(`Error in login controller : ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const logout = (req, res) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller : "+error)
    return res.status(500).json({message:"Internal server error"})
  }
};

export const updateProfile=async (req,res) => {
  try {
    const {profilePic}=req.body
    if(!profilePic) return res.status(400).json({message:"Profile pic needed"})
    const userId=req.user._id
    const uploadResponse=await cloudinary.uploader.upload(profilePic)
    const updatedUser=await User.findOneAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
    return res.status(200).json(updatedUser)
  } catch (error) {
     console.log("Error in updateProfile controller : "+error)
     return res.status(500).json({message:"Internal server error"})
  }
  
}

export const checkAuth=(req,res) => {
  try {
    return res.status(200).json(req.user)
  } catch (error) {
    console.log("Error in checkAuth controller : "+error)
     return res.status(500).json({message:"Internal server error"})
  }
}