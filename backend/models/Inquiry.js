const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    // Personal Details
    firstName: { type: String, required: true },
    middleName: { type: String }, // Can be used as Father/Husband Name
    relationType: {
      type: String,
      enum: ["Father", "Husband"],
      default: "Father",
    }, // NEW
    lastName: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    dob: { type: Date },
    email: { type: String },

    // Contact Details
    contactHome: { type: String },
    contactStudent: { type: String },
    contactParent: { type: String },

    // Education & Address
    education: { type: String },
    customEducation: { type: String }, // NEW: If education is 'Other'
    qualification: { type: String },
    address: { type: String },
    state: { type: String },
    city: { type: String, default: "Surat" },

    // Inquiry Specifics
    interestedCourse: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" }, // Added for branch scoping

    // System Source (Defines if it's DSR, Walk-in/Offline, etc.)
    source: {
      type: String,
      enum: [
        "Walk-in",
        "Social Media",
        "Reference",
        "Online",
        "Call",
        "DSR",
        "QuickContact",
        "OnlineAdmission",
      ],    },

    // Specific Reference Detail
    referenceBy: { type: String },
    referenceDetail: {
      // NEW: For adding new reference contact
      name: String,
      mobile: String,
      address: String,
    },

    inquiryDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: [
        "Open",
        "Close",
        "Complete",
        "Recall",
        "InProgress",
        "Pending",
        "Converted",
      ],
      default: "Open",
    },

    // Follow-ups & Remarks
    followUpDate: { type: Date }, // Stores Date (and Time component)
    followUpDetails: { type: String },

    // Extended Follow-up fields
    nextVisitingDate: { type: Date },
    visitReason: { type: String },

    remarks: { type: String },

    // Allocation
    allocatedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // Assets
    studentPhoto: { type: String }, // Stores filename/path from Multer

    // Link to Visitor
    visitorId: { type: mongoose.Schema.Types.ObjectId, ref: "Visitor" },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes
inquirySchema.index({ status: 1 });
inquirySchema.index({ inquiryDate: -1 });
inquirySchema.index({ followUpDate: 1 });
inquirySchema.index({ branchId: 1 });
inquirySchema.index({ firstName: 1 });
inquirySchema.index({ lastName: 1 });
inquirySchema.index({ contactStudent: 1 });
inquirySchema.index({ allocatedTo: 1 });
inquirySchema.index({ source: 1 });

module.exports = mongoose.model("Inquiry", inquirySchema);
