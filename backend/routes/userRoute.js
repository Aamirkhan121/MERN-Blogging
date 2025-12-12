const express = require('express');
const { registerUser, loginUser, getUserProfileByUsername, updateUserProfile, uploadProfilePic, deleteUser, } = require('../controller/user');
const auth = require('../middleware/auth');
const postUpload = require('../middleware/postUpload');
// const upload = require('../middleware/upload');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put("/profile/upload-pic/:username",auth,postUpload.single("photo"),uploadProfilePic);
router.delete("/delete/:username", auth, deleteUser);


// Protected route to get user profile
router.get('/profile/:username',auth, getUserProfileByUsername);
// routes/user.js
router.put('/profile/:username', auth,upload.single("avatar"), updateUserProfile);


module.exports = router;
