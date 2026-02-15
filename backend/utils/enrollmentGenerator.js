const Student = require('../models/Student');
const mongoose = require('mongoose');

/**
 * Generates an enrollment number by finding the max existing number + 1.
 * This ensures it always follows the latest sequence, even if data is deleted.
 * @param {string} branchId - The ID of the branch.
 * @returns {Promise<string>} - The generated enrollment number.
 */
const generateEnrollmentNumber = async (branchId) => {
    if (!branchId) throw new Error("Branch ID is required to generate Enrollment Number");

    // Convert to ObjectId for matching
    const branchObjectId = new mongoose.Types.ObjectId(branchId);

    // Find the student with the highest numeric enrollment number for this branch
    const result = await Student.aggregate([
        { 
            $match: { 
                branchId: branchObjectId,
                // Ensure field exists and is not empty to avoid casting errors if any junk data
                enrollmentNo: { $exists: true, $ne: "" } 
            } 
        },
        { 
            $project: {
                numericEnroll: { 
                    $convert: { 
                        input: "$enrollmentNo", 
                        to: "int", 
                        onError: 0, // Treat non-numeric as 0
                        onNull: 0 
                    } 
                }
            } 
        },
        { $sort: { numericEnroll: -1 } },
        { $limit: 1 }
    ]);

    const maxEnrollment = result.length > 0 ? result[0].numericEnroll : 0;
    const nextEnrollment = maxEnrollment + 1;

    return String(nextEnrollment);
};

module.exports = generateEnrollmentNumber;
