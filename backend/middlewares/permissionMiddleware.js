const asyncHandler = require('express-async-handler');
const UserRight = require('../models/UserRight');

const checkPermission = (page, action) => asyncHandler(async (req, res, next) => {
    // Super Admin has all access
    if (req.user && req.user.role === 'Super Admin') {
        return next();
    }

    const userRights = await UserRight.findOne({ user: req.user._id });

    if (!userRights) {
        res.status(403);
        throw new Error('Access denied. No permissions assigned.');
    }

    // Generic Check
    const pagePermission = userRights.permissions.find(p => p.page === page);

    if (pagePermission && pagePermission[action]) {
        return next();
    }

    // Special Case: "Inquiry" covers "Inquiry - Online", "Inquiry - Offline", "Inquiry - DSR"
    // If user has rights to ANY of these, they should be able to CREATE (POST) or EDIT (PUT)
    // because the API is shared.
    if (page === 'Inquiry') {
        const hasAnyInquiryRight = userRights.permissions.some(p => 
            p.page.startsWith('Inquiry - ') && p[action] === true
        );
        if (hasAnyInquiryRight) {
            return next();
        }
    }

    res.status(403);
    throw new Error(`Access denied. You do not have permission to ${action} ${page}.`);
});

module.exports = { checkPermission };