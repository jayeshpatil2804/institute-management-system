const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    visitingDate: { type: Date, required: true, default: Date.now },
    studentName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    // Reference can be a simple string (Employee Name) or a new external person
    reference: { type: String }, 
    referenceContact: { type: String }, // For new external references
    referenceAddress: { type: String }, // For new external references 
    
    // Course interested in
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    
    inTime: { type: String }, // storing as string for 12-hour format e.g. "10:30 AM" or ISO string
    outTime: { type: String },
    
    // Employee/User who attended the visitor
    attendedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    
    remarks: { type: String },
    
    // Link to converted Inquiry
    inquiryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inquiry' },

    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Visitor', visitorSchema);
