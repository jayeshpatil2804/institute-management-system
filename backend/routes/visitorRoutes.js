const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');

// Helper to wrap async functions if global error handling isn't robust, 
// but typically express 5 handles it or we use try/catch in controller which I did.

router.post('/create', visitorController.createVisitor);
router.get('/all', visitorController.getAllVisitors);
router.get('/:id', visitorController.getVisitorById);
router.put('/:id', visitorController.updateVisitor);
router.delete('/:id', visitorController.deleteVisitor);

module.exports = router;
