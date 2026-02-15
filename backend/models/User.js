const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true }, // Optional - used for existing employees/students
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: [
            'Super Admin', 'Branch Admin', 'Teacher', 'Student', 
            'Manager', 'Faculty', 'Marketing Person', 'Branch Director', 'Receptionist', 'Other'
        ], 
        default: 'Student' 
    },
    // Added Profile Fields
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' }, // Link to Branch
    branchName: { type: String, default: 'Main Branch' }, // Keep for display/fallback
    mobile: { type: String },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    education: { type: String },
    address: { type: String },
    photo: { type: String }, // Cloudinary URL
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);