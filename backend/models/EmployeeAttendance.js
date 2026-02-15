const mongoose = require('mongoose');

const employeeAttendanceSchema = new mongoose.Schema({
    date: { type: Date, required: true, unique: true }, // One record per day for all employees
    takenBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    remarks: { type: String }, // General remarks for the day
    records: [{
        employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
        employeeName: { type: String },
        srNumber: { type: String }, // Assuming regNo or similar unique ID
        isPresent: { type: Boolean, default: false },
        employeeRemark: { type: String }
    }]
}, { timestamps: true });

module.exports = mongoose.model('EmployeeAttendance', employeeAttendanceSchema);
