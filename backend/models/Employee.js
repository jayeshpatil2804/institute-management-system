const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    // --- Personal Information ---
    name: { type: String, required: true },
    regNo: { type: String, unique: true }, 
    mobile: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    type: { 
        type: String, 
        enum: ['Manager', 'Faculty', 'Marketing Person', 'Branch Director', 'Receptionist', 'Other'],
        required: true 
    },
    email: { type: String, required: true, unique: true },
    duration: { type: String }, 
    dob: { type: Date },
    dateOfJoining: { type: Date }, // <--- Added Field
    education: { type: String },
    qualification: { type: String },
    address: { type: String },
    photo: { type: String }, 
    isActive: { type: Boolean, default: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },


    // --- Work Experience ---
    experience: { type: String }, 
    workingTimePeriod: { type: String }, 
    companyName: { type: String },
    role: { type: String }, // Work role

    // --- Login Integration ---
    userAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    loginUsername: { type: String }, 
    isLoginActive: { type: Boolean, default: true },

    isDeleted: { type: Boolean, default: false }

}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);