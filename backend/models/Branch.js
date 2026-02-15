const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Please add a branch name'],
        unique: true,
        trim: true
    },
    shortCode: {
        type: String,
        required: [true, 'Please add a short code'],
        unique: true,
        uppercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: false
    },
    mobile: {
        type: String,
        required: [true, 'Please add a mobile number']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    city: {
        type: String,
        required: [true, 'Please add a city']
    },
    state: {
        type: String,
        required: [true, 'Please add a state']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    branchDirector: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        default: null
    },
    directorUsername: {
        type: String,
        default: null
    },
    directorPassword: {
        type: String, // Plain text password for display (hashed version stored in User model)
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Branch', branchSchema);
