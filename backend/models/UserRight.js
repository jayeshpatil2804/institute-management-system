const mongoose = require('mongoose');

const userRightSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
        unique: true 
    },
    // Permissions array stores rights for each page
    permissions: [{
        page: { type: String, required: true }, // e.g., 'Student', 'Employee'
        view: { type: Boolean, default: false },
        add: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        delete: { type: Boolean, default: false }
    }]
}, { timestamps: true });

module.exports = mongoose.model('UserRight', userRightSchema);