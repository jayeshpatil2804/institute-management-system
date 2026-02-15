import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses, fetchExamSchedules, createExamSchedule, updateExamSchedule, deleteExamSchedule, resetMasterStatus } from '../../../features/master/masterSlice';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Plus, Search, RefreshCw, Edit, Trash2, Eye, X, Save } from 'lucide-react';
import axios from 'axios'; // For direct detail fetch

const ExamSchedule = () => {
  const dispatch = useDispatch();
  const { courses, examSchedules, isSuccess, message } = useSelector((state) => state.master);
  
  // Local State
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [filters, setFilters] = useState({ courseId: '', examName: '' });
  const [detailView, setDetailView] = useState(null); // ID of schedule to show details
  const [detailData, setDetailData] = useState([]);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // Pagination
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  // Form Setup
  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchExamSchedules());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess && message) {
        toast.success(message);
        dispatch(resetMasterStatus());
        if (showForm) setShowForm(false);
        setEditMode(null);
        reset();
    }
  }, [isSuccess, message, dispatch, showForm, reset]);

  // Fetch Details when detailView changes
  useEffect(() => {
    if (detailView) {   
        setIsDetailLoading(true);
        axios.get(`${import.meta.env.VITE_API_URL}/master/exam-schedule/${detailView}/details`, { withCredentials: true })
            .then(res => setDetailData(res.data))
            .catch(err => toast.error("Failed to load details"))
            .finally(() => setIsDetailLoading(false));
    }
  }, [detailView]);

  const onSearch = () => dispatch(fetchExamSchedules(filters));
  const onReset = () => {
    setFilters({ courseId: '', examName: '' });
    dispatch(fetchExamSchedules());
  };

  const onSubmit = (data) => {
    if (editMode) {
        dispatch(updateExamSchedule({ id: editMode, data }));
    } else {
        dispatch(createExamSchedule(data));
    }
  };

  const handleEdit = (schedule) => {
    setEditMode(schedule._id);
    setShowForm(true);
    setValue('course', schedule.course._id);
    setValue('examName', schedule.examName);
    setValue('remarks', schedule.remarks);
    setValue('isActive', schedule.isActive);
  };

  const handleDelete = (id) => {
    if(window.confirm("Are you sure?")) dispatch(deleteExamSchedule(id));
  };

  // Pagination Logic (Client-side for now as Slice returns all)
  const paginatedData = examSchedules.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(examSchedules.length / pageSize);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Exam Schedule</h2>
        {!showForm && !detailView && (
            <button onClick={() => { setShowForm(true); reset(); setEditMode(null); }} className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700">
                <Plus size={18} /> Add New Exam Schedule
            </button>
        )}
      </div>

      {/* --- FORM SECTION --- */}
      {showForm && (
        <div className="bg-white p-6 rounded shadow mb-6 border-l-4 border-primary animate-fadeIn">
            <h3 className="text-lg font-bold mb-4">{editMode ? 'Edit Exam Schedule' : 'New Exam Schedule'}</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Course</label>
                    <select {...register('course', {required: true})} className="border p-2 rounded w-full">
                        <option value="">-- Select Course --</option>
                        {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Exam Name</label>
                    <input {...register('examName', {required: true})} className="border p-2 rounded w-full" placeholder="e.g. Midterm 2024" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Remarks</label>
                    <textarea {...register('remarks')} className="border p-2 rounded w-full" rows="2"></textarea>
                </div>
                <div className="flex items-center gap-2">
                    <input type="checkbox" {...register('isActive')} id="isActive" className="h-4 w-4" defaultChecked />
                    <label htmlFor="isActive" className="text-sm font-medium">Is Active</label>
                </div>
                
                <div className="md:col-span-2 flex gap-2 justify-end mt-2">
                    <button type="button" onClick={() => setShowForm(false)} className="border px-4 py-2 rounded hover:bg-gray-100">Cancel</button>
                    <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded flex items-center gap-2 hover:bg-green-700">
                        <Save size={18} /> Save
                    </button>
                </div>
            </form>
        </div>
      )}

      {/* --- FILTER SECTION --- */}
      {!showForm && !detailView && (
        <div className="bg-white p-4 rounded shadow mb-6 flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-bold text-gray-600 mb-1">Filter by Course</label>
                <select className="border p-2 rounded w-full text-sm" value={filters.courseId} onChange={(e) => setFilters({...filters, courseId: e.target.value})}>
                    <option value="">-- All Courses --</option>
                    {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
            </div>
            <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-bold text-gray-600 mb-1">Filter by Exam Name</label>
                <input className="border p-2 rounded w-full text-sm" placeholder="Search..." value={filters.examName} onChange={(e) => setFilters({...filters, examName: e.target.value})} />
            </div>
            <div className="flex gap-2">
                <button onClick={onReset} className="bg-gray-200 text-gray-700 px-4 py-2 rounded flex items-center gap-1 hover:bg-gray-300"><RefreshCw size={16}/> Reset</button>
                <button onClick={onSearch} className="bg-gray-800 text-white px-6 py-2 rounded flex items-center gap-1 hover:bg-black"><Search size={16}/> Search</button>
            </div>
        </div>
      )}

      {/* --- TABLE SECTION --- */}
      {!detailView && (
        <div className="bg-white rounded shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Serial No</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Exam Name</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Course Name</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Active Status</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedData.length > 0 ? paginatedData.map((schedule, index) => (
                        <tr key={schedule._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-500">{(page - 1) * pageSize + index + 1}</td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{schedule.examName}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{schedule.course?.name}</td>
                            <td className="px-6 py-4 text-center">
                                <span className={`px-2 py-1 text-xs rounded-full ${schedule.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {schedule.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-center flex justify-center gap-3">
                                <button onClick={() => setDetailView(schedule._id)} className="text-blue-600 hover:text-blue-800" title="View Details"><Eye size={18} /></button>
                                <button onClick={() => handleEdit(schedule)} className="text-green-600 hover:text-green-800" title="Edit"><Edit size={18} /></button>
                                <button onClick={() => handleDelete(schedule._id)} className="text-red-600 hover:text-red-800" title="Delete"><Trash2 size={18} /></button>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="5" className="text-center py-8 text-gray-500">No schedules found.</td></tr>
                    )}
                </tbody>
            </table>
            
            {/* Pagination Controls */}
            <div className="p-4 flex justify-between items-center bg-gray-50 border-t">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Rows:</span>
                    <select className="border rounded p-1 text-sm" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                        <option value={5}>5</option><option value={10}>10</option><option value={20}>20</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border rounded bg-white disabled:opacity-50">Prev</button>
                    <span className="text-sm font-medium pt-1">Page {page} of {totalPages || 1}</span>
                    <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded bg-white disabled:opacity-50">Next</button>
                </div>
            </div>
        </div>
      )}

      {/* --- DETAILS MODAL / VIEW --- */}
      {detailView && (
        <div className="bg-white p-6 rounded shadow border-t-4 border-blue-500 animate-fadeIn">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-lg font-bold text-gray-800">Exam Attendees Details</h3>
                <button onClick={() => setDetailView(null)} className="text-gray-500 hover:text-red-500"><X size={24}/></button>
            </div>
            
            {isDetailLoading ? <div className="text-center py-10">Loading details...</div> : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Sr. No.</th>
                                <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Admission Date</th>
                                <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Reg Number</th>
                                <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Student Name</th>
                                <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Mobile</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {detailData.length > 0 ? detailData.map((d, i) => (
                                <tr key={d._id}>
                                    <td className="px-4 py-2 text-sm">{i + 1}</td>
                                    <td className="px-4 py-2 text-sm text-gray-600">{new Date(d.admissionDate).toLocaleDateString()}</td>
                                    <td className="px-4 py-2 text-sm font-mono">{d.regNo}</td>
                                    <td className="px-4 py-2 text-sm font-medium text-primary">{d.studentName}</td>
                                    <td className="px-4 py-2 text-sm text-gray-600">{d.mobile}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" className="text-center py-4 text-gray-500">No students found for this exam/course.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="mt-4 flex justify-end">
                <button onClick={() => setDetailView(null)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded">Close</button>
            </div>
        </div>
      )}

    </div>
  );
};

export default ExamSchedule;