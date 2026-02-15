const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware');
const { getEmployees, createEmployee, updateEmployee, deleteEmployee } = require('../controllers/employeeController');

router.route('/')
    .get(protect, checkPermission('Employee', 'view'), getEmployees)
    .post(protect, checkPermission('Employee', 'add'), createEmployee);

router.route('/:id')
    .put(protect, checkPermission('Employee', 'edit'), updateEmployee)
    .delete(protect, checkPermission('Employee', 'delete'), deleteEmployee);

module.exports = router;