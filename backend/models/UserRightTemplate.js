const mongoose = require('mongoose');

const userRightTemplateSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true
    },
    // Permissions array stores rights for each page, same structure as UserRight
    permissions: [{
        page: { type: String, required: true },
        view: { type: Boolean, default: false },
        add: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        delete: { type: Boolean, default: false }
    }]
}, { timestamps: true });

module.exports = mongoose.model('UserRightTemplate', userRightTemplateSchema);
