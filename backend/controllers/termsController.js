const TermsAndConditions = require('../models/TermsAndConditions');

// Get Terms (Assume single document)
const getTerms = async (req, res) => {
    try {
        const terms = await TermsAndConditions.findOne();
        if (!terms) {
            return res.status(200).json({ content: "" }); // Return empty if not initialized
        }
        res.status(200).json(terms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Terms (Upsert)
const updateTerms = async (req, res) => {
    try {
        const { content } = req.body;

        if (typeof content !== 'string') {
            return res.status(400).json({ message: 'Content must be a string' });
        }

        const terms = await TermsAndConditions.findOneAndUpdate(
            {},
            { content },
            { upsert: true, new: true, runValidators: true }
        );

        res.status(200).json(terms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = {
    getTerms,
    updateTerms
};
