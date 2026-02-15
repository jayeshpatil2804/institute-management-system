const asyncHandler = require('express-async-handler');
const ExamSchedule = require('../models/ExamSchedule');
const Student = require('../models/Student');
const ExamRequest = require('../models/ExamRequest');

// @desc    Get Exam Schedules
// @route   GET /api/master/exam-schedule
const getExamSchedules = asyncHandler(async (req, res) => {
    const { courseId, examName } = req.query;

    let query = { isDeleted: false };

    if (courseId) {
        query.course = courseId;
    }
    if (examName) {
        query.examName = { $regex: examName, $options: 'i' };
    }

    const schedules = await ExamSchedule.find(query)
        .populate('course', 'name')
        .sort({ createdAt: -1 });

    res.json(schedules);
});

// @desc    Create Exam Schedule
// @route   POST /api/master/exam-schedule
const createExamSchedule = asyncHandler(async (req, res) => {
    const { course, examName, remarks, isActive } = req.body;
    
    const schedule = await ExamSchedule.create({
        course, examName, remarks, isActive
    });

    // Populate course immediately for frontend return
    const populated = await ExamSchedule.findById(schedule._id).populate('course', 'name');
    res.status(201).json(populated);
});

// @desc    Update Exam Schedule
// @route   PUT /api/master/exam-schedule/:id
const updateExamSchedule = asyncHandler(async (req, res) => {
    const schedule = await ExamSchedule.findById(req.params.id);
    if (schedule) {
        schedule.course = req.body.course || schedule.course;
        schedule.examName = req.body.examName || schedule.examName;
        schedule.remarks = req.body.remarks || schedule.remarks;
        schedule.isActive = req.body.isActive !== undefined ? req.body.isActive : schedule.isActive;

        const updated = await schedule.save();
        const populated = await ExamSchedule.findById(updated._id).populate('course', 'name');
        res.json(populated);
    } else {
        res.status(404); throw new Error('Schedule not found');
    }
});

// @desc    Delete Exam Schedule Permanently
// @route   DELETE /api/master/exam-schedule/:id
const deleteExamSchedule = asyncHandler(async (req, res) => {
    const schedule = await ExamSchedule.findByIdAndDelete(req.params.id);
    if (schedule) {
        res.json({ id: req.params.id, message: 'Exam Schedule removed permanently' });
    } else {
        res.status(404); throw new Error('Schedule not found');
    }
});

// @desc    Get Details (Students who took the exam / linked to course)
// @route   GET /api/master/exam-schedule/:id/details
const getExamScheduleDetails = asyncHandler(async (req, res) => {
    const schedule = await ExamSchedule.findById(req.params.id);
    if (!schedule) {
        res.status(404); throw new Error('Schedule not found');
    }

    // Logic: Find students in this course who have an Exam Request (or just students in course)
    // Here we fetch students in the course who have a 'Pending' or 'Approved' Exam Request
    // This connects the previous 'Exam Request' module to this 'Exam Schedule'
    
    const studentsInCourse = await Student.find({ course: schedule.course }).select('_id');
    
    const examRequests = await ExamRequest.find({ 
        student: { $in: studentsInCourse },
        status: { $in: ['Approved', 'Completed', 'Pending'] }
    }).populate('student', 'firstName lastName regNo admissionDate mobileStudent course');

    // Transform to flat format for table
    const details = examRequests.map(req => ({
        _id: req.student._id,
        admissionDate: req.student.admissionDate,
        regNo: req.student.regNo,
        studentName: `${req.student.firstName} ${req.student.lastName}`,
        mobile: req.student.mobileStudent,
        courseName: schedule.course // or req.student.course.name if populated
    }));

    res.json(details);
});

module.exports = { 
    getExamSchedules, 
    createExamSchedule, 
    updateExamSchedule, 
    deleteExamSchedule,
    getExamScheduleDetails 
};