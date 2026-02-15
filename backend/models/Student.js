const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    // --- System Fields ---
    enrollmentNo: { type: String }, // CHANGED: Removed unique: true for branch-wise sequence
    regNo: { type: String, unique: true, sparse: true },
    isActive: { type: Boolean, default: true },
    isRegistered: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    
    // --- Document Verification Fields ---
    isPhotos: { type: Boolean, default: false },
    isIDProof: { type: Boolean, default: false },
    isMarksheetCertificate: { type: Boolean, default: false },
    isAddressProof: { type: Boolean, default: false },
    
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    branchName: { type: String, default: "Main Branch" },
    registrationDate: { type: Date },

    // --- Personal Details ---
    admissionDate: { type: Date, required: true, default: Date.now },
    aadharCard: { type: String, required: true },
    firstName: { type: String, required: true },
    relationType: {
      type: String,
      enum: ["Father", "Husband"],
      default: "Father",
    }, // Added for Marksheet logic
    middleName: { type: String }, // CHANGED: Removed required: true to prevent 400 error
    lastName: { type: String, required: true },
    motherName: { type: String },

    dob: { type: Date, required: true },
    gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
    studentPhoto: { type: String },

    // --- Contact & Address ---
    email: { type: String },
    contactHome: { type: String },
    mobileStudent: { type: String },
    mobileParent: { type: String, required: true },

    address: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String },

    // --- Other Info ---
    occupationType: {
      type: String,
      enum: ["Service", "Business", "Student", "Unemployed"],
    },
    occupationName: { type: String },
    education: { type: String },
    reference: { type: String, default: "Direct" }, // CHANGED: Added default

    // --- Academic & Fees ---
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    batch: { type: String, required: true },

    // CHANGED: Made optional because "Pay Later" has no mode yet
    paymentMode: {
      type: String,
      enum: ["Cash", "Online", "EMI", "Cheque", "Bank Transfer"],
    },
    paymentPlan: { type: String, enum: ["One Time", "Monthly"] }, // New Field

    totalFees: { type: Number, required: true },
    pendingFees: { type: Number, default: 0 }, // CHANGED: Added default
    isAdmissionFeesPaid: { type: Boolean, default: false },
    admissionFeeAmount: { type: Number, default: 0 }, // Actual admission fee paid

    // Link to User Login
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // EMI Details (Optional)
    emiDetails: {
      registrationFees: Number,
      monthlyInstallment: Number,
      months: Number,
    },
  },
  { timestamps: true }
);

// Indexes for frequent searches
// Text Search Index (Compound)
studentSchema.index({ 
    firstName: 'text', 
    lastName: 'text', 
    enrollmentNo: 'text', 
    mobileParent: 'text' 
});

// Other optimized indexes
studentSchema.index({ course: 1 });
studentSchema.index({ branchId: 1 });
studentSchema.index({ batch: 1 });
studentSchema.index({ admissionDate: -1 });
studentSchema.index({ email: 1 });


// Middleware for Enrollment No (REMOVED: Now handled imperatively on payment)
// studentSchema.pre("save", async function () { ... });

module.exports = mongoose.model("Student", studentSchema);
