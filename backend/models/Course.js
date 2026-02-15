const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    // --- Basic Info ---
    name: { type: String, required: true }, // e.g., "Advance Degree..."
    shortName: { type: String, required: true }, // e.g., "ADCA"
    image: { type: String }, // URL/Path to image
    
    smallDescription: { type: String },
    description: { type: String }, // Full Description
    
    // --- Fees Structure ---
    courseFees: { type: Number, required: true }, // Total Fees
    admissionFees: { type: Number, default: 0 },
    registrationFees: { type: Number, default: 0 },
    monthlyFees: { type: Number, default: 0 },
    totalInstallment: { type: Number, default: 1 },
    
    // --- Configuration ---
    sorting: { type: Number, default: 0 }, // Course display order
    commission: { type: Number, default: 0 }, // For field employees (%)
    
    // --- Duration & Type ---
    duration: { type: Number, required: true },
    durationType: { type: String, enum: ['Month', 'Year', 'Days'], default: 'Month' },
    courseType: { type: String, required: true }, // allowing string for dynamic types

    // --- Relations (Updated for Subject Sorting) ---
    subjects: [{
        subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
        sortOrder: { type: Number, default: 0 }
    }],

    // --- Status ---
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);