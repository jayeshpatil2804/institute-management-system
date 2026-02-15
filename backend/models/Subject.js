const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g. "Programming in C"
    printedName: { type: String, required: true }, // Name on Certificate
    
    // --- Duration ---
    duration: { type: Number, required: true },
    durationType: { type: String, enum: ['Month', 'Year', 'Days'], default: 'Month' },

    // --- Marks Configuration ---
    totalMarks: { type: Number, required: true },
    theoryMarks: { type: Number, default: 0 },
    practicalMarks: { type: Number, default: 0 },
    passingMarks: { type: Number, required: true },

    // --- Details ---
    topicName: { type: String }, // Specific topic focus
    description: { type: String },
    
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);