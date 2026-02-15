const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
    getStudentsForAttendance,
    checkStudentAttendanceStatus,
    saveStudentAttendance,
    getStudentAttendanceHistory,
    deleteStudentAttendance,
    getEmployeesForAttendance,
    checkEmployeeAttendanceStatus,
    saveEmployeeAttendance,
    getEmployeeAttendanceHistory,
    deleteEmployeeAttendance
} = require('../controllers/attendanceController');

// Student Routes
router.get('/student/list', protect, getStudentsForAttendance);
router.get('/student/check', protect, checkStudentAttendanceStatus);
router.post('/student/save', protect, saveStudentAttendance);
router.get('/student/history', protect, getStudentAttendanceHistory);
router.delete('/student/:id', protect, deleteStudentAttendance);

// Employee Routes
router.get('/employee/list', protect, getEmployeesForAttendance);
router.get('/employee/check', protect, checkEmployeeAttendanceStatus);
router.post('/employee/save', protect, saveEmployeeAttendance);
router.get('/employee/history', protect, getEmployeeAttendanceHistory);
router.delete('/employee/:id', protect, deleteEmployeeAttendance);

module.exports = router;
