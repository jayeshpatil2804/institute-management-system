const News = require('../models/News');

// Create News
exports.createNews = async (req, res) => {
    try {
        const { title, smallDetail, description, releaseDate, isBreaking, isActive } = req.body;
        const news = new News({
            title,
            smallDetail,
            description,
            releaseDate,
            isBreaking,
            isActive
        });
        await news.save();
        res.status(201).json({ message: 'News created successfully', news });
    } catch (error) {
        console.error("Error creating news:", error);
        res.status(500).json({ message: 'Error creating news', error: error.message });
    }
};

// Get All News (with filters)
exports.getAllNews = async (req, res) => {
    try {
        const { fromDate, toDate, isBreaking, search, isActive, limit } = req.query;
        let query = { isDeleted: false };

        // Date Filter
        if (fromDate && toDate) {
            query.releaseDate = { $gte: new Date(fromDate), $lte: new Date(toDate) };
        } else if (fromDate) {
            query.releaseDate = { $gte: new Date(fromDate) };
        } else if (toDate) {
            query.releaseDate = { $lte: new Date(toDate) };
        }

        // Breaking News Filter
        if (isBreaking !== undefined && isBreaking !== '') {
            query.isBreaking = isBreaking === 'true';
        }

        // Active Status Filter (for public view vs admin view)
        if (isActive !== undefined && isActive !== '') {
             query.isActive = isActive === 'true';
        }

        // Search Filter
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        let queryExec = News.find(query).sort({ releaseDate: -1, createdAt: -1 });

        if (limit) {
            queryExec = queryExec.limit(parseInt(limit));
        }

        const newsList = await queryExec;
        res.status(200).json(newsList);
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ message: 'Error fetching news', error: error.message });
    }
};

// Update News
exports.updateNews = async (req, res) => {
    try {
        const { title, smallDetail, description, releaseDate, isBreaking, isActive } = req.body;
        const updatedNews = await News.findByIdAndUpdate(
            req.params.id,
            { title, smallDetail, description, releaseDate, isBreaking, isActive },
            { new: true }
        );
        if (!updatedNews) return res.status(404).json({ message: 'News not found' });
        res.status(200).json({ message: 'News updated successfully', news: updatedNews });
    } catch (error) {
        console.error("Error updating news:", error);
        res.status(500).json({ message: 'Error updating news', error: error.message });
    }
};

// Delete News (Soft Delete)
exports.deleteNews = async (req, res) => {
    try {
        const deletedNews = await News.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true }
        );
        if (!deletedNews) return res.status(404).json({ message: 'News not found' });
        res.status(200).json({ message: 'News deleted successfully' });
    } catch (error) {
        console.error("Error deleting news:", error);
        res.status(500).json({ message: 'Error deleting news', error: error.message });
    }
};
