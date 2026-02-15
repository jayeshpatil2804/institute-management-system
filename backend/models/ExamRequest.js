const mongoose = require('mongoose');

const examRequestSchema = new mongoose.Schema({
    student: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Student', 
        required: true 
    },
    examSerialNo: { type: String, unique: true }, // e.g., EX-2025-0001
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Cancelled', 'Completed'], 
        default: 'Pending' 
    },
    requestDate: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

// Auto-generate Serial No
examRequestSchema.pre('save', async function() {
    if (!this.examSerialNo) {
        const count = await mongoose.model('ExamRequest').countDocuments();
        this.examSerialNo = `EX-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
    }
});

module.exports = mongoose.model('ExamRequest', examRequestSchema);