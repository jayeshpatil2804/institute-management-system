const express = require('express');
const router = express.Router();
const {
    createBranch,
    getBranches,
    getBranchById,
    updateBranch,
    deleteBranch,
    getPublicBranches,
    getAllEmployees
} = require('../controllers/branchController');
const { protect, admin } = require('../middlewares/authMiddleware'); // Assuming these exist

// Public Routes
router.get('/public', getPublicBranches);

// Apply protect middleware to all routes
router.use(protect);

// Get All Employees for Director Selection
router.get('/employees/list', getAllEmployees);

// Apply admin middleware to all routes (Only Super Admin can manage branches)
// If we want read access for others, we might need to adjust this
router.route('/')
    .get(getBranches) // Maybe allow read for others? For now, let's keep it robust.
    .post(admin, createBranch);

router.route('/:id')
    .get(getBranchById)
    .put(admin, updateBranch)
    .delete(admin, deleteBranch);

module.exports = router;
