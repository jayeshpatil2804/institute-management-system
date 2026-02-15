const Course = require('../models/Course');
const Batch = require('../models/Batch');
const Employee = require('../models/Employee');
const Subject = require('../models/Subject');
const Student = require('../models/Student'); // Imported Student model for aggregation
const Reference = require('../models/Reference');
const Education = require('../models/Education');
const asyncHandler = require('express-async-handler');

// --- COURSE CONTROLLERS ---
const getCourses = asyncHandler(async (req, res) => {
    const { courseId, courseType } = req.query;
    let query = { isDeleted: false };
    
    if (courseId) query._id = courseId;
    if (courseType) query.courseType = courseType;

    const courses = await Course.find(query)
        .populate({
            path: 'subjects.subject',
            select: 'name printedName'
        })
        .sort({ sorting: 1, createdAt: -1 });
    res.json(courses);
});

const createCourse = asyncHandler(async (req, res) => {
    const data = { ...req.body };
    if (req.file) {
        data.image = req.file.path.replace(/\\/g, "/");
    }
    
    // Parse subjects if it comes as a string (from FormData)
    if (data.subjects && typeof data.subjects === 'string') {
        try {
            data.subjects = JSON.parse(data.subjects);
        } catch (e) {
            console.error("Error parsing subjects", e);
            data.subjects = [];
        }
    }

    const course = await Course.create(data);
    res.status(201).json(course);
});

const updateCourse = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (course) {
        const data = { ...req.body };
        if (req.file) {
            data.image = req.file.path.replace(/\\/g, "/");
        }

        // Parse subjects if it comes as a string
        if (data.subjects && typeof data.subjects === 'string') {
            try {
                data.subjects = JSON.parse(data.subjects);
            } catch (e) {
                console.error("Error parsing subjects", e);
                // Keep existing subjects if parse fails or handle error?
                // Better to just not update subjects if parse fails in this context or set empty
                // But usually it should work.
                delete data.subjects; 
            }
        }

        const updatedCourse = await Course.findByIdAndUpdate(id, data, { new: true })
            .populate({
                path: 'subjects.subject',
                select: 'name printedName'
            });
        res.json(updatedCourse);
    } else {
        res.status(404); throw new Error('Course not found');
    }
});

const deleteCourse = asyncHandler(async (req, res) => {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (course) {
        res.json({ id: req.params.id, message: 'Course removed permanently' });
    } else {
        res.status(404); throw new Error('Course not found');
    }
});

// --- BATCH CONTROLLERS ---
const getBatches = asyncHandler(async (req, res) => {
    const { startDate, endDate, searchBy, searchValue } = req.query;
    let query = { isDeleted: false };
    if (startDate && endDate) {
        query.startDate = { $gte: new Date(startDate) };
        query.endDate = { $lte: new Date(endDate) };
    }
    if (searchBy && searchValue) {
        if (searchBy === 'Batch Name') {
            query.name = { $regex: searchValue, $options: 'i' };
        } else if (searchBy === 'Faculty Name') {
            const employees = await Employee.find({ name: { $regex: searchValue, $options: 'i' } }).select('_id');
            const empIds = employees.map(e => e._id);
            query.faculty = { $in: empIds };
        }
    }

    // Filter by Branch if provided (for Multi-Branch Support)
    if (req.query.branchId) {
        query.branchId = req.query.branchId;
    } else if (req.user && (req.user.role === 'Branch Director' || req.user.role === 'Branch Admin') && req.user.branchId) {
        query.branchId = req.user.branchId;
    }

    // 1. Fetch Batches (Use .lean() to get plain JS objects for modification)
    const batches = await Batch.find(query)
        .populate('courses', 'name')
        .populate('faculty', 'name')
        .populate('branchId', 'name')
        .sort({ createdAt: -1 })
        .lean();

    // 2. Aggregate Active Students Count Grouped by Batch and Course
    const stats = await Student.aggregate([
        { $match: { isDeleted: false, isActive: true } }, // Only active students
        { $group: { _id: { batch: "$batch", course: "$course" }, count: { $sum: 1 } } }
    ]);

    // 3. Map Stats for Easy Lookup: { "BatchName": { "CourseID": Count, ... }, ... }
    const batchStats = {};
    stats.forEach(s => {
        const bName = s._id.batch;
        const cId = s._id.course ? s._id.course.toString() : 'unknown';
        
        if (!batchStats[bName]) batchStats[bName] = {};
        batchStats[bName][cId] = s.count;
    });

    // 4. Attach Course-Specific Counts to Each Batch
    const result = batches.map(b => ({
        ...b,
        // b.courseCounts[courseId] will give the count of active students for that course in this batch
        courseCounts: batchStats[b.name] || {} 
    }));

    res.json(result);
});

const createBatch = asyncHandler(async (req, res) => {
    const data = { ...req.body };
    // If user is restricted branch user, enforce their branch
    if (req.user && (req.user.role === 'Branch Director' || req.user.role === 'Branch Admin') && req.user.branchId) {
        data.branchId = req.user.branchId;
    }
    const batch = await Batch.create(data);
    res.status(201).json(batch);
});

const updateBatch = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const batch = await Batch.findById(id);
    if (batch) {
        const updatedBatch = await Batch.findByIdAndUpdate(id, req.body, { new: true })
            .populate('courses', 'name')
            .populate('faculty', 'name');
        res.json(updatedBatch);
    } else {
        res.status(404); throw new Error('Batch not found');
    }
});

const deleteBatch = asyncHandler(async (req, res) => {
    const batch = await Batch.findByIdAndDelete(req.params.id);
    if (batch) {
        res.json({ id: req.params.id, message: 'Batch removed permanently' });
    } else {
        res.status(404); throw new Error('Batch not found');
    }
});

// --- SUBJECT CONTROLLERS ---
const getSubjects = asyncHandler(async (req, res) => {
    const { searchBy, searchValue } = req.query;
    let query = { isDeleted: false };
    if (searchBy && searchValue) {
        if (searchBy === 'Subject Name') {
            query.name = { $regex: searchValue, $options: 'i' };
        } else if (searchBy === 'Printed Name') {
            query.printedName = { $regex: searchValue, $options: 'i' };
        }
    }
    const subjects = await Subject.find(query).sort({ createdAt: -1 });
    res.json(subjects);
});

const createSubject = asyncHandler(async (req, res) => {
    const subject = await Subject.create(req.body);
    res.status(201).json(subject);
});

const updateSubject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const subject = await Subject.findById(id);
    if (subject) {
        const updatedSubject = await Subject.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedSubject);
    } else {
        res.status(404); throw new Error('Subject not found');
    }
});

const deleteSubject = asyncHandler(async (req, res) => {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (subject) {
        res.json({ id: req.params.id, message: 'Subject Removed Permanently' });
    } else {
        res.status(404); throw new Error('Subject not found');
    }
});

// --- EMPLOYEE HELPERS ---
const createEmployee = asyncHandler(async (req, res) => {
    const emp = await Employee.create(req.body);
    res.status(201).json(emp);
});

const getEmployees = asyncHandler(async (req, res) => {
    const emps = await Employee.find({ isDeleted: false });
    res.json(emps);
});

// --- REFERENCE CONTROLLERS ---
const getReferences = asyncHandler(async (req, res) => {
    const references = await Reference.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json(references);
});

const createReference = asyncHandler(async (req, res) => {
    const reference = await Reference.create(req.body);
    res.status(201).json(reference);
});

// --- EDUCATION CONTROLLERS ---
const getEducations = asyncHandler(async (req, res) => {
    const educations = await Education.find({ isDeleted: false }).sort({ name: 1 });
    res.json(educations);
});

const createEducation = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const exists = await Education.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') }, isDeleted: false });
    if (exists) {
        res.status(400); throw new Error('Education type already exists');
    }
    const education = await Education.create({ name });
    res.status(201).json(education);
});

module.exports = { 
    getCourses, createCourse, updateCourse, deleteCourse, 
    getBatches, createBatch, updateBatch, deleteBatch,
    getSubjects, createSubject, updateSubject, deleteSubject,
    createEmployee, getEmployees,
    getReferences, createReference,
    getEducations, createEducation
};