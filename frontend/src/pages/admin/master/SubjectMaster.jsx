import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubjects, createSubject, updateSubject, deleteSubject, resetMasterStatus } from '../../../features/master/masterSlice';
import { toast } from 'react-toastify';
import { Search, Plus, X, BookOpen, Edit, Trash2, Loader, Eye, RotateCcw } from 'lucide-react';

const SubjectMaster = () => {
  const dispatch = useDispatch();
  const { subjects, isSuccess, isLoading, message } = useSelector((state) => state.master);
  
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  // Filter State
  const [filters, setFilters] = useState({
    searchBy: 'Subject Name',
    searchValue: ''
  });

  useEffect(() => {
    dispatch(fetchSubjects(filters));
  }, [dispatch]);

  const handleSearch = () => {
    dispatch(fetchSubjects(filters));
  };

  const handleResetFilters = () => {
    setFilters({ searchBy: 'Subject Name', searchValue: '' });
    dispatch(fetchSubjects({ searchBy: 'Subject Name', searchValue: '' }));
  };

  useEffect(() => {
    if (isSuccess && message) {
        toast.success(message);
        dispatch(resetMasterStatus());
        if (showForm) closeForm();
    }
  }, [isSuccess, message, showForm, dispatch]);

  const onSubmit = (data) => {
    if (editMode) {
        dispatch(updateSubject({ id: currentId, data }));
    } else {
        dispatch(createSubject(data));
    }
  };

  const handleEdit = (sub) => {
      setEditMode(true);
      setCurrentId(sub._id);
      setShowForm(true);
      
      // Prefill Form
      reset({
          name: sub.name,
          printedName: sub.printedName,
          duration: sub.duration,
          durationType: sub.durationType,
          totalMarks: sub.totalMarks,
          theoryMarks: sub.theoryMarks,
          practicalMarks: sub.practicalMarks,
          passingMarks: sub.passingMarks,
          topicName: sub.topicName,
          description: sub.description,
          isActive: sub.isActive
      });
  };

  const handleDelete = (id) => {
      if(window.confirm("Are you sure you want to delete this subject?")) {
          dispatch(deleteSubject(id));
      }
  };

  const closeForm = () => {
      setShowForm(false);
      setEditMode(false);
      setCurrentId(null);
      reset();
  };

  return (
    <div className="container mx-auto p-4">
      
      {/* --- Header & Add Button --- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Manage Subjects</h1>
        <button 
            onClick={() => { reset(); setShowForm(true); setEditMode(false); }} 
            className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 flex items-center gap-2 shadow-lg text-sm font-bold transition-all"
        >
            <Plus size={20}/> Add New Subject
        </button>
      </div>

      {/* --- Filter Section --- */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
        <h2 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
            <Search size={14}/> Filter Subjects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <div>
                <label className="text-xs text-gray-500 font-semibold">Search By</label>
                <select 
                    value={filters.searchBy} 
                    onChange={e => setFilters({...filters, searchBy: e.target.value})} 
                    className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none"
                >
                    <option>Subject Name</option>
                    <option>Printed Name</option>
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
                <button onClick={handleResetFilters} className="bg-gray-100 text-gray-600 px-3 py-2 rounded hover:bg-gray-200 text-sm font-bold transition">
                    Reset
                </button>
                <button onClick={handleSearch} className="bg-primary text-white flex-1 px-3 py-2 rounded hover:bg-blue-800 text-sm font-bold transition flex justify-center items-center gap-2">
                    <Search size={14}/> Search
                </button>
            </div>
        </div>
      </div>

      {/* --- Data Table --- */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left font-bold text-gray-600 uppercase text-xs">Subject Name</th>
                    <th className="px-6 py-3 text-left font-bold text-gray-600 uppercase text-xs">Duration</th>
                    <th className="px-6 py-3 text-center font-bold text-gray-600 uppercase text-xs">Status</th>
                    <th className="px-6 py-3 text-center font-bold text-gray-600 uppercase text-xs">Edit</th>
                    <th className="px-6 py-3 text-center font-bold text-gray-600 uppercase text-xs">Delete</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {subjects && subjects.length > 0 ? subjects.map((sub) => (
                    <tr key={sub._id} className="hover:bg-blue-50 transition duration-150">
                        <td className="px-6 py-4 font-medium text-gray-900">
                            {sub.name}
                            <span className="block text-[10px] text-gray-400">Printed: {sub.printedName}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 font-medium">
                            {sub.duration} {sub.durationType}
                        </td>
                        <td className="px-6 py-4 text-center">
                            {sub.isActive ? 
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Active
                                </span> : 
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    Inactive
                                </span>
                            }
                        </td>
                        <td className="px-6 py-4 text-center">
                            <button onClick={() => handleEdit(sub)} className="text-blue-600 hover:text-blue-900 hover:bg-blue-100 p-2 rounded-full transition">
                                <Edit size={18}/>
                            </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                            <button onClick={() => handleDelete(sub._id)} className="text-red-600 hover:text-red-900 hover:bg-red-100 p-2 rounded-full transition">
                                <Trash2 size={18}/>
                            </button>
                        </td>
                    </tr>
                )) : (
                    <tr><td colSpan="5" className="text-center py-8 text-gray-400">No subjects found matching your criteria</td></tr>
                )}
            </tbody>
        </table>
      </div>

      {/* --- Add/Edit Subject Modal --- */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden animate-fadeIn max-h-[90vh] overflow-y-auto">
                <div className="bg-primary text-white p-4 flex justify-between items-center sticky top-0 z-10">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        {editMode ? <><Edit size={20}/> Update Subject</> : <><BookOpen size={20}/> Add New Subject</>}
                    </h2>
                    <button onClick={closeForm} className="text-white hover:text-red-200 transition"><X size={24}/></button>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Names */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Subject Name *</label>
                        <input {...register('name', {required: true})} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Programming in C"/>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Printed Name *</label>
                        <input {...register('printedName', {required: true})} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="On Certificate"/>
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Duration *</label>
                        <input type="number" {...register('duration', {required: true})} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none"/>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Duration Type</label>
                        <select {...register('durationType', {required: true})} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none">
                            <option>Month</option>
                            <option>Year</option>
                        </select>
                    </div>

                    {/* Marks Configuration */}
                    <div className="md:col-span-2 bg-gray-50 p-4 rounded border border-gray-200 mt-2">
                        <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 border-b pb-1">Marks Configuration</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div>
                                <label className="block text-xs text-gray-600 font-semibold">Total Marks</label>
                                <input type="number" {...register('totalMarks', {required: true})} className="w-full border p-2 rounded text-sm bg-white"/>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 font-semibold">Theory</label>
                                <input type="number" {...register('theoryMarks')} className="w-full border p-2 rounded text-sm bg-white" defaultValue="0"/>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 font-semibold">Practical</label>
                                <input type="number" {...register('practicalMarks')} className="w-full border p-2 rounded text-sm bg-white" defaultValue="0"/>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 font-semibold">Passing</label>
                                <input type="number" {...register('passingMarks', {required: true})} className="w-full border p-2 rounded text-sm bg-white"/>
                            </div>
                        </div>
                    </div>

                    {/* Additional Details */}
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Subject Topic Name</label>
                        <input {...register('topicName')} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Core Concepts"/>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description (Landing Page)</label>
                        <textarea {...register('description')} rows="3" className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="Enter description for user homepage..."></textarea>
                    </div>

                    <div className="md:col-span-2 mt-2">
                         <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input type="checkbox" {...register('isActive')} defaultChecked className="w-5 h-5 text-green-600 rounded"/>
                            <span className="text-sm font-bold text-gray-700">Is Active?</span>
                        </label>
                    </div>

                    {/* Footer Actions */}
                    <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t mt-4">
                        
                        <button 
                            type="button" 
                            onClick={closeForm} 
                            className="px-6 py-2 border rounded hover:bg-gray-100 text-sm font-bold flex items-center gap-2"
                        >
                            <Eye size={16}/> View List
                        </button>

                        {/* RESET */}
                        <button 
                            type="button" 
                            onClick={() => reset()} 
                            className="px-6 py-2 border rounded hover:bg-yellow-50 text-yellow-700 border-yellow-200 text-sm font-bold flex items-center gap-2"
                        >
                            <RotateCcw size={16}/> Reset
                        </button>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="bg-primary text-white px-8 py-2 rounded hover:bg-blue-800 shadow text-sm font-bold transition flex items-center gap-2 disabled:opacity-70"
                        >
                            {isLoading ? <Loader className="animate-spin" size={16}/> : <Plus size={16}/>}
                            {editMode ? 'Update Subject' : 'Add Subject'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
      )}

    </div>
  );
};

export default SubjectMaster;