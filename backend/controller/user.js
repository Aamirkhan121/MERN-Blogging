const cloudinary = require("../config/cloudinary")
const fs = require("fs");
const path = require("path");
const User = require('../module/usermodule');
const jwt = require('jsonwebtoken');


// Helper: Generate Token
// const generateToken = (user) => {
//   return jwt.sign({ id: user._id }, process.env.JWT_SECRET_TOKEN, { expiresIn: '1h' });
// };

// Register User

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ username, email, password });
    const token = user.generateToken();


   res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = user.generateToken();
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get profile by username (public)
exports.getUserProfileByUsername = async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username }).select('-password -__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//profile update by username

exports.updateUserProfile = async (req, res) => {
  try {
    const usernameParam = req.params.username;
    const { username, email, password } = req.body;

    // Security check
    if (req.user.username !== usernameParam) {
      return res.status(403).json({ message: "Unauthorized user" });
    }

    let user = await User.findOne({ username: usernameParam });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update profile photo
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "profile_photos" },
          (err, data) => err ? reject(err) : resolve(data)
        ).end(req.file.buffer);
      });

      user.profilePic = uploadResult.secure_url;
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Profile photo required" });
    }

    // Cloudinary upload (buffer se)
    const result = await new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: "profile_photos" },
        (error, data) => {
          if (error) reject(error);
          else resolve(data);
        }
      );

      upload.end(req.file.buffer);
    });

    // Save URL in DB
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: result.secure_url },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile photo updated successfully",
      profilePic: result.secure_url,
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//delete user by username (admin only)

exports.deleteUser=async(req,res)=>{
  try{
    const {username}= req.params;

    //user find 
    const user= await User.findOne({username});
    if(!user){
      return res.status(404).json({message:"User note found"});
    }

    //delete profile pic from uploads folder
    if(user.profilePic){
      const picPath= path.join(__dirname,"..",user.profilePic);
      fs.unlink(picPath,(err)=>{
        if(err){
          console.error("Error deleting profile picture:", err.message);
        }
      });
    }
    await User.deleteOne({username});
    res.status(200).json({message:"User deleted successfully"});
  }
  catch(error){
    res.status(500).json({message:"server error", error:error.message});
  }
}

