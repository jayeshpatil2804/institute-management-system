const Employee = require('../models/Employee');
const User = require('../models/User');
const sendSMS = require('../utils/smsSender');
const asyncHandler = require('express-async-handler');

// @desc    Get Employees with Filters
const getEmployees = asyncHandler(async (req, res) => {
    const { joiningFrom, joiningTo, gender, searchBy, searchValue } = req.query;
    
    let query = { isDeleted: false };
    
    // 1. Date Range Filter (Joining Date)
    if (joiningFrom && joiningTo) {
        // Set time to start of day for 'from' and end of day for 'to'
        const startDate = new Date(joiningFrom);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(joiningTo);
        endDate.setHours(23, 59, 59, 999);

        query.dateOfJoining = { 
            $gte: startDate, 
            $lte: endDate 
        };
    }

    // 2. Gender Filter
    if (gender && gender !== 'All') {
        query.gender = gender;
    }
    
    // 3. Dynamic Search (Name, Email, Mobile)
    if (searchBy && searchValue) {
        const regex = { $regex: searchValue, $options: 'i' }; // Case-insensitive
        
        if (searchBy === 'name') {
            query.name = regex;
        } else if (searchBy === 'email') {
            query.email = regex;
        } else if (searchBy === 'mobile') {
            query.mobile = regex;
        }
    }

    const employees = await Employee.find(query).populate('branchId', 'name shortCode').sort({ createdAt: -1 });
    res.json(employees);
});

// @desc    Create Employee
const createEmployee = asyncHandler(async (req, res) => {
    const { 
        name, email, mobile, gender, type, 
        loginUsername, loginPassword, isLoginActive 
    } = req.body;

    const empExists = await Employee.findOne({ email });
    if (empExists) {
        res.status(400); throw new Error('Employee with this email already exists');
    }

    // Sanitize branchId - empty string causes CastError
    if (req.body.branchId === '') {
        delete req.body.branchId;
    }

    // Fetch Branch Name if ID is provided
    // Fetch Branch Name if ID is provided OR if User is Branch Director
    let branchNameParam = 'Main Branch';
    
    // Auto-assign Branch for Branch Directors/Admins
    if(req.user && (req.user.role === 'Branch Director' || req.user.role === 'Branch Admin') && req.user.branchId) {
        req.body.branchId = req.user.branchId;
    }

    if(req.body.branchId) {
        const branchTry = await require('../models/Branch').findById(req.body.branchId);
        if(branchTry) branchNameParam = branchTry.name;
    }

    let userId = null;

    if (loginUsername && loginPassword) {
        const userExists = await User.findOne({ username: loginUsername });
        if (userExists) {
            res.status(400); throw new Error(`User Login '${loginUsername}' already exists.`);
        }

        try {
            const newUser = await User.create({
                name,
                username: loginUsername, // Set Username
                email: email, // Set Real Email
                password: loginPassword,
                role: type,
                isActive: isLoginActive,
                // Populate profile fields from Employee data
                mobile, 
                gender,
                address: req.body.address,
                education: req.body.qualification, // Mapping qualification to education
                branchId: req.body.branchId, // <--- Propagate branchId to User
                branchName: branchNameParam // Set correct branch name
            });
            userId = newUser._id;
        } catch (error) {
            res.status(400); throw new Error('User Login Error: ' + error.message);
        }
    }

    try {
        // Fix: Use last created employee to determine next sequence number instead of count
        const lastEmployee = await Employee.findOne({ regNo: { $regex: `^EMP-${new Date().getFullYear()}` } }).sort({ createdAt: -1 });
        
        let nextNum = 1001;
        if (lastEmployee && lastEmployee.regNo) {
            const parts = lastEmployee.regNo.split('-');
            const lastSeq = parseInt(parts[2]); // EMP-2025-1005 -> 1005
            if (!isNaN(lastSeq)) {
                nextNum = lastSeq + 1;
            }
        }
        
        const regNo = `EMP-${new Date().getFullYear()}-${nextNum}`;

        const employee = await Employee.create({
            ...req.body,
            regNo,
            userAccount: userId
        });

        if (userId && loginUsername) {
             const message = `Dear, ${name}. Your Registration process has been successfully completed. Reg.No. ${regNo}, User ID-${loginUsername}, Password-${loginPassword}, smart institute.`;
             sendSMS(mobile, message);
        }

        // Populate branchId for the immediate response
        const populatedEmployee = await Employee.findById(employee._id).populate('branchId', 'name shortCode');

        res.status(201).json(populatedEmployee);

    } catch (error) {
        if(userId) await User.findByIdAndDelete(userId);
        res.status(400); throw new Error(error.message);
    }
});

// @desc    Update Employee
const updateEmployee = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { 
        name, type, isLoginActive, loginPassword 
    } = req.body;

    const employee = await Employee.findById(id);

    if (!employee) {
        res.status(404); throw new Error('Employee not found');
    }

    if (employee.userAccount) {
        const userUpdate = { name, role: type, isActive: isLoginActive };
        if (loginPassword && loginPassword.trim() !== '') {
            const user = await User.findById(employee.userAccount);
            if(user) {
                user.password = loginPassword;
                user.name = name;
                user.role = type;
                user.isActive = isLoginActive;
                await user.save();
            }
        } else {
            await User.findByIdAndUpdate(employee.userAccount, userUpdate);
        }
    }

    // Update employee using save() to ensure all hooks/types run correctly
    // We already fetched 'employee' above
    Object.keys(req.body).forEach(key => {
        // Prevent updating immutable fields if any, or _id
        if (key !== '_id' && key !== 'userAccount' && key !== 'createdAt' && key !== 'updatedAt') {
            employee[key] = req.body[key];
        }
    });

    // Explicitly set type if provided
    if (type) employee.type = type;

    const updatedEmployee = await employee.save();

    // Re-fetch to populate
    const populatedEmployee = await Employee.findById(updatedEmployee._id)
        .populate('branchId', 'name shortCode');

    res.json(populatedEmployee);
});

// @desc    Delete Employee
// @desc    Delete Employee Permanently
const deleteEmployee = asyncHandler(async (req, res) => {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (employee) {
        if(employee.userAccount) {
            await User.findByIdAndDelete(employee.userAccount);
        }
        res.json({ id: req.params.id, message: 'Employee Removed Permanently' });
    } else {
        res.status(404); throw new Error('Employee not found');
    }
});

module.exports = { getEmployees, createEmployee, updateEmployee, deleteEmployee };