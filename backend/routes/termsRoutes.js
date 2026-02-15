const express = require('express');
const router = express.Router();
const { getTerms, updateTerms } = require('../controllers/termsController');
const { protect } = require('../middlewares/authMiddleware'); // Assuming this exists

router.get('/', getTerms);
router.put('/', protect, updateTerms);

module.exports = router;
