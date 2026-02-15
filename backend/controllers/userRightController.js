const asyncHandler = require('express-async-handler');
const UserRight = require('../models/UserRight');
const User = require('../models/User');

const UserRightTemplate = require('../models/UserRightTemplate');

// @desc    Get User Rights by User ID
// @route   GET /api/user-rights/:userId
// @access  Private/Admin
const getUserRights = asyncHandler(async (req, res) => {
    const rights = await UserRight.findOne({ user: req.params.userId });
    if (rights) {
        res.json(rights);
    } else {
        // Return default empty structure if no rights exist yet
        res.json({ user: req.params.userId, permissions: [] });
    }
});

// @desc    Update or Create User Rights
// @route   POST /api/user-rights
// @access  Private/Admin
const saveUserRights = asyncHandler(async (req, res) => {
    const { userId, permissions } = req.body;

    let rights = await UserRight.findOne({ user: userId });

    if (rights) {
        rights.permissions = permissions;
        const updatedRights = await rights.save();
        res.json(updatedRights);
    } else {
        rights = await UserRight.create({
            user: userId,
            permissions
        });
        res.status(201).json(rights);
    }
});

// @desc    Get Current User's Permissions (For Frontend State)
// @route   GET /api/user-rights/me
// @access  Private
const getMyRights = asyncHandler(async (req, res) => {
    const rights = await UserRight.findOne({ user: req.user._id });
    res.json(rights ? rights.permissions : []);
});

// @desc    Get All Templates
// @route   GET /api/user-rights/templates
// @access  Private/Admin
const getTemplates = asyncHandler(async (req, res) => {
    const templates = await UserRightTemplate.find({});
    res.json(templates);
});

// @desc    Create New Template
// @route   POST /api/user-rights/templates
// @access  Private/Admin
const createTemplate = asyncHandler(async (req, res) => {
    const { name, permissions } = req.body;

    const templateExists = await UserRightTemplate.findOne({ name });
    if (templateExists) {
        res.status(400);
        throw new Error('Template with this name already exists');
    }

    const template = await UserRightTemplate.create({
        name,
        permissions
    });

    res.status(201).json(template);
});

// @desc    Delete Template
// @route   DELETE /api/user-rights/templates/:id
// @access  Private/Admin
const deleteTemplate = asyncHandler(async (req, res) => {
    const template = await UserRightTemplate.findById(req.params.id);

    if (template) {
        await template.deleteOne();
        res.json({ message: 'Template removed' });
    } else {
        res.status(404);
        throw new Error('Template not found');
    }
});

module.exports = { 
    getUserRights, 
    saveUserRights, 
    getMyRights,
    getTemplates,
    createTemplate,
    deleteTemplate
};