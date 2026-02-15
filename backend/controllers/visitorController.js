const Visitor = require('../models/Visitor');
const User = require('../models/User'); // For ensuring attendedBy exists if needed

// Create a new visitor
exports.createVisitor = async (req, res) => {
    try {
        const { visitingDate, studentName, mobileNumber, reference, referenceContact, referenceAddress, course, inTime, outTime, attendedBy, remarks } = req.body;
        
        const newVisitor = new Visitor({
            visitingDate,
            studentName,
            mobileNumber,
            reference,
            referenceContact,
            referenceAddress,
            course,
            inTime,
            outTime,
            attendedBy,
            remarks
        });

        await newVisitor.save();
        res.status(201).json({ message: 'Visitor created successfully', visitor: newVisitor });
    } catch (error) {
        console.error("Error creating visitor:", error);
        res.status(500).json({ message: 'Error creating visitor', error: error.message });
    }
};

// Get all visitors with filters
exports.getAllVisitors = async (req, res) => {
    try {
        const { fromDate, toDate, search, limit } = req.query;
        let query = { isDeleted: false };

        // Date Range Filter
        if (fromDate && toDate) {
            query.visitingDate = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            };
        } else if (fromDate) {
             query.visitingDate = { $gte: new Date(fromDate) };
        } else if (toDate) {
             query.visitingDate = { $lte: new Date(toDate) };
        }

        // Search Filter (Name, Mobile, Reference)
        if (search) {
            query.$or = [
                { studentName: { $regex: search, $options: 'i' } },
                { mobileNumber: { $regex: search, $options: 'i' } },
                { reference: { $regex: search, $options: 'i' } }
            ];
        }

        let queryExec = Visitor.find(query)
            .populate('course', 'name') 
            .populate('attendedBy', 'name') // Employee model has name
            .sort({ visitingDate: -1, createdAt: -1 });

        if (limit) {
            queryExec = queryExec.limit(parseInt(limit));
        }

        const visitors = await queryExec;
        res.status(200).json(visitors);
    } catch (error) {
        console.error("Error fetching visitors:", error);
        res.status(500).json({ message: 'Error fetching visitors', error: error.message });
    }
};

// Get single visitor by ID
exports.getVisitorById = async (req, res) => {
    try {
        const visitor = await Visitor.findById(req.params.id)
            .populate('course', 'name')
            .populate('attendedBy', 'name');
            
        if (!visitor || visitor.isDeleted) {
            return res.status(404).json({ message: 'Visitor not found' });
        }
        res.status(200).json(visitor);
    } catch (error) {
        console.error("Error fetching visitor:", error);
        res.status(500).json({ message: 'Error fetching visitor', error: error.message });
    }
};

// Update visitor
exports.updateVisitor = async (req, res) => {
    try {
        const { visitingDate, studentName, mobileNumber, reference, referenceContact, referenceAddress, course, inTime, outTime, attendedBy, remarks } = req.body;
        
        const updatedVisitor = await Visitor.findByIdAndUpdate(
            req.params.id,
            {
                visitingDate,
                studentName,
                mobileNumber,
                reference,
                referenceContact,
                referenceAddress,
                course,
                inTime,
                outTime,
                attendedBy,
                remarks
            },
            { new: true }
        );

        if (!updatedVisitor) {
            return res.status(404).json({ message: 'Visitor not found' });
        }

        res.status(200).json({ message: 'Visitor updated successfully', visitor: updatedVisitor });
    } catch (error) {
        console.error("Error updating visitor:", error);
        res.status(500).json({ message: 'Error updating visitor', error: error.message });
    }
};

// Soft Delete visitor
exports.deleteVisitor = async (req, res) => {
    try {
        const deletedVisitor = await Visitor.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );

        if (!deletedVisitor) {
            return res.status(404).json({ message: 'Visitor not found' });
        }

        res.status(200).json({ message: 'Visitor deleted successfully' });
    } catch (error) {
        console.error("Error deleting visitor:", error);
        res.status(500).json({ message: 'Error deleting visitor', error: error.message });
    }
};
