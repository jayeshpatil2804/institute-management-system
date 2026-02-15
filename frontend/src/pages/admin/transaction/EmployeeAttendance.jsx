import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchEmployeeAttendanceHistory, 
    deleteEmployeeAttendance, 
    checkEmployeeAttendance, 
    fetchEmployeesForAttendance,
    saveEmployeeAttendance,
    resetAttendanceState
} from '../../../features/transaction/attendanceSlice';
import { toast } from 'react-toastify';
import { 
    Calendar, Briefcase, Clock, Save, RotateCcw, Eye, Trash2, 
    PlusCircle, CheckSquare, Square, Edit
} from 'lucide-react';

const EmployeeAttendance = () => {
    const dispatch = useDispatch();
    const { attendanceList, currentAttendanceEmployees, attendanceStatus, isSuccess, message, isLoading } = useSelector(state => state.attendance);

    const [viewMode, setViewMode] = useState('list'); 
    
    // Filters
    const [filters, setFilters] = useState({
        fromDate: new Date().toISOString().split('T')[0],
        toDate: new Date().toISOString().split('T')[0]
    });

    // Form
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        remarks: ''
    });
    
    const [attendanceGrid, setAttendanceGrid] = useState([]);
    const [viewingRecord, setViewingRecord] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        dispatch(fetchEmployeeAttendanceHistory(filters));
        return () => { dispatch(resetAttendanceState()); };
    }, [dispatch]);

    const handleSearchHistory = () => {
        dispatch(fetchEmployeeAttendanceHistory(filters));
    };

    const handleResetFilters = () => {
        setFilters({ fromDate: new Date().toISOString().split('T')[0], toDate: new Date().toISOString().split('T')[0] });
        dispatch(fetchEmployeeAttendanceHistory({}));
    };

    // --- Form Logic ---
    useEffect(() => {
        if (viewMode === 'form' && !isEditing && formData.date) {
            dispatch(checkEmployeeAttendance({ date: formData.date }));

            // Fetch employees if grid empty or date changed (always re-fetch to be safe or just fetch once?)
            // We need to fetch employees to build the grid.
             dispatch(fetchEmployeesForAttendance());
        }
    }, [formData.date, viewMode, isEditing, dispatch]);

    useEffect(() => {
        if(viewMode === 'form' && !isEditing && currentAttendanceEmployees.length > 0) {
            if (attendanceStatus && attendanceStatus.exists && attendanceStatus.record) {
                 // Map existing record
                 const mapped = attendanceStatus.record.records.map(r => ({
                     employeeId: r.employeeId._id || r.employeeId,
                     name: r.employeeName || (r.employeeId?.name ? r.employeeId.name : 'Unknown'),
                     srNumber: r.srNumber,
                     isPresent: r.isPresent,
                     remark: r.employeeRemark,
                     _id: r.employeeId._id || r.employeeId
                 }));
                 setAttendanceGrid(mapped);
            } else {
                // Initialize fresh grid from employee list
                const initGrid = currentAttendanceEmployees.map(e => ({
                   employeeId: e._id,
                   name: e.name,
                   srNumber: e.srNumber,
                   isPresent: false,
                   remark: ''
                }));
                // Preserve state if we just switched dates and previous grid had data? No, new date = new attendance.
                if(!attendanceStatus?.exists) setAttendanceGrid(initGrid);
            }
        }
    }, [attendanceStatus, currentAttendanceEmployees, viewMode, isEditing]);

    useEffect(() => {
        if (isSuccess && message) {
            toast.success(message);
            dispatch(resetAttendanceState());
            setViewMode('list');
            dispatch(fetchEmployeeAttendanceHistory(filters));
        }
    }, [isSuccess, message, dispatch, filters]);


    const toggleAttendance = (index) => {
        if (attendanceStatus?.exists && !isEditing) return; 
        const newGrid = [...attendanceGrid];
        newGrid[index].isPresent = !newGrid[index].isPresent;
        setAttendanceGrid(newGrid);
    };

    const handleRemarkChange = (index, val) => {
         if (attendanceStatus?.exists && !isEditing) return; 
         const newGrid = [...attendanceGrid];
         newGrid[index].remark = val;
         setAttendanceGrid(newGrid);
    };

    const saveAttendance = () => {
        if (attendanceStatus?.exists && !isEditing) return;
        
        const payload = {
            date: formData.date,
            remarks: formData.remarks,
            records: attendanceGrid.map(rec => ({
                ...rec,
                employeeName: rec.name,
                employeeRemark: rec.remark
            }))
        };
        dispatch(saveEmployeeAttendance(payload));
    };

    const handleDelete = (id) => {
        if(window.confirm('Delete this attendance record?')) {
            dispatch(deleteEmployeeAttendance(id)).then(() => {
                dispatch(fetchEmployeeAttendanceHistory(filters));
            });
        }
    };
    
    const handleView = (record) => {
        setViewingRecord(record);
        setViewMode('view-details');
    };

    const handleEdit = (record) => {
        setIsEditing(true);
        setViewMode('form');
        setFormData({
            date: new Date(record.date).toISOString().split('T')[0],
            remarks: record.remarks
        });

        if (record.records) {
            const mapped = record.records.map(r => ({
                employeeId: r.employeeId._id || r.employeeId,
                name: r.employeeName || (r.employeeId?.name ? r.employeeId.name : 'Unknown'),
                srNumber: r.srNumber,
                isPresent: r.isPresent,
                remark: r.employeeRemark,
                _id: r.employeeId._id || r.employeeId
            }));
            setAttendanceGrid(mapped);
        }
    };

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Briefcase className="text-primary"/> Employee Attendance
                    </h2>
                    <p className="text-gray-500 text-sm">Manage staff attendance</p>
                </div>
                {viewMode === 'list' && (
                    <button 
                        onClick={() => {
                            setFormData({ date: new Date().toISOString().split('T')[0], remarks: '' });
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
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-300"
                    >
                        <RotateCcw size={18} /> Back to List
                    </button>
                )}
            </div>

            {/* --- LIST MODE --- */}
            {viewMode === 'list' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b flex flex-wrap gap-4 items-end">
                        <div className="flex gap-4">
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
                        </div>
                        <div className="flex gap-2">
                             <button onClick={handleSearchHistory} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700">Search</button>
                             <button onClick={handleResetFilters} className="bg-gray-400 text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-500">Reset</button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-100 text-gray-600 text-xs uppercase font-bold">
                                <tr>
                                    <th className="px-6 py-4">#</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Taken By</th>
                                    <th className="px-6 py-4">Day Remarks</th>
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
                                        <td className="px-6 py-4 text-sm text-gray-600">{record.takenBy?.name || 'Unknown'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">{record.remarks}</td>
                                        <td className="px-6 py-4 flex items-center justify-end gap-2">
                                            <button onClick={() => handleEdit(record)} className="p-2 text-green-600 hover:bg-green-50 rounded-full" title="Edit">
                                                <Edit size={18}/>
                                            </button>
                                            <button onClick={() => handleView(record)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-full" title="View">
                                                <Eye size={18}/>
                                            </button>
                                            <button onClick={() => handleDelete(record._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full" title="Delete">
                                                <Trash2 size={18}/>
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
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
                        <h3 className="font-bold text-gray-800">{isEditing ? 'Edit Employee Attendance' : 'New Employee Attendance'}</h3>
                    </div>
                    
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Attendance Date</label>
                                <input type="date" 
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary"
                                    value={formData.date}
                                    disabled={isEditing}
                                    onChange={e => setFormData({...formData, date: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Daily Remarks</label>
                                <input type="text"
                                    disabled={attendanceStatus?.exists}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    placeholder="Any general remarks for today..."
                                    value={formData.remarks}
                                    onChange={e => setFormData({...formData, remarks: e.target.value})}
                                />
                            </div>
                        </div>

                        {attendanceStatus?.exists && (
                            <div className="mb-6 bg-yellow-50 text-yellow-800 px-4 py-3 rounded-lg border border-yellow-200 flex items-center gap-2">
                                <Briefcase size={20} />
                                <span className="font-medium">Attendance already taken for this date by {attendanceStatus.takenBy}. Showing in Read-Only mode.</span>
                            </div>
                        )}

                        {isEditing && (
                            <div className="mb-6 bg-blue-50 text-blue-800 px-4 py-3 rounded-lg border border-blue-200 flex items-center gap-2">
                                <Edit size={20} />
                                <span className="font-medium">Editing Attendance Record.</span>
                            </div>
                        )}

                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="w-full text-left">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase text-center w-24">Present</th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Sr Number</th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Employee Name</th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Remarks</th>
                                        
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {attendanceGrid.map((row, idx) => (
                                        <tr key={idx} className={`transition-colors border-b last:border-0 ${row.isPresent ? 'bg-green-100 border-green-200' : 'hover:bg-gray-50 border-gray-100'}`}>
                                            <td className="px-6 py-3 text-center">
                                                <button 
                                                    disabled={attendanceStatus?.exists && !isEditing}
                                                    onClick={() => toggleAttendance(idx)}
                                                    className={`p-1 rounded transition-colors ${row.isPresent ? 'text-green-600' : 'text-gray-300 hover:text-gray-400'}`}
                                                >
                                                     {row.isPresent ? <CheckSquare size={24} /> : <Square size={24} />}
                                                </button>
                                            </td>
                                            <td className="px-6 py-3 text-sm text-gray-600 font-mono">{row.srNumber || '-'}</td>
                                            <td className="px-6 py-3 text-sm font-medium text-gray-800">{row.name}</td>
                                            <td className="px-6 py-3">
                                                <input type="text"
                                                    disabled={attendanceStatus?.exists}
                                                    className="w-full border border-gray-200 rounded px-2 py-1 text-sm disabled:bg-transparent disabled:border-transparent"
                                                    placeholder="Role specific remark..."
                                                    value={row.remark || ''}
                                                    onChange={(e) => handleRemarkChange(idx, e.target.value)}
                                                />
                                            </td>
                                            
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setViewMode('list')} className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">Cancel</button>
                             <button 
                                onClick={() => {
                                    setFormData({ date: new Date().toISOString().split('T')[0], remarks: '' });
                                    setAttendanceGrid([]);
                                    setIsEditing(false);
                                    dispatch(resetAttendanceState()); 
                                }}
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
                </div>
            )}

            {/* --- VIEW DETAILS --- */}
             {viewMode === 'view-details' && viewingRecord && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                     <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                        <div className="flex flex-col">
                            <h3 className="font-bold text-gray-800">Employee Attendance Details</h3>
                            <span className="text-xs text-gray-500 uppercase tracking-wide">{new Date(viewingRecord.date).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="p-6">
                         <div className="overflow-x-auto rounded-lg border border-gray-200 mb-4">
                            <table className="w-full text-left">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Sr Number</th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Name</th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {viewingRecord.records.map((rec, idx) => (
                                         <tr key={idx} className={rec.isPresent ? 'bg-green-50' : 'bg-red-50'}>
                                            <td className="px-6 py-2 text-sm text-gray-700 font-mono">{rec.srNumber || '-'}</td>
                                            <td className="px-6 py-2 text-sm text-gray-800">
                                                {rec.employeeName || (rec.employeeId?.name ? rec.employeeId.name : 'Unknown')}
                                            </td>
                                            <td className="px-6 py-2 text-sm font-bold">
                                                {rec.isPresent ? <span className="text-green-600">Present</span> : <span className="text-red-500">Absent</span>}
                                            </td>
                                            <td className="px-6 py-2 text-sm text-gray-600">{rec.employeeRemark || '-'}</td>
                                         </tr>
                                    ))}
                                </tbody>
                            </table>
                         </div>
                         <div className="mb-4">
                            <h4 className="text-sm font-bold text-gray-700">Daily Remarks:</h4>
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

export default EmployeeAttendance;
