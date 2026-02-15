import React, { useState, useEffect } from 'react';
import { Users, Plus, Copy, ClipboardPaste, RotateCcw } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReferences, createReference } from '../../../features/master/masterSlice';
import { toast } from 'react-toastify';
import axios from 'axios'; 
import { useNavigate, useLocation } from 'react-router-dom';
import visitorService from '../../../services/visitorService';
import { X } from 'lucide-react';
import { formatInputText } from '../../../utils/textFormatter'; // Import util

const Visitors = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { references } = useSelector((state) => state.master);
    
    // State
    const [formData, setFormData] = useState({
        visitingDate: new Date().toISOString().split('T')[0],
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

    // Dropdown Data State
    const [courses, setCourses] = useState([]);
    const [employees, setEmployees] = useState([]);
    
    // Modal State for Reference
    const [showRefModal, setShowRefModal] = useState(false);
    const [newRef, setNewRef] = useState({ name: '', mobile: '', address: '' });

    // Fetch Initial Data
    useEffect(() => {
        fetchDropdowns();
        dispatch(fetchReferences());
    }, []);

    // Handle pre-filled data from navigation (e.g., from edit in report page)
    useEffect(() => {
        if (location.state?.visitorData) {
            const visitor = location.state.visitorData;
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
        }
    }, [location.state]);

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleReset = () => {
        setFormData({
            visitingDate: new Date().toISOString().split('T')[0],
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
        toast.info('Form reset successfully');
    };

    const handleCopyData = () => {
        const dataString = JSON.stringify(formData);
        navigator.clipboard.writeText(dataString).then(() => {
            toast.success('Form data copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
            toast.error('Failed to copy data');
        });
    };

    const handlePasteData = async () => {
        try {
            const clipboardText = await navigator.clipboard.readText();
            const pastedData = JSON.parse(clipboardText);
            
            // Validate that it has the expected structure
            if (pastedData && typeof pastedData === 'object') {
                setFormData(prev => ({
                    ...prev,
                    ...pastedData
                }));
                toast.success('Data pasted successfully!');
            } else {
                toast.error('Invalid data format in clipboard');
            }
        } catch (err) {
            console.error('Failed to paste:', err);
            toast.error('Failed to paste data. Make sure you copied valid form data.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (location.state?.visitorData?._id) {
                // Update existing visitor
                await visitorService.updateVisitor(location.state.visitorData._id, formData);
                toast.success('Visitor updated successfully!');
            } else {
                // Create new visitor
                await visitorService.createVisitor(formData);
                toast.success('Visitor saved successfully!');
            }
            
            // Reset form after successful save
            handleReset();
            
            // Clear navigation state
            navigate('/transaction/visitors', { replace: true, state: {} });
        } catch (error) {
            console.error("Error saving visitor:", error);
            toast.error("Failed to save visitor");
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <div className="bg-white rounded-lg shadow-lg p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b pb-4 gap-4">
                    <div className="flex items-center gap-3">
                        <Users className="text-indigo-600" size={32} />
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Visitor Entry Form</h2>
                            <p className="text-sm text-gray-500">Add or update visitor information</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Visiting Date *</label>
                        <input 
                            type="date"
                            name="visitingDate"
                            value={formData.visitingDate}
                            onChange={handleInputChange}
                            required
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Student Name *</label>
                        <input 
                            type="text"
                            name="studentName"
                            value={formData.studentName}
                            onChange={(e) => setFormData(prev => ({ ...prev, studentName: formatInputText(e.target.value) }))}
                            required
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                        <input 
                            type="tel"
                            name="mobileNumber"
                            value={formData.mobileNumber}
                            onChange={handleInputChange}
                            required
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
                        <div className="flex gap-2">
                            <select 
                                name="reference"
                                value={formData.reference}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    const extRef = references.find(r => r.name === val);
                                    if(extRef) {
                                        setFormData(prev => ({ 
                                            ...prev, 
                                            reference: val,
                                            referenceContact: extRef.mobile || '',
                                            referenceAddress: extRef.address || ''
                                        }));
                                    } else {
                                        handleInputChange(e);
                                    }
                                }}
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Select Reference</option>
                                <optgroup label="Staff">
                                    {employees.map(emp => (
                                        <option key={emp._id} value={emp.name || `${emp.firstName} ${emp.lastName}`}>
                                            {emp.name || `${emp.firstName} ${emp.lastName}`} (Staff)
                                        </option>
                                    ))}
                                </optgroup>
                                <optgroup label="External References">
                                    {references.map((r, i) => (
                                        <option key={r._id || i} value={r.name}>{r.name}</option>
                                    ))}
                                </optgroup>
                            </select>
                            <button 
                                type="button" 
                                onClick={() => setShowRefModal(true)}
                                className="p-2 bg-indigo-50 text-indigo-600 rounded border hover:bg-indigo-100 flex-shrink-0"
                                title="Add New Reference"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Course Interested</label>
                        <select 
                            name="course" 
                            value={formData.course} 
                            onChange={handleInputChange}
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Select Course</option>
                            {courses.map(course => (
                                <option key={course._id} value={course._id}>{course.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Attended By</label>
                        <select 
                            name="attendedBy" 
                            value={formData.attendedBy} 
                            onChange={handleInputChange}
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Select Staff</option>
                            {employees.map(emp => (
                                <option key={emp._id} value={emp._id}>{emp.name || emp.firstName + ' ' + emp.lastName}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">In Time</label>
                        <input 
                            type="time" 
                            name="inTime" 
                            value={formData.inTime} 
                            onChange={handleInputChange}
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Out Time</label>
                        <input 
                            type="time" 
                            name="outTime" 
                            value={formData.outTime} 
                            onChange={handleInputChange}
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                        <textarea 
                            name="remarks"
                            value={formData.remarks}
                            onChange={(e) => setFormData(prev => ({ ...prev, remarks: formatInputText(e.target.value) }))}
                            rows="3"
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500"
                        ></textarea>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="md:col-span-2 flex flex-wrap justify-end gap-3 mt-4 pt-4 border-t">
                        <button 
                            type="button" 
                            onClick={handleReset}
                            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                            <RotateCcw size={18} />
                            Reset
                        </button>
                        <button 
                            type="button" 
                            onClick={handlePasteData}
                            className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors flex items-center gap-2"
                        >
                            <ClipboardPaste size={18} />
                            Paste Data
                        </button>
                        <button 
                            type="button" 
                            onClick={handleCopyData}
                            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Copy size={18} />
                            Copy Data
                        </button>
                        <button 
                            type="submit" 
                            className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                        >
                            {location.state?.visitorData?._id ? 'Update Visitor' : 'Save Visitor'}
                        </button>
                    </div>
                </form>
            </div>
            
            {/* Reference Modal */}
            {showRefModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-5 rounded-lg shadow-2xl w-96 border animate-fadeIn">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h4 className="font-bold text-gray-800">Add New Reference</h4>
                            <button type="button" onClick={() => setShowRefModal(false)}>
                                <X size={18} className="text-gray-500 hover:text-red-500"/>
                            </button>
                        </div>
                        <div className="space-y-3">
                            <input 
                                className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                                placeholder="Full Name *"
                                value={newRef.name}
                                onChange={e => setNewRef({...newRef, name: formatInputText(e.target.value)})}
                            />
                            <input 
                                className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                                placeholder="Mobile Number *"
                                value={newRef.mobile}
                                onChange={e => setNewRef({...newRef, mobile: e.target.value})}
                            />
                            <input 
                                className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                                placeholder="City / Address"
                                value={newRef.address}
                                onChange={e => setNewRef({...newRef, address: formatInputText(e.target.value)})}
                            />
                            <button 
                                type="button" 
                                onClick={() => {
                                    if(!newRef.name || !newRef.mobile) return toast.error('Name & Mobile required');
                                    dispatch(createReference(newRef)).then((res) => {
                                        if(!res.error) {
                                            setFormData(prev => ({ 
                                                ...prev, 
                                                reference: newRef.name,
                                                referenceContact: newRef.mobile,
                                                referenceAddress: newRef.address
                                            }));
                                            setShowRefModal(false);
                                            setNewRef({ name: '', mobile: '', address: '' });
                                            toast.success('Reference added successfully!');
                                        }
                                    });
                                }}
                                className="w-full py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition"
                            >
                                Save Reference
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Visitors;
