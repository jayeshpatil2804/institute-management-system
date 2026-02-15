const mongoose = require('mongoose');

const studentAttendanceSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    batchName: { type: String, required: true },
    batchTime: { type: String, required: true },
    takenBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Faculty who took attendance
    remarks: { type: String }, // General remarks for the batch
    records: [{
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
        enrollmentNo: { type: String },
        studentName: { type: String },
        courseName: { type: String },
        contactStudent: { type: String },
        contactParent: { type: String },
        isPresent: { type: Boolean, default: false },
        studentRemark: { type: String } // Remark for specific student
    }]
}, { timestamps: true });

// Prevent duplicate attendance for same batch & time on same day
studentAttendanceSchema.index({ date: 1, batchName: 1, batchTime: 1 }, { unique: true });

module.exports = mongoose.model('StudentAttendance', studentAttendanceSchema);
