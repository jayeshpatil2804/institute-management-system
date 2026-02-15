const asyncHandler = require('express-async-handler');
const ExamResult = require('../models/ExamResult');
const Student = require('../models/Student');

// @desc    Get Exam Results with Filters
// @route   GET /api/master/exam-result
const getExamResults = asyncHandler(async (req, res) => {
    const { examId, batch, regNo, studentName } = req.query;

    let query = { isDeleted: false };

    if (examId) query.exam = examId;
    if (batch) query.batch = { $regex: batch, $options: 'i' };
    
    // Filter by Student details (requires looking up students first)
    if (regNo || studentName) {
        let studentQuery = {};
        if (regNo) studentQuery.regNo = { $regex: regNo, $options: 'i' };
        if (studentName) {
            studentQuery.$or = [
                { firstName: { $regex: studentName, $options: 'i' } },
                { lastName: { $regex: studentName, $options: 'i' } }
            ];
        }
        const students = await Student.find(studentQuery).select('_id');
        query.student = { $in: students };
    }

    const results = await ExamResult.find(query)
        .populate('student', 'firstName lastName regNo enrollmentNo mobileStudent')
        .populate('course', 'name')
        .populate('exam', 'examName')
        .sort({ createdAt: -1 });

    res.json(results);
});

// @desc    Create Exam Result
// @route   POST /api/master/exam-result
const createExamResult = asyncHandler(async (req, res) => {
    const { studentId, examId, somNumber, csrNumber, marksObtained, totalMarks, grade, isActive } = req.body;

    // Fetch student to get Course and Batch automatically
    const student = await Student.findById(studentId);
    if (!student) {
        res.status(404); throw new Error('Student not found');
    }

    const result = await ExamResult.create({
        student: studentId,
        exam: examId,
        course: student.course,
        batch: student.batch,
        somNumber,
        csrNumber,
        marksObtained,
        totalMarks,
        grade,
        isActive
    });

    const populated = await ExamResult.findById(result._id)
        .populate('student', 'firstName lastName regNo enrollmentNo')
        .populate('course', 'name')
        .populate('exam', 'examName');

    res.status(201).json(populated);
});

// @desc    Update Exam Result
// @route   PUT /api/master/exam-result/:id
const updateExamResult = asyncHandler(async (req, res) => {
    const result = await ExamResult.findById(req.params.id);
    if (result) {
        result.somNumber = req.body.somNumber || result.somNumber;
        result.csrNumber = req.body.csrNumber || result.csrNumber;
        result.marksObtained = req.body.marksObtained || result.marksObtained;
        result.totalMarks = req.body.totalMarks || result.totalMarks;
        result.grade = req.body.grade || result.grade;
        result.isActive = req.body.isActive !== undefined ? req.body.isActive : result.isActive;

        const updated = await result.save();
        // Populate for frontend update
        const populated = await ExamResult.findById(updated._id)
             .populate('student', 'firstName lastName regNo enrollmentNo')
             .populate('course', 'name')
             .populate('exam', 'examName');
             
        res.json(populated);
    } else {
        res.status(404); throw new Error('Result not found');
    }
});

module.exports = { getExamResults, createExamResult, updateExamResult };