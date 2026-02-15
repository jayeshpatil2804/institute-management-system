const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { 
    getUserRights, 
    saveUserRights, 
    getMyRights,
    getTemplates,
    createTemplate,
    deleteTemplate
} = require('../controllers/userRightController');

// All routes protected
router.use(protect);

router.get('/me', getMyRights);

// Template Routes (Order matters: defined before /:userId)
router.get('/templates', getTemplates);
router.post('/templates', createTemplate);
router.delete('/templates/:id', deleteTemplate);

router.get('/:userId', getUserRights);
router.post('/', saveUserRights);

module.exports = router;