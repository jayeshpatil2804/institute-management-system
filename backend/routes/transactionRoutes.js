const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware');
const { 
    getInquiries, createInquiry, updateInquiryStatus,
    createFeeReceipt, getStudentFees,
    getFeeReceipts, updateFeeReceipt, deleteFeeReceipt,
    getStudentLedger,
    getNextReceiptNo,
    getStudentPaymentSummary,
    getStudentPaymentHistory,
    generateReceiptReport
} = require('../controllers/transactionController');
const upload = require('../middlewares/uploadMiddleware'); // Import Upload Middleware

// --- Inquiry Routes ---
// Custom middleware to allow Inquiry View for Branch Directors/Admins automatically
const allowInquiryView = (req, res, next) => {
    if (req.user && (req.user.role === 'Branch Director' || req.user.role === 'Branch Admin')) {
        return next();
    }
    // Otherwise fall back to standard permission check
    checkPermission('Inquiry', 'view')(req, res, next);
};

// Public Route for Quick Inquiry (No Auth)
router.post('/public/inquiry', upload.single('studentPhoto'), createInquiry);

router.route('/inquiry')
    .get(protect, allowInquiryView, getInquiries)
    .post(protect, checkPermission('Inquiry', 'add'), upload.single('studentPhoto'), createInquiry); // Added Middleware

router.route('/inquiry/:id')
    .put(protect, checkPermission('Inquiry', 'edit'), upload.single('studentPhoto'), updateInquiryStatus); // Added Middleware

// --- Fees Receipt Routes ---
router.route('/fees')
    .get(protect, checkPermission('Fees Receipt', 'view'), getFeeReceipts)
    .post(protect, checkPermission('Fees Receipt', 'add'), createFeeReceipt);

router.route('/fees/next-no')
    .get(protect, checkPermission('Fees Receipt', 'add'), getNextReceiptNo);

router.route('/fees/:id')
    .put(protect, checkPermission('Fees Receipt', 'edit'), updateFeeReceipt)
    .delete(protect, checkPermission('Fees Receipt', 'delete'), deleteFeeReceipt);

router.route('/fees/student/:studentId')
    // Viewing fees requires 'view' permission on Fees Receipt
    .get(protect, checkPermission('Fees Receipt', 'view'), getStudentFees);

// --- New Payment Summary & History Routes ---
router.route('/student/:studentId/payment-summary')
    .get(protect, checkPermission('Fees Receipt', 'view'), getStudentPaymentSummary);

router.route('/student/:studentId/payment-history')
    .get(protect, checkPermission('Fees Receipt', 'view'), getStudentPaymentHistory);

// --- Receipt Report Route ---
router.route('/fees/report')
    .get(protect, checkPermission('Fees Receipt', 'view'), generateReceiptReport);

// --- Ledger Route ---
router.route('/ledger')
    // Using 'Fees Receipt' view permission as Ledger is financial data
    // Or if 'Ledger' is a specific page in permissions, use checkPermission('Ledger', 'view')
    .get(protect, checkPermission('Ledger', 'view'), getStudentLedger);

module.exports = router;