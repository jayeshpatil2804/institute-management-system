import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees, createEmployee, updateEmployee, deleteEmployee, resetEmployeeStatus } from '../../../features/employee/employeeSlice';
import { getBranches } from '../../../features/master/branchSlice'; // Import API
import { toast } from 'react-toastify';
import { Search, Plus, X, Upload, User, Briefcase, Lock, Trash2, Edit, RotateCcw } from 'lucide-react';

import { useUserRights } from '../../../hooks/useUserRights';

const EmployeeMaster = () => {
  const dispatch = useDispatch();
  const { employees, isSuccess, isError, message } = useSelector((state) => state.employees);
  const { branches } = useSelector((state) => state.branch);
  const { user } = useSelector((state) => state.auth); // Get Auth User
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const watchName = watch('name');

  // Permission Check
  const { view, add, edit, delete: canDelete } = useUserRights('Employee');

  // If view is false, we might want to redirect or show a message.
  // For now, we just proceed but the list might be useless if they can't even see the page link in Navbar.

  // --- FILTERS STATE ---
  const initialFilters = {
    joiningFrom: '', 
    joiningTo: new Date().toISOString().split('T')[0], 
    gender: '', 
    searchBy: 'name', 
    searchValue: ''
  };
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    dispatch(fetchEmployees(filters));
    if(user?.role === 'Super Admin') {
        dispatch(getBranches());
    }
  }, [dispatch, filters, user]); // Auto-fetch when filters change (or remove filters from dep array to fetch only on button click)

  useEffect(() => {
    if (isError) {
        toast.error(message);
        dispatch(resetEmployeeStatus());
    }
    if (isSuccess && (showForm || message.includes('Deleted'))) {
        toast.success(message);
        dispatch(resetEmployeeStatus());
        if(showForm) closeForm();
    }
  }, [isSuccess, isError, message, showForm, dispatch]);

  // Auto Generate Credentials
  useEffect(() => {
    if (!editMode && showForm && watchName && watchName.length > 2) {
        const parts = watchName.trim().split(' ');
        let usernameBase = '';
        if (parts.length > 1) {
            const first = parts[0];
            const last = parts[parts.length - 1];
            usernameBase = first.substring(0, Math.ceil(first.length / 2)) + 
                           last.substring(0, Math.ceil(last.length / 2));
        } else {
            usernameBase = parts[0];
        }
        const randomNum = Math.floor(100 + Math.random() * 900);
        setValue('loginUsername', `${usernameBase.toLowerCase()}${randomNum}`);
        setValue('loginPassword', Math.random().toString(36).slice(-8));
    }
  }, [watchName, editMode, showForm, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setPreviewImage(URL.createObjectURL(file));
        setValue('photo', file.name);
    }
  };

  const onSubmit = (data) => {
    if (editMode && edit) {
        dispatch(updateEmployee({ id: currentId, data }));
    } else if (add) {
        dispatch(createEmployee(data));
    }
  };

  const handleEdit = (emp) => {
      if(!edit) return;
      setEditMode(true);
      setCurrentId(emp._id);
      setShowForm(true);
      setPreviewImage(emp.photo || null);
      reset({
          ...emp,
          dob: emp.dob ? emp.dob.split('T')[0] : '',
          dateOfJoining: emp.dateOfJoining ? emp.dateOfJoining.split('T')[0] : '',
          loginPassword: '' 
      });
  };

  const handleDelete = (id) => {
      if(!canDelete) return;
      if(window.confirm("Are you sure you want to delete this employee?")) {
          dispatch(deleteEmployee(id));
      }
  };

  const closeForm = () => {
      setShowForm(false);
      setEditMode(false);
      setCurrentId(null);
      setPreviewImage(null);
      reset();
  };

  const resetFilters = () => {
      setFilters(initialFilters);
  };

  return (
    <div className="container mx-auto p-4">
      
      {/* --- Header --- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Manage Employees</h1>
        {add && (
            <button 
                onClick={() => { reset(); setShowForm(true); setEditMode(false); }} 
                className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 flex items-center gap-2 shadow-lg text-sm font-bold"
            >
                <Plus size={20}/> Add New Employee
            </button>
        )}
      </div>

      {/* --- FILTER SECTION --- */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
        <h2 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
            <Search size={14}/> Filter Employees
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
            
            {/* Joining Date From */}
            <div>
                <label className="text-xs text-gray-500 font-semibold">Joining From</label>
                <input 
                    type="date" 
                    value={filters.joiningFrom} 
                    onChange={e => setFilters({...filters, joiningFrom: e.target.value})} 
                    className="w-full border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            {/* Joining Date To */}
            <div>
                <label className="text-xs text-gray-500 font-semibold">To Date</label>
                <input 
                    type="date" 
                    value={filters.joiningTo} 
                    onChange={e => setFilters({...filters, joiningTo: e.target.value})} 
                    className="w-full border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            {/* Gender Filter */}
            <div>
                <label className="text-xs text-gray-500 font-semibold">Gender</label>
                <select 
                    value={filters.gender} 
                    onChange={e => setFilters({...filters, gender: e.target.value})} 
                    className="w-full border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="">All</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div>

            {/* Search By */}
            <div>
                <label className="text-xs text-gray-500 font-semibold">Search By</label>
                <select 
                    value={filters.searchBy} 
                    onChange={e => setFilters({...filters, searchBy: e.target.value})} 
                    className="w-full border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="name">Employee Name</option>
                    <option value="email">Email ID</option>
                    <option value="mobile">Mobile Number</option>
                </select>
            </div>

            {/* Search Value */}
            <div>
                <label className="text-xs text-gray-500 font-semibold">Value</label>
                <input 
                    type="text" 
                    placeholder="Search..."
                    value={filters.searchValue} 
                    onChange={e => setFilters({...filters, searchValue: e.target.value})} 
                    className="w-full border p-2 rounded text-sm outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <button 
                    onClick={() => dispatch(fetchEmployees(filters))} 
                    className="bg-primary text-white flex-1 py-2 rounded shadow hover:bg-blue-800 text-sm font-bold flex justify-center items-center gap-2"
                >
                   <Search size={14}/> Search
                </button>
                <button 
                    onClick={resetFilters} 
                    className="bg-gray-100 text-gray-600 px-3 py-2 rounded shadow hover:bg-gray-200 text-sm font-bold"
                    title="Reset Filters"
                >
                   <RotateCcw size={14}/>
                </button>
            </div>
        </div>
      </div>

      {/* --- Data Table --- */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-xs">Employee Name</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-xs">Mobile</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-xs">Email</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-xs">Role</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-xs">Branch</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-600 uppercase text-xs">Joining Date</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-600 uppercase text-xs">Status</th>
                    {(edit || canDelete) && <th className="px-4 py-3 text-right font-bold text-gray-600 uppercase text-xs">Actions</th>}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {employees.length > 0 ? employees.map((emp) => (
                    <tr key={emp._id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 font-medium text-gray-900">
                            {emp.name}
                            <span className="block text-xs text-gray-400">{emp.regNo}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{emp.mobile}</td>
                        <td className="px-4 py-3 text-gray-600">{emp.email}</td>
                        <td className="px-4 py-3 text-gray-600">{emp.type}</td>
                        <td className="px-4 py-3 text-gray-600">
                             {emp.branchId ? (
                                 <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">
                                     {emp.branchId.name || emp.branchName}
                                 </span>
                             ) : (
                                 <span className="text-gray-400 text-xs">Main Branch</span>
                             )}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-600">
                            {emp.dateOfJoining ? new Date(emp.dateOfJoining).toLocaleDateString('en-GB') : '-'}
                        </td>
                        <td className="px-4 py-3 text-center">
                             {emp.isActive ? 
                                <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-full font-bold">ACTIVE</span> : 
                                <span className="bg-red-100 text-red-800 text-[10px] px-2 py-0.5 rounded-full font-bold">INACTIVE</span>
                            }
                        </td>
                        {(edit || canDelete) && (
                            <td className="px-4 py-3 text-right flex justify-end gap-2">
                                {edit && <button onClick={() => handleEdit(emp)} className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Edit size={16}/></button>}
                                {canDelete && <button onClick={() => handleDelete(emp._id)} className="text-red-600 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>}
                            </td>
                        )}
                    </tr>
                )) : (
                    <tr><td colSpan="7" className="text-center py-8 text-gray-400">No employees found matching criteria</td></tr>
                )}
            </tbody>
        </table>
      </div>

      {/* --- Modal Form (Same as before) --- */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="bg-primary text-white p-4 flex justify-between items-center sticky top-0 z-10">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        {editMode ? <><Edit size={20}/> Update Employee</> : <><User size={20}/> Add New Employee</>}
                    </h2>
                    <button onClick={closeForm} className="text-white hover:text-red-200"><X size={24}/></button>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
                    <div>
                        <h3 className="text-sm font-bold text-gray-500 border-b pb-2 mb-4 uppercase flex items-center gap-2"><User size={16}/> Personal Information</h3>
                        
                        {/* Branch Selection for Super Admin */}
                        {user?.role === 'Super Admin' && (
                          <div className="mb-4 bg-blue-50 p-3 rounded border border-blue-100">
                               <label className="block text-xs font-bold text-blue-800 mb-1">Assign Branch *</label>
                               <select {...register('branchId', {required: "Branch is Required"})} className="w-full border border-blue-300 p-2 rounded text-sm bg-white">
                                   <option value="">-- Select Branch --</option>
                                   {branches.map(b => (
                                       <option key={b._id} value={b._id}>{b.name} ({b.shortCode})</option>
                                   ))}
                               </select>
                               {errors.branchId && <p className="text-red-500 text-xs mt-1">{errors.branchId.message}</p>}
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-700">Full Name *</label>
                                <input {...register('name', {required:true})} className="w-full border p-2 rounded text-sm mt-1"/>
                            </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-700">Mobile Number *</label>
                                <input {...register('mobile', {required:true})} className="w-full border p-2 rounded text-sm mt-1"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Email *</label>
                                <input {...register('email', {required:true})} className="w-full border p-2 rounded text-sm mt-1"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Gender</label>
                                <select {...register('gender', {required:true})} className="w-full border p-2 rounded text-sm mt-1">
                                    <option>Male</option><option>Female</option><option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Type (Role) *</label>
                                <select {...register('type', {required:true})} className="w-full border p-2 rounded text-sm mt-1">
                                    <option>Faculty</option><option>Manager</option><option>Marketing Person</option><option>Branch Director</option><option>Receptionist</option><option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Date of Birth</label>
                                <input type="date" {...register('dob')} className="w-full border p-2 rounded text-sm mt-1"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Date of Joining</label>
                                <input type="date" {...register('dateOfJoining')} className="w-full border p-2 rounded text-sm mt-1"/>
                            </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-700">Duration</label>
                                <input {...register('duration')} className="w-full border p-2 rounded text-sm mt-1"/>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-700">Address</label>
                                <input {...register('address')} className="w-full border p-2 rounded text-sm mt-1"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Education</label>
                                <input {...register('education')} className="w-full border p-2 rounded text-sm mt-1"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Qualification</label>
                                <input {...register('qualification')} className="w-full border p-2 rounded text-sm mt-1"/>
                            </div>
                            <div className="md:col-span-4 border-2 border-dashed border-gray-300 rounded p-4 flex flex-col items-center bg-gray-50">
                                {previewImage ? (
                                    <img src={previewImage} alt="Preview" className="h-20 w-20 rounded-full object-cover mb-2"/>
                                ) : (
                                    <Upload className="text-gray-400 mb-2"/>
                                )}
                                <label className="cursor-pointer text-blue-600 text-xs font-bold hover:underline">
                                    {previewImage ? "Change Photo" : "Upload Passport Size Photo"}
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange}/>
                                </label>
                            </div>
                            <label className="flex items-center gap-2 mt-2 col-span-2">
                                <input type="checkbox" {...register('isActive')} defaultChecked className="w-4 h-4"/>
                                <span className="text-sm text-gray-700 font-semibold">Employee is Active</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-gray-500 border-b pb-2 mb-4 uppercase flex items-center gap-2"><Briefcase size={16}/> Work Experience Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div><label className="block text-xs font-bold text-gray-700">Experience</label><input {...register('experience')} className="w-full border p-2 rounded text-sm mt-1"/></div>
                            <div><label className="block text-xs font-bold text-gray-700">Working Time Period</label><input {...register('workingTimePeriod')} className="w-full border p-2 rounded text-sm mt-1"/></div>
                            <div><label className="block text-xs font-bold text-gray-700">Company Name</label><input {...register('companyName')} className="w-full border p-2 rounded text-sm mt-1"/></div>
                            <div><label className="block text-xs font-bold text-gray-700">Role</label><input {...register('role')} className="w-full border p-2 rounded text-sm mt-1"/></div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                        <div className="flex justify-between items-center border-b border-yellow-300 pb-2 mb-4">
                            <h3 className="text-sm font-bold text-yellow-800 uppercase flex items-center gap-2"><Lock size={16}/> Login Details</h3>
                            {!editMode && <span className="text-[10px] bg-yellow-200 px-2 py-1 rounded text-yellow-800">Auto-Generated</span>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div><label className="block text-xs font-bold text-gray-700">Login Username</label><input {...register('loginUsername')} readOnly={!editMode} className="w-full border p-2 rounded text-sm mt-1 bg-gray-100 cursor-not-allowed"/></div>
                            <div><label className="block text-xs font-bold text-gray-700">Password</label><input type="text" {...register('loginPassword')} placeholder={editMode ? "Leave empty to keep current" : ""} className="w-full border p-2 rounded text-sm mt-1 bg-white"/></div>
                            <div className="flex items-end pb-2"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" {...register('isLoginActive')} defaultChecked className="w-4 h-4 text-green-600"/><span className="text-sm font-bold text-gray-700">Login Active?</span></label></div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={closeForm} className="px-6 py-2 border rounded hover:bg-gray-100 text-sm font-medium">Cancel</button>
                        <button type="submit" className="bg-primary text-white px-8 py-2 rounded hover:bg-blue-800 shadow text-sm font-bold">{editMode ? "Update Employee" : "Save Employee"}</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeMaster;