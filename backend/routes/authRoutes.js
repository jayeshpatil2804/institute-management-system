const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, updateProfile, resetPassword, checkUsername } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware'); // Assuming protect middleware exists or needs to be imported
const upload = require('../middlewares/uploadMiddleware');

router.post('/register-admin-zyx', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.put('/profile', protect, upload.single('photo'), updateProfile);
router.put('/reset-password', protect, resetPassword);
router.get('/check-username/:username', checkUsername);

module.exports = router;