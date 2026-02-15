import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchBatches, createBatch, updateBatch, deleteBatch, 
    fetchCourses, fetchEmployees, resetMasterStatus, fetchBranches 
} from '../../../features/master/masterSlice';
import { toast } from 'react-toastify';
import { Search, Plus, X, Clock, Users, Edit2, Trash2, CheckSquare, Square } from 'lucide-react';

const BatchMaster = () => {
  const dispatch = useDispatch();
  const { batches, courses, employees, branches, isSuccess } = useSelector((state) => state.master);
  const { user } = useSelector((state) => state.auth);
  
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBatchId, setCurrentBatchId] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]); // Array of Course IDs

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  // Initial Filters
  const [filters, setFilters] = useState({
    startDate: '', endDate: new Date().toISOString().split('T')[0], searchBy: 'Batch Name', searchValue: ''
  });

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchEmployees());
    if (user?.role === 'Super Admin') dispatch(fetchBranches());
    dispatch(fetchBatches(filters));
  }, [dispatch, user]);

  const handleSearch = () => { dispatch(fetchBatches(filters)); };
  
  const handleReset = () => {
    setFilters({ startDate: '', endDate: '', searchBy: 'Batch Name', searchValue: '' });
    dispatch(fetchBatches({}));
  };

  useEffect(() => {
    if (isSuccess && showForm) {
        toast.success(isEditing ? "Batch Updated" : "Batch Created");
        dispatch(resetMasterStatus());
        closeForm();
        dispatch(fetchBatches(filters));
    } else if (isSuccess && !showForm) {
        // Handle delete success
        toast.success("Batch Deleted");
        dispatch(resetMasterStatus());
        dispatch(fetchBatches(filters));
    }
  }, [isSuccess, showForm, dispatch, filters, isEditing]);

  const closeForm = () => {
      reset();
      setSelectedCourses([]);
      setIsEditing(false);
      setCurrentBatchId(null);
      setShowForm(false);
  };

  const handleEdit = (batch) => {
      setValue('name', batch.name);
      setValue('batchSize', batch.batchSize);
      setValue('startTime', batch.startTime);
      setValue('endTime', batch.endTime);
      setValue('faculty', batch.faculty?._id);
      
      // Handle Date formatting for input type="date"
      const sDate = new Date(batch.startDate).toISOString().split('T')[0];
      const eDate = new Date(batch.endDate).toISOString().split('T')[0];
      setValue('startDate', sDate);
      setValue('startDate', sDate);
      setValue('endDate', eDate);
      if (batch.branchId) setValue('branchId', batch.branchId._id); // Set branch if exists

      // Pre-select courses
      const courseIds = batch.courses ? batch.courses.map(c => c._id) : [];
      setSelectedCourses(courseIds);

      setCurrentBatchId(batch._id);
      setIsEditing(true);
      setShowForm(true);
  };

  const handleDelete = (id) => {
      if(window.confirm('Are you sure you want to delete this batch?')) {
          dispatch(deleteBatch(id));
      }
  };

  const toggleCourseSelection = (courseId) => {
      if (selectedCourses.includes(courseId)) {
          setSelectedCourses(selectedCourses.filter(id => id !== courseId));
      } else {
          setSelectedCourses([...selectedCourses, courseId]);
      }
  };

  const onSubmit = (data) => { 
      if (selectedCourses.length === 0) {
          toast.error("Please select at least one course");
          return;
      }
      const payload = { ...data, courses: selectedCourses };
      
      if (isEditing) {
          dispatch(updateBatch({ id: currentBatchId, data: payload }));
      } else {
          dispatch(createBatch(payload)); 
      }
  };

  // Filter only Faculty for dropdown
  const facultyList = employees.filter(e => e.type === 'Faculty');

  return (
    <div className="container mx-auto p-4">
      
      {/* --- SECTION 1: HEADER & ADD BUTTON --- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Manage Batches</h1>
        <button 
            onClick={() => setShowForm(true)} 
            className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all text-sm font-bold"
        >
            <Plus size={20}/> Add New Batch
        </button>
      </div>

      {/* --- SECTION 2: FILTERS --- */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
        <h2 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
            <Search size={14}/> Filter Batches
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
            <div>
                <label className="text-xs text-gray-500 font-semibold">Start Date (From)</label>
                <input type="date" value={filters.startDate} onChange={e => setFilters({...filters, startDate: e.target.value})} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none"/>
            </div>
            <div>
                <label className="text-xs text-gray-500 font-semibold">End Date (To)</label>
                <input type="date" value={filters.endDate} onChange={e => setFilters({...filters, endDate: e.target.value})} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none"/>
            </div>
            <div>
                <label className="text-xs text-gray-500 font-semibold">Search By</label>
                <select value={filters.searchBy} onChange={e => setFilters({...filters, searchBy: e.target.value})} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none">
                    <option>Batch Name</option>
                    <option>Faculty Name</option>
                </select>
            </div>
            <div>
                <label className="text-xs text-gray-500 font-semibold">Value</label>
                <input 
                    type="text" 
                    placeholder="Search..."
                    value={filters.searchValue} 
                    onChange={e => setFilters({...filters, searchValue: e.target.value})} 
                    className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none"
                />
            </div>
            <div className="flex gap-2">
                <button onClick={handleReset} className="bg-gray-100 px-3 py-2 rounded hover:bg-gray-200 text-sm w-full font-medium transition">Reset</button>
                <button onClick={handleSearch} className="bg-primary text-white px-3 py-2 rounded hover:bg-blue-800 text-sm w-full font-medium transition">Search</button>
            </div>
        </div>
      </div>

      {/* --- SECTION 3: DATA TABLE --- */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-xs">Batch Name</th>
                    {user?.role === 'Super Admin' && (
                        <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-xs">Branch</th>
                    )}
                    <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-xs">Timing</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-xs">Employee</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-xs">Start Date</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-xs">End Date</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-600 uppercase text-xs">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {batches && batches.length > 0 ? batches.map((batch) => (
                    <tr key={batch._id} className="hover:bg-blue-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900">
                            {batch.name}
                        </td>
                        {user?.role === 'Super Admin' && (
                            <td className="px-4 py-3 text-gray-600">
                                {batch.branchId?.name || <span className="text-gray-400 italic">Global/Main</span>}
                            </td>
                        )}
                        <td className="px-4 py-3 text-gray-600">
                            <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded w-fit">
                                <Clock size={12} className="text-gray-500"/> {batch.startTime} - {batch.endTime}
                            </div>
                        </td>
                        <td className="px-4 py-3">
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit">
                                <Users size={12}/> {batch.faculty?.name || 'Unassigned'}
                            </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{new Date(batch.startDate).toLocaleDateString('en-GB')}</td>
                        <td className="px-4 py-3 text-gray-600">{new Date(batch.endDate).toLocaleDateString('en-GB')}</td>
                        <td className="px-4 py-3 text-right">
                            <button onClick={() => handleEdit(batch)} className="text-blue-600 hover:text-blue-900 mr-3 text-xs font-bold uppercase hover:underline inline-flex items-center gap-1">
                                <Edit2 size={12}/> Edit
                            </button>
                            <button onClick={() => handleDelete(batch._id)} className="text-red-600 hover:text-red-900 text-xs font-bold uppercase hover:underline inline-flex items-center gap-1">
                                <Trash2 size={12}/> Delete
                            </button>
                        </td>
                    </tr>
                )) : (
                    <tr><td colSpan="6" className="text-center py-8 text-gray-400">No batches found. Create one!</td></tr>
                )}
            </tbody>
        </table>
      </div>

      {/* --- ADD/EDIT BATCH MODAL --- */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden animate-fadeIn h-[90vh] flex flex-col">
                <div className="bg-primary text-white p-4 flex justify-between items-center shrink-0">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        {isEditing ? <Edit2 size={20}/> : <Plus size={20}/>} 
                        {isEditing ? 'Update Batch' : 'Create New Batch'}
                    </h2>
                    <button onClick={closeForm} className="text-white hover:text-red-200 transition"><X size={24}/></button>
                </div>
                
                <div className="overflow-y-auto p-6 flex-1">
                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Batch Name */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Batch Name *</label>
                            <input {...register('name', {required: true})} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Morning Batch A"/>
                        </div>

                        {/* Branch Selection (Super Admin Only) */}
                        {user?.role === 'Super Admin' && (
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Branch (Optional)</label>
                            <select {...register('branchId')} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none">
                                <option value="">Global / Head Office</option>
                                {branches.map(b => (
                                    <option key={b._id} value={b._id}>{b.name} ({b.city})</option>
                                ))}
                            </select>
                        </div>
                        )}

                        {/* Faculty */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Faculty *</label>
                            <select {...register('faculty', {required: true})} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none">
                                <option value="">Select Faculty</option>
                                {facultyList.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
                            </select>
                        </div>

                        {/* Size */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Batch Size</label>
                            <input type="number" {...register('batchSize')} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. 30"/>
                        </div>

                        {/* Dates */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Start Date *</label>
                            <input type="date" {...register('startDate', {required: true})} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none"/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">End Date *</label>
                            <input type="date" {...register('endDate', {required: true})} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none"/>
                        </div>

                        {/* Timing */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Start Time *</label>
                            <input type="time" {...register('startTime', {required: true})} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none"/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">End Time *</label>
                            <input type="time" {...register('endTime', {required: true})} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none"/>
                        </div>

                        {/* Course List Selection */}
                        <div className="md:col-span-2 border-t pt-4 mt-2">
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Select Courses for Batch *</label>
                            <div className="max-h-40 overflow-y-auto border rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-2 w-10">Select</th>
                                            <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Course Name</th>
                                            <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Type</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {courses.map(course => (
                                            <tr key={course._id} className={selectedCourses.includes(course._id) ? "bg-blue-50" : ""}>
                                                <td className="px-4 py-2 text-center">
                                                    <div 
                                                        onClick={() => toggleCourseSelection(course._id)}
                                                        className="cursor-pointer text-primary"
                                                    >
                                                        {selectedCourses.includes(course._id) 
                                                            ? <CheckSquare size={18} /> 
                                                            : <Square size={18} className="text-gray-400" />
                                                        }
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-700">{course.name}</td>
                                                <td className="px-4 py-2 text-xs text-gray-500">{course.courseType}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{selectedCourses.length} courses selected</p>
                        </div>
                    </form>
                </div>

                <div className="p-4 border-t bg-gray-50 flex justify-end gap-3 shrink-0">
                    <button type="button" onClick={closeForm} className="px-4 py-2 border rounded hover:bg-gray-100 text-sm font-medium">Cancel</button>
                    <button type="button" onClick={() => {reset(); setSelectedCourses([])}} className="px-4 py-2 border text-orange-600 border-orange-200 hover:bg-orange-50 text-sm font-medium">Reset</button>
                    <button onClick={handleSubmit(onSubmit)} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 shadow text-sm font-bold transition">
                        {isEditing ? 'Update Batch' : 'Save Batch'}
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default BatchMaster;