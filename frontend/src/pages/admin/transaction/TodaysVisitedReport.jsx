import React, { useState, useEffect } from 'react';
import { FileText, Search, Edit, Trash2, ArrowRightCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../../utils/dateUtils';
import visitorService from '../../../services/visitorService';
import { toast } from 'react-toastify';

const TodaysVisitedReport = () => {
    const navigate = useNavigate();
    
    // State
    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        fromDate: new Date().toISOString().split('T')[0],
        toDate: new Date().toISOString().split('T')[0],
        search: '',
        limit: 10
    });

    // Fetch visitors only when filters are applied
    const fetchVisitors = async () => {
        // Only fetch if at least one filter is set
        if (!filters.fromDate && !filters.toDate && !filters.search) {
            setVisitors([]);
            return;
        }

        setLoading(true);
        try {
            const data = await visitorService.getAllVisitors(filters);
            setVisitors(data);
        } catch (error) {
            console.error("Error fetching visitors:", error);
            toast.error("Failed to fetch visitors");
        } finally {
            setLoading(false);
        }
    };

    // Handlers
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        fetchVisitors();
    };

    const handleReset = () => {
        setFilters({
            fromDate: new Date().toISOString().split('T')[0],
            toDate: new Date().toISOString().split('T')[0],
            search: '',
            limit: 10
        });
        setVisitors([]);
        toast.info('Filters reset');
    };

    const handleEdit = (visitor) => {
        // Navigate to Visitors page with pre-filled data
        navigate('/transaction/visitors', { state: { visitorData: visitor } });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this visitor?')) {
            try {
                await visitorService.deleteVisitor(id);
                toast.success('Visitor deleted successfully');
                fetchVisitors(); // Refresh the list
            } catch (error) {
                console.error("Error deleting visitor:", error);
                toast.error("Failed to delete visitor");
            }
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <div className="bg-white rounded-lg shadow-lg p-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6 border-b pb-4">
                    <FileText className="text-green-600" size={32} />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Today's Visited Report</h2>
                        <p className="text-sm text-gray-500">View and filter visitor records</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">From Date</label>
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
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Reference / Search</label>
                        <input 
                            type="text" 
                            name="search" 
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Name, Mobile, Ref..."
                            className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="flex items-end gap-2">
                        <button 
                            onClick={handleSearch}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-blue-700 flex-1 justify-center"
                        >
                            <Search size={16} /> Search
                        </button>
                        <button 
                            onClick={handleReset}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-600"
                        >
                            Reset
                        </button>
                    </div>
                    <div className="flex items-end">
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-green-700 w-full justify-center">
                            <FileText size={16} /> Report
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <div className="mb-2 flex justify-end">
                        <select 
                            name="limit" 
                            value={filters.limit} 
                            onChange={(e) => { 
                                handleFilterChange(e); 
                                if (filters.fromDate || filters.toDate || filters.search) {
                                    setTimeout(fetchVisitors, 100); 
                                }
                            }}
                            className="border rounded p-1 text-sm text-gray-600"
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
                                <th className="p-3 border-b">Date</th>
                                <th className="p-3 border-b">Visitor Name</th>
                                <th className="p-3 border-b">Contact</th>
                                <th className="p-3 border-b">Reference</th>
                                <th className="p-3 border-b">Course</th>
                                <th className="p-3 border-b">In/Out</th>
                                <th className="p-3 border-b">Attended By</th>
                                <th className="p-3 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="9" className="text-center p-4">Loading...</td></tr>
                            ) : visitors.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center p-4 text-gray-500">
                                        {!filters.fromDate && !filters.toDate && !filters.search 
                                            ? 'Please apply filters to view visitor records.' 
                                            : 'No visitors found for the selected filters.'}
                                    </td>
                                </tr>
                            ) : (
                                visitors.map((visitor, index) => (
                                    <tr key={visitor._id} className="hover:bg-gray-50 text-sm border-b">
                                        <td className="p-3">{index + 1}</td>
                                        <td className="p-3">{formatDate(visitor.visitingDate)}</td>
                                        <td className="p-3 font-medium text-gray-800">{visitor.studentName}</td>
                                        <td className="p-3 text-gray-600">{visitor.mobileNumber}</td>
                                        <td className="p-3">{visitor.reference}</td>
                                        <td className="p-3">{visitor.course?.name || '-'}</td>
                                        <td className="p-3 text-xs">
                                            <div className="text-green-600">In: {visitor.inTime || '-'}</div>
                                            <div className="text-red-500">Out: {visitor.outTime || '-'}</div>
                                        </td>
                                        <td className="p-3">{visitor.attendedBy?.name || visitor.attendedBy?.username || '-'}</td>
                                        <td className="p-3">
                                            <div className="flex gap-2">
                                                {visitor.inquiryId ? (
                                                    <button 
                                                        disabled
                                                        className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 border border-green-200 cursor-not-allowed" 
                                                        title="Already Converted"
                                                    >
                                                        <ArrowRightCircle size={14} /> Converted
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => navigate('/transaction/inquiry/offline', { state: { visitorData: visitor } })} 
                                                        className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold hover:bg-orange-200 flex items-center gap-1 border border-orange-200 transition-colors" 
                                                        title="Convert to Inquiry"
                                                    >
                                                        <ArrowRightCircle size={14} /> Convert
                                                    </button>
                                                )}
                                                <button onClick={() => handleEdit(visitor)} className="text-blue-500 hover:text-blue-700 p-1">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(visitor._id)} className="text-red-500 hover:text-red-700 p-1">
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
            </div>
        </div>
    );
};

export default TodaysVisitedReport;
