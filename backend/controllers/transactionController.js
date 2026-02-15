const Inquiry = require("../models/Inquiry");
const FeeReceipt = require("../models/FeeReceipt");
const Student = require("../models/Student");
const Batch = require("../models/Batch");
const asyncHandler = require("express-async-handler");
const generateEnrollmentNumber = require("../utils/enrollmentGenerator");
const sendSMS = require("../utils/smsSender"); // Moved to top for global use

// --- INQUIRY ---

// @desc Get Inquiries with Filters
const getInquiries = asyncHandler(async (req, res) => {
  const { startDate, endDate, status, studentName, source, dateFilterType } =
    req.query;

  let query = { isDeleted: false };

  // Date Filters
  if (startDate && endDate) {
    const dateField = dateFilterType || "inquiryDate";
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    query[dateField] = { $gte: new Date(startDate), $lte: end };
  }

  // Status Filter
  if (status) query.status = status;

  // Source Filter
  if (source) query.source = source;

  // Student Name Search (Regex)
  if (studentName) {
    query.$or = [
      { firstName: { $regex: studentName, $options: "i" } },
      { lastName: { $regex: studentName, $options: "i" } },
    ];
  }

  // --- BRANCH SCOPING ---
  if (req.user && (req.user.role === 'Branch Director' || req.user.role === 'Branch Admin') && req.user.branchId) {
      query.branchId = req.user.branchId;
  }
  if (req.query.branchId) {
      query.branchId = req.query.branchId;
  }

  const inquiries = await Inquiry.find(query)
    .populate("interestedCourse", "name")
    .populate("allocatedTo", "name")
    .populate("branchId", "name shortCode")
    .sort({ createdAt: -1 });

  res.json(inquiries);
});

// @desc Create Inquiry
const createInquiry = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    data.studentPhoto = req.file.path.replace(/\\/g, "/"); // Normalize path
  }

  if (data.referenceDetail && typeof data.referenceDetail === "string") {
    try {
      data.referenceDetail = JSON.parse(data.referenceDetail);
    } catch (e) {
      console.error("Error parsing referenceDetail", e);
    }
  }

  const inquiry = await Inquiry.create(data);

  if (req.body.visitorId) {
    const Visitor = require("../models/Visitor");
    await Visitor.findByIdAndUpdate(req.body.visitorId, {
      inquiryId: inquiry._id,
    });
  }

  res.status(201).json(inquiry);
});

// @desc Update Inquiry
const updateInquiryStatus = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);
  if (inquiry) {
    if (req.body.isDeleted === true) {
      await Inquiry.findByIdAndDelete(req.params.id);
      return res.json({
        id: req.params.id,
        message: "Inquiry Removed Permanently",
      });
    }

    const fields = [
      "status",
      "source",
      "remarks",
      "allocatedTo",
      "referenceBy",
      "firstName",
      "middleName",
      "lastName",
      "email",
      "gender",
      "dob",
      "contactStudent",
      "contactParent",
      "contactHome",
      "address",
      "city",
      "state",
      "education",
      "qualification",
      "interestedCourse",
      "inquiryDate",
      "followUpDetails",
      "followUpDate",
      "nextVisitingDate",
      "visitReason",
      "relationType",
      "customEducation",
      "referenceDetail",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (
          field === "referenceDetail" &&
          typeof req.body[field] === "string"
        ) {
          try {
            inquiry[field] = JSON.parse(req.body[field]);
          } catch (e) {
            /* ignore parse error */
          }
        } else {
          inquiry[field] = req.body[field];
        }
      }
    });

    if (req.file) {
      inquiry.studentPhoto = req.file.path.replace(/\\/g, "/");
    }

    await inquiry.save();
    res.json(inquiry);
  } else {
    res.status(404);
    throw new Error("Inquiry not found");
  }
});

// --- FEES (Standard) ---
// @desc Get Fee Receipts with Filters
const getFeeReceipts = asyncHandler(async (req, res) => {
  const { startDate, endDate, receiptNo, paymentMode, studentId } = req.query;

  let query = {};

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    query.date = { $gte: start, $lte: end };
  }

  if (receiptNo) query.receiptNo = { $regex: receiptNo, $options: "i" };
  if (paymentMode) query.paymentMode = paymentMode;
  if (studentId) query.student = studentId;

  const receipts = await FeeReceipt.find(query)
    .populate("student", "firstName lastName regNo enrollmentNo batch") // Optimized selection
    .populate("course", "name")
    .sort({ createdAt: -1 })
    .lean(); // Faster reads

  res.json(receipts);
});

// @desc Create Fee Receipt
const createFeeReceipt = asyncHandler(async (req, res) => {
  const { 
    studentId, courseId, amountPaid, paymentMode, remarks, date,
    bankName, chequeNumber, chequeDate, transactionId, transactionDate 
  } = req.body;

  // 1. Validation
  const student = await Student.findById(studentId);
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  // 2. Generate Receipt No
  const lastReceipt = await FeeReceipt.findOne().sort({ createdAt: -1 });
  let nextNum = 1;
  if (lastReceipt && lastReceipt.receiptNo && !isNaN(lastReceipt.receiptNo)) {
    nextNum = Number(lastReceipt.receiptNo) + 1;
  }
  const receiptNo = String(nextNum);

  // 2.5. Calculate Installment Number
  let installmentNumber = 1;
  const existingReceipts = await FeeReceipt.find({ student: studentId }).sort({ createdAt: 1 });
  
  if (existingReceipts.length > 0) {
    installmentNumber = existingReceipts.length + 1;
  }
  
  if (installmentNumber === 1 && student.isRegistered) {
    installmentNumber = 3; 
  }

  // 3. Create Receipt
  const receipt = await FeeReceipt.create({
    receiptNo,
    student: studentId,
    course: courseId,
    amountPaid,
    paymentMode,
    remarks,
    date: date || Date.now(),
    createdBy: req.user._id,
    installmentNumber,
    bankName,
    chequeNumber,
    chequeDate,
    transactionId,
    transactionDate
  });

  // 4. Update Student Pending Fees & Status
  let admissionCompletedNow = false;

  if (!student.isAdmissionFeesPaid) {
    student.isAdmissionFeesPaid = true;
    student.admissionFeeAmount = Number(amountPaid);
    admissionCompletedNow = true;
    
    if (!student.enrollmentNo && student.branchId) {
        student.enrollmentNo = await generateEnrollmentNumber(student.branchId);
    }
  } else {
    student.pendingFees = student.pendingFees - Number(amountPaid);
  }

  await student.save();

  // 5. Send Transaction SMS (Applies to ALL Receipts)
  try {
      const var1 = `${student.firstName} ${student.lastName}`; // Student Name
      const var2 = amountPaid; // Amount
      
      // Determine var3 (Purpose)
      let var3 = `Installment ${installmentNumber}`;
      if (admissionCompletedNow || (remarks && remarks.toLowerCase().includes('admission'))) {
          var3 = "Admission";
      } else if (remarks && remarks.toLowerCase().includes('registration')) {
          var3 = "Registration";
      }

      // Determine var4 (Reg No or Enrollment No)
      const var4 = student.regNo || student.enrollmentNo || "N/A";

      const smsMessage = `Dear, ${var1}. Your Course fees ${var2} has been deposited for ${var3}, Reg.No. ${var4}. Thank you,\nSmart Institute`;

      const contacts = [...new Set([student.mobileStudent, student.mobileParent, student.contactHome].filter(Boolean))]; 
      
      // Send SMS asynchronously
      contacts.forEach(num => {
          sendSMS(num, smsMessage).catch(err => console.error(`Failed to send Transaction SMS to ${num}`, err));
      });
      
  } catch (error) {
      console.error("Error setting up Transaction SMS", error);
  }

  // 6. Send Specific Welcome SMS (Only for new Admission)
  // This can be kept if you want a separate welcome message, or removed if the generic one is enough.
  // I have kept it as it provides specific Batch Time info which the generic one does not.
  if (admissionCompletedNow) {
    try {
      const Course = require("../models/Course");
      // sendSMS already imported at top

      const courseDoc = await Course.findById(courseId);
      const batchDoc = await Batch.findOne({ name: student.batch });

      const courseName = courseDoc ? courseDoc.name : "N/A";
      const batchTime = batchDoc
        ? `${batchDoc.startTime} to ${batchDoc.endTime}`
        : "N/A";
      const fullName = `${student.firstName} ${student.lastName}`;

      const welcomeMessage = `Welcome to Smart Institute, Dear, ${fullName}. your admission has been successfully completed. Enrollment No. ${student.enrollmentNo}, course ${courseName}, Batch Time ${batchTime}`;

      const contacts = [
        ...new Set(
          [
            student.mobileStudent,
            student.mobileParent,
            student.contactHome,
          ].filter(Boolean)
        ),
      ];
      await Promise.all(contacts.map((num) => sendSMS(num, welcomeMessage)));
    } catch (error) {
      console.error("Failed to send Welcome SMS", error);
    }
  }

  res.status(201).json(receipt);
});

// @desc Update Fee Receipt
const updateFeeReceipt = asyncHandler(async (req, res) => {
  const receipt = await FeeReceipt.findById(req.params.id);

  if (receipt) {
    if (req.body.amountPaid && req.body.amountPaid !== receipt.amountPaid) {
      const student = await Student.findById(receipt.student);
      if (student) {
        const diff = Number(req.body.amountPaid) - Number(receipt.amountPaid);
        student.pendingFees = student.pendingFees - diff;
        await student.save();
      }
    }

    receipt.amountPaid = req.body.amountPaid || receipt.amountPaid;
    receipt.paymentMode = req.body.paymentMode || receipt.paymentMode;
    receipt.remarks = req.body.remarks || receipt.remarks;
    receipt.date = req.body.date || receipt.date;
    
    if (req.body.bankName !== undefined) receipt.bankName = req.body.bankName;
    if (req.body.chequeNumber !== undefined) receipt.chequeNumber = req.body.chequeNumber;
    if (req.body.chequeDate !== undefined) receipt.chequeDate = req.body.chequeDate;
    if (req.body.transactionId !== undefined) receipt.transactionId = req.body.transactionId;
    if (req.body.transactionDate !== undefined) receipt.transactionDate = req.body.transactionDate;

    await receipt.save();
    res.json(receipt);
  } else {
    res.status(404);
    throw new Error("Receipt not found");
  }
});

// @desc Delete Fee Receipt
const deleteFeeReceipt = asyncHandler(async (req, res) => {
  const receipt = await FeeReceipt.findById(req.params.id);

  if (receipt) {
    const student = await Student.findById(receipt.student);
    if (student) {
      student.pendingFees = student.pendingFees + Number(receipt.amountPaid);
      await student.save();
    }

    await receipt.deleteOne();
    res.json({ message: "Receipt removed" });
  } else {
    res.status(404);
    throw new Error("Receipt not found");
  }
});

const getStudentFees = asyncHandler(async (req, res) => {
  const receipts = await FeeReceipt.find({
    student: req.params.studentId,
  })
    .populate("student", "firstName lastName regNo enrollmentNo middleName mobileStudent mobileParent batch totalFees pendingFees branchName emiDetails")
    .populate("course", "name")
    .sort({ createdAt: -1 });
  res.json(receipts);
});

// --- LEDGER REPORT ---
const getStudentLedger = asyncHandler(async (req, res) => {
  const { studentId, regNo } = req.query;

  let student = null;
  if (studentId) {
    student = await Student.findById(studentId).populate("course");
  } else if (regNo) {
    student = await Student.findOne({ regNo }).populate("course");
  }

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  const batchDoc = await Batch.findOne({ name: student.batch });
  const receipts = await FeeReceipt.find({ student: student._id }).sort({
    date: 1,
  });

  const totalCourseFees =
    (student.totalFees || 0) + (student.admissionFeeAmount || 0);
  const totalPaid = receipts.reduce((acc, curr) => acc + curr.amountPaid, 0);
  const dueAmount = totalCourseFees - totalPaid;

  res.json({
    student,
    course: student.course,
    batch: batchDoc,
    receipts,
    summary: { totalCourseFees, totalPaid, dueAmount },
  });
});

// @desc    Get Student Payment Summary
const getStudentPaymentSummary = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.studentId).populate("course");
  
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  const receipts = await FeeReceipt.find({ student: student._id });
  const totalReceived = receipts.reduce((acc, curr) => acc + curr.amountPaid, 0);

  const courseAdmissionFee = student.course && student.course.admissionFees ? student.course.admissionFees : 0;
  const paidAdmissionFee = student.admissionFeeAmount || 0;
  const pendingAdmission = Math.max(0, courseAdmissionFee - paidAdmissionFee);
  const effectiveAdmissionFee = Math.max(courseAdmissionFee, paidAdmissionFee);
  const totalFees = (student.totalFees || 0) + effectiveAdmissionFee;
  const dueAmount = totalFees - totalReceived;

  let outstandingAmount = pendingAdmission;
  let emiStructure = null;
  let feesMethod = student.paymentPlan || "One Time";

  if (student.paymentPlan === "Monthly" && student.emiDetails) {
    const monthlyInstallment = student.emiDetails.monthlyInstallment || 0;
    const months = student.emiDetails.months || 0;
    const regFees = student.emiDetails.registrationFees || 0;

    if (monthlyInstallment && months) {
      emiStructure = `₹${monthlyInstallment} x ${months} months`;
    }

    const regReceipts = receipts.filter(r => {
        const rem = (r.remarks || "").toLowerCase();
        return rem.includes("registration") || r.installmentNumber === 2;
    });
    const totalRegPaid = regReceipts.reduce((acc, curr) => acc + curr.amountPaid, 0);
    const pendingReg = Math.max(0, regFees - totalRegPaid);

    let nextInstallment = monthlyInstallment;
    if (nextInstallment > student.pendingFees) { 
        nextInstallment = student.pendingFees;
    }

    outstandingAmount += pendingReg;
    if (student.pendingFees > 0) {
        outstandingAmount += nextInstallment;
    }
  } else {
      outstandingAmount += (student.pendingFees || 0);
  }

  res.json({
    totalReceived,
    dueAmount,
    outstandingAmount,
    feesMethod,
    emiStructure,
    totalFees,
  });
});

// @desc    Get Student Payment History
const getStudentPaymentHistory = asyncHandler(async (req, res) => {
  const receipts = await FeeReceipt.find({ student: req.params.studentId })
    .populate({
      path: "student",
      select: "firstName lastName regNo enrollmentNo middleName mobileStudent mobileParent batch totalFees pendingFees branchName emiDetails branchId",
      populate: {
        path: "branchId",
        select: "name address city state phone mobile email"
      }
    })
    .populate("course", "name")
    .sort({ date: 1 });

  res.json(receipts);
});

// @desc    Generate Receipt Report with Filters
const generateReceiptReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, receiptNo, paymentMode, studentId } = req.query;

  let query = {};

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    query.date = { $gte: start, $lte: end };
  }

  if (receiptNo) query.receiptNo = { $regex: receiptNo, $options: "i" };
  if (paymentMode) query.paymentMode = paymentMode;
  if (studentId) query.student = studentId;

  const receipts = await FeeReceipt.find(query)
    .populate("student", "firstName lastName regNo enrollmentNo middleName mobileStudent mobileParent batch totalFees pendingFees branchName emiDetails")
    .populate("course", "name")
    .sort({ date: -1 });

  const totalAmount = receipts.reduce((acc, curr) => acc + curr.amountPaid, 0);

  res.json({
    receipts,
    totalAmount,
    count: receipts.length,
  });
});

// @desc    Get Next Receipt Number
const getNextReceiptNo = asyncHandler(async (req, res) => {
    const lastReceipt = await FeeReceipt.findOne().sort({ createdAt: -1 });
    let nextNum = 1;
    if (lastReceipt && lastReceipt.receiptNo && !isNaN(lastReceipt.receiptNo)) {
        nextNum = Number(lastReceipt.receiptNo) + 1;
    }
    res.json(String(nextNum));
});

module.exports = {
  getInquiries,
  createInquiry,
  updateInquiryStatus,
  createFeeReceipt,
  getStudentFees,
  getFeeReceipts,
  updateFeeReceipt,
  deleteFeeReceipt,
  getStudentLedger,
  getNextReceiptNo,
  getStudentPaymentSummary,
  getStudentPaymentHistory,
  generateReceiptReport,
};