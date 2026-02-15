const User = require('../models/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
    });
};

// @desc Register (Seed Initial Admin)
// @route POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
    const { name, username, password, role, branchId } = req.body;
    
    // Check if username already exists
    const userExists = await User.findOne({ username });
    if (userExists) {
        res.status(400);
        throw new Error('Username already taken');
    }

    // Create user with username (email can be updated later via profile)
    const user = await User.create({ name, username, password, role, branchId });
    if (user) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id, name: user.name, username: user.username, role: user.role
        });
    } else {
        res.status(400); throw new Error('Invalid user data');
    }
});

// @desc Login
// @route POST /api/auth/login
// @route POST /api/auth/login
const loginUser = asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;
    // Allow login with either email or username
    // The 'email' field from request body acts as the identifier
    const user = await User.findOne({ 
        $or: [
            { email: email }, 
            { username: email }
        ] 
    });

    if (user && (await user.matchPassword(password))) {
        // Enforce Role Check if provided (Security Level)
        if (role && user.role !== role) {
            res.status(401);
            throw new Error(`Access Denied: You are not authorized as ${role}`);
        }

        generateToken(res, user._id);
        
        // Populate branch details if user has a branch
        const populatedUser = await User.findById(user._id).populate('branchId', 'name shortCode');

        // Check if branch name needs sync (Self-Correction on Login)
        let currentBranchName = user.branchName;
        if (populatedUser.branchId) {
             currentBranchName = populatedUser.branchId.name;
             // Optional: Persist correction if mismatch found (Slows login slightly but ensures consistency)
             if(user.branchName !== currentBranchName){
                 user.branchName = currentBranchName;
                 await user.save();
             }
        }

        // --- Self-Healing: Fix swapped Email/Username for Employees ---
        // If User.email doesn't look like an email but looks like a username, 
        // and we have a linked Employee with a real email, swap/fix it.
        if (user.role !== 'Student' && user.email && !user.email.includes('@')) {
             const employee = await require('../models/Employee').findOne({ userAccount: user._id });
             if (employee && employee.email) {
                 // The current 'email' field in User is actually the username
                 user.username = user.email; 
                 user.email = employee.email;
                 await user.save();
             }
        }
        // -------------------------------------------------------------

        res.json({
            _id: user._id, 
            name: user.name, 
            email: user.email, 
            role: user.role,
            branchId: user.branchId,
            branchName: currentBranchName, // Return fresh name
            branchDetails: populatedUser.branchId, // This will contain the populated branch object
            mobile: user.mobile,
            gender: user.gender,
            education: user.education,
            address: user.address,
            photo: user.photo
        });
    } else {
        res.status(401); throw new Error('Invalid email or password');
    }
});

// @desc Logout
// @route POST /api/auth/logout
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: 'Logged out' });
});

// @desc Update User Profile
// @route PUT /api/auth/profile
const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.mobile = req.body.mobile || user.mobile;
        user.gender = req.body.gender || user.gender;
        user.education = req.body.education || user.education;
        user.address = req.body.address || user.address;
        user.education = req.body.education || user.education;
        user.address = req.body.address || user.address;
        user.branchName = req.body.branchName || user.branchName;
        user.branchId = req.body.branchId || user.branchId;

        if (req.file) {
            user.photo = req.file.path.replace(/\\/g, "/");
        }

        const updatedUser = await user.save();

        // --- Sync with Employee Record ---
        // Find employee linked to this user
        const employee = await require('../models/Employee').findOne({ userAccount: user._id });
        if (employee) {
            employee.name = user.name;
            employee.email = user.email; // <--- Added email sync
            employee.mobile = user.mobile;
            employee.gender = user.gender;
            employee.gender = user.gender;
            employee.address = user.address;
            employee.branchId = user.branchId; // Sync branchId
            employee.qualification = user.education; // Sync education back to qualification
            // Also sync education field if it exists and is used
            employee.education = user.education; 
            
            if (req.file) {
                employee.photo = user.photo;
            }
            await employee.save();
        }
        // ---------------------------------

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            mobile: updatedUser.mobile,
            gender: updatedUser.gender,
            education: updatedUser.education,
            address: updatedUser.address,
            branchName: updatedUser.branchName,
            photo: updatedUser.photo,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc Reset Password
// @route PUT /api/auth/reset-password
const resetPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (user && (await user.matchPassword(oldPassword))) {
        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } else {
        res.status(401);
        throw new Error('Invalid old password');
    }
});

// @desc Check if username is available
// @route GET /api/auth/check-username/:username
const checkUsername = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const userExists = await User.findOne({ username });
    res.json({ available: !userExists });
});

module.exports = { registerUser, loginUser, logoutUser, updateProfile, resetPassword, checkUsername };