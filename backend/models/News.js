const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    smallDetail: { type: String }, // Short summary for list views
    description: { type: String }, // Full content
    releaseDate: { type: Date, required: true, default: Date.now },
    isBreaking: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);
