const mongoose = require('mongoose');

const termsSchema = mongoose.Schema({
    content: { type: String, required: true },
}, {
    timestamps: true
});

module.exports = mongoose.model('TermsAndConditions', termsSchema);
