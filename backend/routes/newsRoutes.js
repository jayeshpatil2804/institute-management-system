const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
// const { checkPermission } = require('../middlewares/permissionMiddleware'); // Add if needed

const { createNews, getAllNews, updateNews, deleteNews } = require('../controllers/newsController');

// Public route for fetching news (or protect if strictly internal, but usually news is public)
// We will allow public access for GET, but protect for others.
router.get('/public', getAllNews); // For homepage, maybe force isActive=true in query

router.route('/')
    .get(protect, getAllNews)
    .post(protect, createNews);

router.route('/:id')
    .put(protect, updateNews)
    .delete(protect, deleteNews);

module.exports = router;
