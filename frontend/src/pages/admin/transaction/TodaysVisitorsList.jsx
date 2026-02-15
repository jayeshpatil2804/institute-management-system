import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Search, User, Clock, FileText, Edit, Trash2, ArrowRightCircle } from 'lucide-react';
import visitorService from '../../../services/visitorService';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TodaysVisitorsList = () => {
    const navigate = useNavigate();
    // State
    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(false);
    // Fixed filter for Today
    const today = new Date().toISOString().split('T')[0];
    const [search, setSearch] = useState('');
    
    // Dropdown Data (for Add/Edit Modal if we include it here too)
    // For brevity, assuming this page might just list them, but user said "Add new Visitor" here too.
    // So duplication of logic is needed unless refactored. I will duplicate for speed and independence.
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        visitingDate: today,
        studentName: '',
        mobileNumber: '',
        reference: '',
        referenceContact: '',
        referenceAddress: '',
        course: '',
        inTime: '',
        outTime: '',
        attendedBy: '',
        remarks: ''
    });

    const [courses, setCourses] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [isNewReference, setIsNewReference] = useState(false);

    useEffect(() => {
        fetchVisitors();
        fetchDropdowns();
    }, []);

    const fetchVisitors = async () => {
        setLoading(true);
        try {
            // Filter for today only
            const data = await visitorService.getAllVisitors({
                fromDate: today,
                toDate: today,
                search: search
            });
            setVisitors(data);
        } catch (error) {
            console.error("Error fetching visitors:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDropdowns = async () => {
        try {
            const coursesRes = await axios.get(`${import.meta.env.VITE_API_URL}/master/course`); 
            setCourses(coursesRes.data);
            const empRes = await axios.get(`${import.meta.env.VITE_API_URL}/employees`);
            setEmployees(empRes.data);
        } catch (error) {
            console.error("Error fetching dropdowns:", error);
        }
    };

    const handleSearch = () => {
        fetchVisitors();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this visitor?')) {
            try {
                await visitorService.deleteVisitor(id);
                fetchVisitors();
            } catch (error) {
                console.error("Error deleting visitor:", error);
            }
        }
    };

    // Form Handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddNew = () => {
        setEditMode(false);
        setIsNewReference(false);
        setFormData({
            visitingDate: today,
            studentName: '',
            mobileNumber: '',
            reference: '',
            referenceContact: '',
            referenceAddress: '',
            course: '',
            inTime: '',
            outTime: '',
            attendedBy: '',
            remarks: ''
        });
        setShowModal(true);
    };

    const handleEdit = (visitor) => {
        setEditMode(true);
        setCurrentId(visitor._id);
        const isExternal = !!visitor.referenceContact; 
        setIsNewReference(isExternal);
        setFormData({
            visitingDate: visitor.visitingDate ? visitor.visitingDate.split('T')[0] : '',
            studentName: visitor.studentName,
            mobileNumber: visitor.mobileNumber,
            reference: visitor.reference,
            referenceContact: visitor.referenceContact || '',
            referenceAddress: visitor.referenceAddress || '',
            course: visitor.course?._id || visitor.course,
            inTime: visitor.inTime,
            outTime: visitor.outTime,
            attendedBy: visitor.attendedBy?._id || visitor.attendedBy,
            remarks: visitor.remarks
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await visitorService.updateVisitor(currentId, formData);
            } else {
                await visitorService.createVisitor(formData);
            }
            setShowModal(false);
            fetchVisitors();
        } catch (error) {
            console.error("Error saving visitor:", error);
            alert("Failed to save visitor");
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <div className="flex items-center gap-3">
                        <Calendar className="text-blue-500" size={28} />
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Today's Visitors</h2>
                            <p className="text-sm text-gray-500">{new Date().toDateString()}</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleAddNew}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <Plus size={20} /> Add New
                    </button>
                </div>

                {/* Simple Search */}
                <div className="flex gap-2 mb-6 max-w-md">
                    <input 
                        type="text" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search Name or Mobile..."
                        className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    />
                    <button onClick={handleSearch} className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg text-gray-600">
                        <Search size={20} />
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-blue-50 text-left text-sm text-blue-800 uppercase tracking-wider">
                                <th className="p-3 border-b border-blue-100">Name</th>
                                <th className="p-3 border-b border-blue-100">Contact</th>
                                <th className="p-3 border-b border-blue-100">Course</th>
                                <th className="p-3 border-b border-blue-100">In/Out</th>
                                <th className="p-3 border-b border-blue-100">Attended By</th>
                                <th className="p-3 border-b border-blue-100">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center p-4">Loading...</td></tr>
                            ) : visitors.length === 0 ? (
                                <tr><td colSpan="6" className="text-center p-4 text-gray-500">No visitors today.</td></tr>
                            ) : (
                                visitors.map((visitor) => (
                                    <tr key={visitor._id} className="hover:bg-gray-50 text-sm border-b">
                                        <td className="p-3 font-medium">{visitor.studentName}</td>
                                        <td className="p-3 text-gray-600">{visitor.mobileNumber}</td>
                                        <td className="p-3">{visitor.course?.name || '-'}</td>
                                        <td className="p-3 text-xs">
                                            <span className="text-green-600">{visitor.inTime}</span>
                                            {visitor.outTime && <span className="text-red-500"> - {visitor.outTime}</span>}
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

                {/* Reuse Modal Logic - Simplified */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b flex justify-between">
                                <h3 className="text-lg font-bold">{editMode ? 'Edit Visitor' : 'Add Today\'s Visitor'}</h3>
                                <button onClick={() => setShowModal(false)}><Plus size={24} className="rotate-45" /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Same fields as Visitors.jsx roughly */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">Name</label>
                                    <input type="text" name="studentName" value={formData.studentName} onChange={handleInputChange} required className="w-full border rounded p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Mobile</label>
                                    <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} required className="w-full border rounded p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Reference</label>
                                    <select 
                                        name="reference"
                                        value={isNewReference ? 'new_ref_option' : formData.reference}
                                        onChange={(e) => {
                                            if (e.target.value === 'new_ref_option') {
                                                setIsNewReference(true);
                                                setFormData(prev => ({ ...prev, reference: '' }));
                                            } else {
                                                setIsNewReference(false);
                                                handleInputChange(e);
                                            }
                                        }}
                                        className="w-full border rounded p-2"
                                    >
                                        <option value="">Select Reference</option>
                                        {employees.map(emp => (
                                            <option key={emp._id} value={emp.name || `${emp.firstName} ${emp.lastName}`}>{emp.name || `${emp.firstName} ${emp.lastName}`} (Staff)</option>
                                        ))}
                                        <option value="new_ref_option" className="text-blue-600 font-bold">+ Add New Reference</option>
                                    </select>
                                    {isNewReference && (
                                        <div className="mt-2 bg-gray-50 p-2 border rounded">
                                            <input type="text" name="reference" value={formData.reference} onChange={handleInputChange} placeholder="Name" required className="w-full border rounded p-1 mb-1 text-sm" />
                                            <input type="tel" name="referenceContact" value={formData.referenceContact} onChange={handleInputChange} placeholder="Mobile" className="w-full border rounded p-1 mb-1 text-sm" />
                                            <input type="text" name="referenceAddress" value={formData.referenceAddress} onChange={handleInputChange} placeholder="Address" className="w-full border rounded p-1 text-sm" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Course</label>
                                    <select name="course" value={formData.course} onChange={handleInputChange} className="w-full border rounded p-2">
                                        <option value="">Select Course</option>
                                        {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">In Time</label>
                                    <input type="time" name="inTime" value={formData.inTime} onChange={handleInputChange} className="w-full border rounded p-2" />
                                </div>
                                 <div>
                                    <label className="block text-sm font-medium mb-1">Out Time</label>
                                    <input type="time" name="outTime" value={formData.outTime} onChange={handleInputChange} className="w-full border rounded p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Attended By</label>
                                    <select name="attendedBy" value={formData.attendedBy} onChange={handleInputChange} className="w-full border rounded p-2">
                                        <option value="">Select Staff</option>
                                        {employees.map(e => <option key={e._id} value={e._id}>{e.name || e.firstName}</option>)}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-1">Remarks</label>
                                    <textarea name="remarks" value={formData.remarks} onChange={handleInputChange} className="w-full border rounded p-2"></textarea>
                                </div>
                                <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TodaysVisitorsList;
