import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchStudentAttendanceHistory, 
    deleteStudentAttendance, 
    checkStudentAttendance, 
    fetchStudentsForAttendance,
    saveStudentAttendance,
    resetAttendanceState
} from '../../../features/transaction/attendanceSlice';
import { fetchBatches } from '../../../features/master/masterSlice';
import { toast } from 'react-toastify';
import { 
    Calendar, Users, Clock, Save, RotateCcw, Eye, Trash2, 
    PlusCircle, X, CheckSquare, Square, Search, Edit
} from 'lucide-react';

const StudentAttendance = () => {
    const dispatch = useDispatch();
    const { attendanceList, currentAttendanceStudents, attendanceStatus, isSuccess, message, isLoading } = useSelector(state => state.attendance);
    const { batches } = useSelector(state => state.master); // Get batches for dropdown

    // View Mode: 'list' or 'form' or 'view-details'
    const [viewMode, setViewMode] = useState('list'); 
    
    // --- Filters for History List ---
    const [filters, setFilters] = useState({
        fromDate: new Date().toISOString().split('T')[0],
        toDate: new Date().toISOString().split('T')[0],
        batch: '',
        batchTime: ''
    });
    
    // --- Form State ---
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        batchName: '',
        batchTime: '', // Will be auto-populated or selected
        remarks: ''
    });
    
    // Attendance Grid State (Student ID -> Status)
    const [attendanceGrid, setAttendanceGrid] = useState([]);
    const [viewingRecord, setViewingRecord] = useState(null); // For 'view-details'
    const [isEditing, setIsEditing] = useState(false); // Edit Mode Flag

    useEffect(() => {
        dispatch(fetchBatches());
        dispatch(fetchStudentAttendanceHistory(filters));
        return () => { dispatch(resetAttendanceState()); };
    }, [dispatch]);

    // Refresh history when filters change (debounced or manual search usually, but here effect is fine for now)
    const handleSearchHistory = () => {
        dispatch(fetchStudentAttendanceHistory(filters));
    };

    // Reset Filters
    const handleResetFilters = () => {
        setFilters({ fromDate: new Date().toISOString().split('T')[0], toDate: new Date().toISOString().split('T')[0], batch: '', batchTime: '' });
        dispatch(fetchStudentAttendanceHistory({}));
    };

    // --- Form Logic ---
    useEffect(() => {
        // When Batch/Time/Date changes, check status and fetch students
        // Check "isEditing" -> if we are editing, we don't want to re-load "checkStudentAttendance" because we already loaded the record.
        // We only fetch students if we are creating NEW, or if we switched batches in NEW mode.
        // Actually, if editing, we probably already have the grid from the record we loaded.
        
        if (viewMode === 'form' && !isEditing && formData.batchName && formData.batchTime && formData.date) {
            
            // 1. Check if attendance already taken
            dispatch(checkStudentAttendance({ 
                date: formData.date, 
                batch: formData.batchName, 
                batchTime: formData.batchTime 
            }));

            // 2. Fetch students for this batch (if not already fetched or logic requires refresh)
            dispatch(fetchStudentsForAttendance({ 
                batch: formData.batchName, 
                batchTime: formData.batchTime 
            }));
        }
    }, [formData.batchName, formData.batchTime, formData.date, viewMode, isEditing, dispatch]);

    // Handle Status Check Result
    useEffect(() => {
        if(viewMode === 'form' && !isEditing && attendanceStatus && currentAttendanceStudents.length > 0) {
            if (attendanceStatus.exists) {
                // If exists, DISABLE inputs? Or showing existing record?
                // Requirements: "show the attendance table disabled and message 'Attendance already taken by X'"
                // We should probably LOAD the existing data into the grid to show it?
                // The API returned `record` in attendanceStatus.
                
                if (attendanceStatus.record && attendanceStatus.record.records) {
                    const mapped = attendanceStatus.record.records.map(r => ({
                        studentId: r.studentId._id || r.studentId, 
                        enrollmentNo: r.enrollmentNo,
                        name: r.studentName || (r.studentId?.firstName ? `${r.studentId.firstName} ${r.studentId.lastName}` : 'Unknown'),
                        courseName: r.courseName,
                        contactStudent: r.contactStudent,
                        contactParent: r.contactParent,
                        isPresent: r.isPresent,
                        remark: r.studentRemark,
                        _id: r.studentId._id || r.studentId // Ensure ID match
                    }));
                     setAttendanceGrid(mapped);
                }
            } else {
                // Initialize Grid with false
                const initGrid = currentAttendanceStudents.map(s => ({
                   studentId: s._id,
                   enrollmentNo: s.enrollmentNo,
                   name: s.name,
                   courseName: s.courseName,
                   contactStudent: s.contactStudent,
                   contactParent: s.contactParent,
                   isPresent: false,
                   remark: ''
                }));
                setAttendanceGrid(initGrid);
            }
        }
    }, [attendanceStatus, currentAttendanceStudents, viewMode, isEditing]);

    // Handle Save Success
    useEffect(() => {
        if (isSuccess && message) {
            toast.success(message);
            dispatch(resetAttendanceState());
            setViewMode('list');
            dispatch(fetchStudentAttendanceHistory(filters));
        }
    }, [isSuccess, message, dispatch, filters]);


    const handleBatchChange = (e) => {
        const batchName = e.target.value;
        const selectedBatch = batches.find(b => b.name === batchName);
        const time = selectedBatch ? `${selectedBatch.startTime} - ${selectedBatch.endTime}` : '';
        
        setFormData(prev => ({ 
            ...prev, 
            batchName,
            batchTime: time // Set default time
        }));
    };

    const handleEdit = (record) => {
        setIsEditing(true);
        setViewMode('form');
        setFormData({
            date: new Date(record.date).toISOString().split('T')[0],
            batchName: record.batchName,
            batchTime: record.batchTime,
            remarks: record.remarks
        });

        // Load grid
        if (record.records) {
            const mapped = record.records.map(r => ({
                studentId: r.studentId._id || r.studentId, 
                enrollmentNo: r.enrollmentNo,
                name: r.studentName || (r.studentId?.firstName ? `${r.studentId.firstName} ${r.studentId.lastName}` : 'Unknown'),
                courseName: r.courseName,
                contactStudent: r.contactStudent,
                contactParent: r.contactParent,
                isPresent: r.isPresent,
                remark: r.studentRemark,
                _id: r.studentId._id || r.studentId
            }));
            setAttendanceGrid(mapped);
        }
    };

    const toggleAttendance = (index) => {
        if (attendanceStatus?.exists && !isEditing) return; // Allow toggle if editing, or if not exists
        const newGrid = [...attendanceGrid];
        newGrid[index].isPresent = !newGrid[index].isPresent;
        setAttendanceGrid(newGrid);
    };

    const handleStudentRemarkChange = (index, val) => {
         if (attendanceStatus?.exists && !isEditing) return; 
         const newGrid = [...attendanceGrid];
         newGrid[index].remark = val;
         setAttendanceGrid(newGrid);
    };

    const saveAttendance = () => {
        if (attendanceStatus?.exists && !isEditing) return; // Block save only if strict "Exists" check and NOT editing
        
        const payload = {
            date: formData.date,
            batchName: formData.batchName,
            batchTime: formData.batchTime,
            remarks: formData.remarks,
            records: attendanceGrid.map(rec => ({
                ...rec,
                studentName: rec.name,
                studentRemark: rec.remark
            }))
        };
        dispatch(saveStudentAttendance(payload));
    };

    const handleDelete = (id) => {
        if(window.confirm('Delete this attendance record?')) {
            dispatch(deleteStudentAttendance(id)).then(() => {
                dispatch(fetchStudentAttendanceHistory(filters));
            });
        }
    };
    
    const handleView = (record) => {
        setViewingRecord(record);
        setViewMode('view-details');
    };

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Users className="text-primary"/> Student Attendance
                    </h2>
                    <p className="text-gray-500 text-sm">Manage daily student attendance</p>
                </div>
                {viewMode === 'list' && (
                    <button 
                        onClick={() => {
                            setFormData({ date: new Date().toISOString().split('T')[0], batchName: '', batchTime: '', remarks: '' });
                            setAttendanceGrid([]);
                            dispatch(resetAttendanceState());
                            setIsEditing(false);
                            setViewMode('form');
                        }}
                        className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <PlusCircle size={18} /> Take Attendance
                    </button>
                )}
                {viewMode !== 'list' && (
                    <button 
                        onClick={() => setViewMode('list')}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-300 transition-colors"
                    >
                        <RotateCcw size={18} /> Back to List
                    </button>
                )}
            </div>

            {/* --- LIST MODE --- */}
            {viewMode === 'list' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Filters */}
                    <div className="p-4 bg-gray-50 border-b flex flex-wrap gap-4 items-end">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">From Date</label>
                            <input type="date" className="border rounded px-3 py-2 text-sm" 
                                value={filters.fromDate} onChange={e => setFilters({...filters, fromDate: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">To Date</label>
                            <input type="date" className="border rounded px-3 py-2 text-sm" 
                                value={filters.toDate} onChange={e => setFilters({...filters, toDate: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Batch Name</label>
                            <select className="border rounded px-3 py-2 text-sm min-w-[150px]"
                                value={filters.batch} onChange={e => setFilters({...filters, batch: e.target.value})}>
                                <option value="">All Batches</option>
                                {batches.map(b => (
                                    <option key={b._id} value={b.name}>{b.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Batch Time</label>
                            <input type="text" className="border rounded px-3 py-2 text-sm" 
                                placeholder="Time..."
                                value={filters.batchTime || ''} onChange={e => setFilters({...filters, batchTime: e.target.value})} />
                        </div>
                        <div className="flex gap-2">
                             <button onClick={handleSearchHistory} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700">Search</button>
                             <button onClick={handleResetFilters} className="bg-gray-400 text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-500">Reset</button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-100 text-gray-600 text-xs uppercase font-bold">
                                <tr>
                                    <th className="px-6 py-4">#</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Batch Name</th>
                                    <th className="px-6 py-4">Batch Time</th>
                                    <th className="px-6 py-4">Taken By</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {attendanceList.length > 0 ? attendanceList.map((record, index) => (
                                    <tr key={record._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                            {new Date(record.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{record.batchName}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{record.batchTime}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{record.takenBy?.name || 'Unknown'}</td>
                                        <td className="px-6 py-4 flex items-center justify-end gap-2">
                                            <button onClick={() => handleEdit(record)} className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors" title="Edit">
                                                <Edit size={18}/>
                                            </button>
                                            <button onClick={() => handleView(record)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors" title="View">
                                                <Eye size={18}/>
                                            </button>
                                            <button onClick={() => handleDelete(record._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Delete">
                                                <Trash2 size={18}/>
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                                            No attendance records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* --- FORM MODE --- */}
            {viewMode === 'form' && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">{isEditing ? 'Edit Attendance' : 'Add New Attendance'}</h3>
                    </div>
                    
                    <div className="p-6">
                        {/* Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Attendance Date</label>
                                <input type="date" 
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    value={formData.date}
                                    disabled={isEditing}
                                    onChange={e => setFormData({...formData, date: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Batch Name</label>
                                <select 
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    value={formData.batchName}
                                    disabled={isEditing}
                                    onChange={handleBatchChange}
                                >
                                    <option value="">Select Batch</option>
                                    {batches.map(b => (
                                        <option key={b._id} value={b.name}>{b.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Batch Time</label>
                                <select 
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                                    value={formData.batchTime}
                                    disabled={isEditing} 
                                    onChange={e => setFormData({...formData, batchTime: e.target.value})}
                                >
                                    {/* Populate based on selected batch. If only 1 time, simplify. */}
                                    <option value="">Select Time</option>
                                    {formData.batchTime && <option value={formData.batchTime}>{formData.batchTime}</option>}
                                    {/* If we had multiple times, we'd map them here. For now, rely on handleBatchChange setting it. 
                                        Or simply show the current value as option. 
                                        Since User wants a dropdown, let's allow it to be interactable if data supported it, but here just show the value.
                                    */}
                                </select>
                            </div>
                        </div>

                        {/* Status Message */}
                        {attendanceStatus?.exists && (
                            <div className="mb-6 bg-yellow-50 text-yellow-800 px-4 py-3 rounded-lg border border-yellow-200 flex items-center gap-2">
                                <Users size={20} />
                                <span className="font-medium">Attendance already taken by {attendanceStatus.takenBy}. Showing in Read-Only mode.</span>
                            </div>
                        )}

                        {isEditing && (
                            <div className="mb-6 bg-blue-50 text-blue-800 px-4 py-3 rounded-lg border border-blue-200 flex items-center gap-2">
                                <Edit size={20} />
                                <span className="font-medium">Editing Attendance Record.</span>
                            </div>
                        )}

                        {/* Attendance Table */}
                        {(formData.batchName && formData.batchTime) && (
                            <div className="mt-4">
                                <div className="overflow-x-auto rounded-lg border border-gray-200">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase text-center w-24">Present</th>
                                                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Enrollment No</th>
                                                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Student Name</th>
                                                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Course</th>
                                                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Contact (S)</th>
                                                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Contact (P)</th>
                                                <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {attendanceGrid.map((row, idx) => (
                                                <tr key={idx} 
                                                    className={`transition-colors border-b last:border-0 ${row.isPresent ? 'bg-green-100 border-green-200' : 'hover:bg-gray-50 border-gray-100'}`}
                                                >
                                                    <td className="px-4 py-3 text-center">
                                                        <button 
                                                            disabled={attendanceStatus?.exists && !isEditing}
                                                            onClick={() => toggleAttendance(idx)}
                                                            className={`p-1 rounded transition-colors ${row.isPresent ? 'text-green-600' : 'text-gray-300 hover:text-gray-400'}`}
                                                        >
                                                            {row.isPresent ? <CheckSquare size={24} /> : <Square size={24} />}
                                                        </button>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-600 font-mono">{row.enrollmentNo}</td>
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{row.name}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">{row.courseName}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">{row.contactStudent}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">{row.contactParent}</td>
                                                    <td className="px-4 py-3">
                                                        <input type="text"
                                                            disabled={attendanceStatus?.exists && !isEditing}
                                                            className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:border-primary disabled:bg-transparent disabled:border-transparent"
                                                            placeholder="Remark..."
                                                            value={row.remark || ''}
                                                            onChange={(e) => handleStudentRemarkChange(idx, e.target.value)}
                                                        />
                                                    </td>
                                                    
                                                </tr>
                                            ))}
                                            {attendanceGrid.length === 0 && (
                                                <tr>
                                                    <td colSpan="7" className="px-4 py-8 text-center text-gray-400">
                                                        No students found for this batch.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-6">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Batch Remarks</label>
                                    <textarea 
                                        rows="2"
                                        disabled={attendanceStatus?.exists && !isEditing}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        placeholder="Overall remarks for this batch..."
                                        value={formData.remarks}
                                        onChange={e => setFormData({...formData, remarks: e.target.value})}
                                    ></textarea>
                                </div>
                                
                                <div className="mt-6 flex justify-end gap-3">
                                    <button onClick={() => setViewMode('list')} className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">Cancel</button>
                                    <button 
                                        onClick={() => {
                                            setFormData({ date: new Date().toISOString().split('T')[0], batchName: '', batchTime: '', remarks: '' });
                                            setAttendanceGrid([]);
                                            dispatch(resetAttendanceState()); // Reset data
                                        }} // Reset to fresh
                                        className="px-6 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200"
                                    >
                                        Reset
                                    </button>
                                    {(!attendanceStatus?.exists || isEditing) && (
                                        <button 
                                            onClick={saveAttendance}
                                            disabled={isLoading}
                                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md flex items-center gap-2"
                                        >
                                            <Save size={18} /> {isLoading ? 'Saving...' : 'Save Attendance'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

             {/* --- VIEW DETAILS MODE (Reuse Form Logic somewhat) --- */}
             {viewMode === 'view-details' && viewingRecord && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                     <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">Student Attendance Details</h3>
                        <div className="text-sm text-gray-500">
                            {new Date(viewingRecord.date).toLocaleDateString()} | {viewingRecord.batchName} ({viewingRecord.batchTime})
                        </div>
                    </div>
                    <div className="p-6">
                         <div className="overflow-x-auto rounded-lg border border-gray-200 mb-4">
                            <table className="w-full text-left">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Enrollment No</th>
                                        <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Name</th>
                                        <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                                        <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {viewingRecord.records.map((rec, idx) => (
                                         <tr key={idx} className={rec.isPresent ? 'bg-green-50' : 'bg-red-50'}>
                                            <td className="px-4 py-2 text-sm text-gray-700 font-mono">{rec.enrollmentNo || '-'}</td>
                                            <td className="px-4 py-2 text-sm text-gray-800">
                                                {rec.studentName || (rec.studentId?.firstName ? `${rec.studentId.firstName} ${rec.studentId.lastName}` : 'Unknown')}
                                            </td>
                                            <td className="px-4 py-2 text-sm font-bold">
                                                {rec.isPresent ? <span className="text-green-600">Present</span> : <span className="text-red-500">Absent</span>}
                                            </td>
                                            <td className="px-4 py-2 text-sm text-gray-600">{rec.studentRemark || '-'}</td>
                                         </tr>
                                    ))}
                                </tbody>
                            </table>
                         </div>
                         <div className="mb-4">
                            <h4 className="text-sm font-bold text-gray-700">General Remarks:</h4>
                            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{viewingRecord.remarks || 'No remarks'}</p>
                         </div>
                         <div className="flex justify-end">
                            <button onClick={() => setViewMode('list')} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800">Close</button>
                         </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentAttendance;
