const asyncHandler = require('express-async-handler');
const Branch = require('../models/Branch');
const User = require('../models/User');
const Student = require('../models/Student');
const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');

// @desc    Create a new branch
// @route   POST /api/branches
// @access  Private/Super Admin
const createBranch = asyncHandler(async (req, res) => {
    const { name, shortCode, phone, mobile, email, address, city, state, isActive, 
            branchDirector, directorUsername, directorPassword } = req.body;

    // Check if branch already exists
    const branchExists = await Branch.findOne({ $or: [{ name }, { shortCode }] });

    if (branchExists) {
        res.status(400);
        throw new Error('Branch with this name or short code already exists');
    }

    // Handle branch director credential update
    if (branchDirector && directorUsername && directorPassword) {
        // Verify employee exists
        const employee = await Employee.findById(branchDirector);
        if (!employee) {
            res.status(400);
            throw new Error('Selected employee not found');
        }

        // Hash the director password for User authentication
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(directorPassword, salt);

        // Update employee's User account with new director credentials
        if (employee.userAccount) {
            await User.findByIdAndUpdate(employee.userAccount, {
                username: directorUsername,
                password: hashedPassword, // Store hashed password in User model
                role: 'Branch Director'
            });
        } else {
            res.status(400);
            throw new Error('Selected employee does not have a linked user account');
        }
        // Update employee's role in Employee collection
        employee.type = 'Branch Director';
        await employee.save();
    }

    const branch = await Branch.create({
        name,
        shortCode,
        phone,
        mobile,
        email,
        address,
        city,
        state,
        isActive: isActive === undefined ? true : isActive,
        branchDirector: branchDirector || null,
        directorUsername: directorUsername || null,
        directorPassword: directorPassword || null // Store plain text password in Branch for display
    });

    if (branch) {
        res.status(201).json(branch);
    } else {
        res.status(400);
        throw new Error('Invalid branch data');
    }
});

// @desc    Get all branches
// @route   GET /api/branches
// @access  Private/Super Admin (or authorized)
const getBranches = asyncHandler(async (req, res) => {
    const branches = await Branch.find({}).sort({ createdAt: -1 });
    res.json(branches);
});

// @desc    Get all active branches for public view
// @route   GET /api/branches/public
// @access  Public
const getPublicBranches = asyncHandler(async (req, res) => {
    const branches = await Branch.find({ isActive: true }).select('-createdAt -updatedAt -__v').sort({ state: 1, city: 1 });
    res.json(branches);
});

// @desc    Get branch by ID
// @route   GET /api/branches/:id
// @access  Private
const getBranchById = asyncHandler(async (req, res) => {
    const branch = await Branch.findById(req.params.id);

    if (branch) {
        res.json(branch);
    } else {
        res.status(404);
        throw new Error('Branch not found');
    }
});

// @desc    Update branch
// @route   PUT /api/branches/:id
// @access  Private/Super Admin
const updateBranch = asyncHandler(async (req, res) => {
    const branch = await Branch.findById(req.params.id);

    if (branch) {
        branch.name = req.body.name || branch.name;
        branch.shortCode = req.body.shortCode || branch.shortCode;
        branch.phone = req.body.phone || branch.phone;
        branch.mobile = req.body.mobile || branch.mobile;
        branch.email = req.body.email || branch.email;
        branch.address = req.body.address || branch.address;
        branch.city = req.body.city || branch.city;
        branch.state = req.body.state || branch.state;
        
        if (req.body.isActive !== undefined) {
            branch.isActive = req.body.isActive;
        }

        // Handle branch director updates
        if (req.body.branchDirector !== undefined) {
            const { branchDirector, directorUsername, directorPassword } = req.body;
            
            if (branchDirector && directorUsername && directorPassword) {
                // Verify employee exists
                const employee = await Employee.findById(branchDirector);
                if (!employee) {
                    res.status(400);
                    throw new Error('Selected employee not found');
                }

                // Hash the director password for User authentication
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(directorPassword, salt);

                // Update employee's User account with new director credentials
                if (employee.userAccount) {
                    await User.findByIdAndUpdate(employee.userAccount, {
                        username: directorUsername,
                        password: hashedPassword, // Store hashed password in User model
                        role: 'Branch Director'
                    });
                }

                // Update employee's role in Employee collection
                employee.type = 'Branch Director';
                await employee.save();

                branch.branchDirector = branchDirector;
                branch.directorUsername = directorUsername;
                branch.directorPassword = directorPassword; // Store plain text password in Branch for display
            } else {
                // Clear director if no value provided
                branch.branchDirector = null;
                branch.directorUsername = null;
                branch.directorPassword = null;
            }
        }

        const updatedBranch = await branch.save();

        // Sync branchName updates to related collections (User, Student)
        // Employee does not hold branchName string, only branchId, so no sync needed there.
        if (req.body.name) {
            await User.updateMany(
                { branchId: updatedBranch._id },
                { $set: { branchName: updatedBranch.name } }
            );
            await Student.updateMany(
                { branchId: updatedBranch._id },
                { $set: { branchName: updatedBranch.name } }
            );
        }

        res.json(updatedBranch);
    } else {
        res.status(404);
        throw new Error('Branch not found');
    }
});

// @desc    Delete branch
// @route   DELETE /api/branches/:id
// @access  Private/Super Admin
const deleteBranch = asyncHandler(async (req, res) => {
    const branch = await Branch.findById(req.params.id);

    if (branch) {
        await branch.deleteOne();
        res.json({ message: 'Branch removed' });
    } else {
        res.status(404);
        throw new Error('Branch not found');
    }
});

// @desc    Get all active employees for director selection
// @route   GET /api/branches/employees/list
// @access  Private
const getAllEmployees = asyncHandler(async (req, res) => {
    const employees = await Employee.find({ 
        isDeleted: false,
        isActive: true
    }).select('_id name email mobile type');
    
    res.json(employees);
});

module.exports = {
    createBranch,
    getBranches,
    getBranchById,
    updateBranch,
    deleteBranch,
    getPublicBranches,
    getAllEmployees
};
