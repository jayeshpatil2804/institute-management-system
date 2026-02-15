import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, Edit, Trash2, X, AlertCircle } from 'lucide-react';
import newsService from '../../../services/newsService';
import { toast } from 'react-toastify';
import { formatDate } from '../../../utils/dateUtils';

const ManageNews = () => {
    // --- State ---
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Filters
    const [filters, setFilters] = useState({
        fromDate: '',
        toDate: new Date().toISOString().split('T')[0],
        isBreaking: '', // '' for all, 'true', 'false'
        search: '',
        limit: 10
    });

    // Modal & Form
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        smallDetail: '',
        description: '',
        releaseDate: new Date().toISOString().split('T')[0],
        isBreaking: false,
        isActive: true
    });

    // --- Effects ---
    useEffect(() => {
        fetchNews();
    }, []); // Initial load

    // --- Methods ---
    const fetchNews = async () => {
        setLoading(true);
        try {
            const data = await newsService.getAllNews(filters);
            setNewsList(data);
        } catch (error) {
            console.error("Error fetching news:", error);
            toast.error("Failed to load news.");
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        fetchNews();
    };

    const handleResetFilters = () => {
        setFilters({
            fromDate: '',
            toDate: new Date().toISOString().split('T')[0],
            isBreaking: '',
            search: '',
            limit: 10
        });
        setTimeout(fetchNews, 0); // Trigger fetch after state update (or use useEffect on filters if preferred, but manual is fine here)
    };

    // Form Handling
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddNew = () => {
        setEditMode(false);
        setFormData({
            title: '',
            smallDetail: '',
            description: '',
            releaseDate: new Date().toISOString().split('T')[0],
            isBreaking: false,
            isActive: true
        });
        setShowModal(true);
    };

    const handleEdit = (news) => {
        setEditMode(true);
        setCurrentId(news._id);
        
        setFormData({
            title: news.title,
            smallDetail: news.smallDetail || '',
            description: news.description || '',
            releaseDate: news.releaseDate ? new Date(news.releaseDate).toISOString().split('T')[0] : '',
            isBreaking: news.isBreaking,
            isActive: news.isActive
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this news item?')) {
            try {
                await newsService.deleteNews(id);
                toast.success("News deleted successfully");
                fetchNews();
            } catch (error) {
                console.error("Error deleting news:", error);
                toast.error("Failed to delete news");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await newsService.updateNews(currentId, formData);
                toast.success("News updated successfully");
            } else {
                await newsService.createNews(formData);
                toast.success("News created successfully");
            }
            setShowModal(false);
            fetchNews();
        } catch (error) {
            console.error("Error saving news:", error);
            toast.error("Failed to save news");
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-7xl animate-fade-in-up">
            <div className="bg-white rounded-lg shadow-lg p-6">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b pb-4 gap-4">
                    <div className="flex items-center gap-3">
                        <FileText className="text-orange-500" size={32} />
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Manage News</h2>
                            <p className="text-sm text-gray-500">Create, update and manage website news</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleAddNew}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md"
                    >
                        <Plus size={20} /> Add New News
                    </button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Release Date From</label>
                        <input 
                            type="date" 
                            name="fromDate" 
                            value={filters.fromDate}
                            onChange={handleFilterChange}
                            className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">To Date</label>
                        <input 
                            type="date" 
                            name="toDate" 
                            value={filters.toDate}
                            onChange={handleFilterChange}
                            className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Is Breaking News?</label>
                        <select 
                            name="isBreaking" 
                            value={filters.isBreaking} 
                            onChange={handleFilterChange}
                            className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">News Title Search</label>
                        <input 
                            type="text" 
                            name="search" 
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Search by title..."
                            className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="flex items-end gap-2">
                        <button 
                            onClick={handleSearch}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-blue-700 flex-1 justify-center transition-colors"
                        >
                            <Search size={16} /> Search
                        </button>
                        <button 
                            onClick={handleResetFilters}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-600 transition-colors"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <div className="mb-2 flex justify-end">
                         <select 
                            name="limit" 
                            value={filters.limit} 
                            onChange={(e) => { handleFilterChange(e); setTimeout(fetchNews, 0); }}
                            className="border rounded p-1 text-sm text-gray-600 focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="10">10 Entries</option>
                            <option value="25">25 Entries</option>
                            <option value="50">50 Entries</option>
                            <option value="100">100 Entries</option>
                        </select>
                    </div>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-left text-sm text-gray-600 uppercase tracking-wider">
                                <th className="p-3 border-b">Sr No.</th>
                                <th className="p-3 border-b">News Title</th>
                                <th className="p-3 border-b">Release Date</th>
                                <th className="p-3 border-b">Breaking News</th>
                                <th className="p-3 border-b">Status</th>
                                <th className="p-3 border-b text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center p-8 text-gray-500">Loading news...</td></tr>
                            ) : newsList.length === 0 ? (
                                <tr><td colSpan="6" className="text-center p-8 text-gray-500">No news found.</td></tr>
                            ) : (
                                newsList.map((news, index) => (
                                    <tr key={news._id} className="hover:bg-gray-50 text-sm border-b transition-colors">
                                        <td className="p-3 font-medium text-gray-500">{index + 1}</td>
                                        <td className="p-3 font-semibold text-gray-800">{news.title}</td>
                                        <td className="p-3 text-sm text-gray-600">{formatDate(news.releaseDate)}</td>
                                        <td className="p-3">
                                            {news.isBreaking ? (
                                                <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-bold flex items-center gap-1 w-fit">
                                                    <AlertCircle size={12} /> Yes
                                                </span>
                                            ) : (
                                                <span className="text-gray-500">No</span>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${news.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {news.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => handleEdit(news)} className="text-blue-500 hover:text-blue-700 p-1 transition-colors" title="Edit">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(news._id)} className="text-red-500 hover:text-red-700 p-1 transition-colors" title="Delete">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in-scale">
                            <div className="flex justify-between items-center p-6 border-b bg-gray-50 rounded-t-xl">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    {editMode ? <Edit size={20} className="text-indigo-600"/> : <Plus size={20} className="text-indigo-600"/>}
                                    {editMode ? 'Edit News' : 'Add New News'}
                                </h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-red-500 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">News Title</label>
                                    <input 
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        placeholder="Enter news headline"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Small Detail</label>
                                    <input 
                                        type="text"
                                        name="smallDetail"
                                        value={formData.smallDetail}
                                        onChange={handleInputChange}
                                        className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        placeholder="Short summary (optional)"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Release Date</label>
                                        <input 
                                            type="date"
                                            name="releaseDate"
                                            value={formData.releaseDate}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center gap-2 pt-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input 
                                                type="checkbox"
                                                name="isBreaking"
                                                checked={formData.isBreaking}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Is Breaking News?</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input 
                                                type="checkbox"
                                                name="isActive"
                                                checked={formData.isActive}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Is Active?</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">News Description</label>
                                    <textarea 
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="5"
                                        className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        placeholder="Detailed explanation of the news..."
                                    ></textarea>
                                </div>

                                <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-200"
                                    >
                                        {editMode ? 'Update News' : 'Save News'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageNews;
