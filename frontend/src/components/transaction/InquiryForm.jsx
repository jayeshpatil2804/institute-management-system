import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { Save, X, Camera, User, Phone, BookOpen, Calendar, Copy, Clipboard, RotateCcw, Plus, Check } from 'lucide-react';
import { fetchEmployees, fetchReferences, fetchEducations, createReference, createEducation } from '../../features/master/masterSlice';
import { toast } from 'react-toastify';
import { formatInputText } from '../../utils/textFormatter'; // Imported util

const InquiryForm = ({ mode, initialData, onClose, onSave }) => {
    const dispatch = useDispatch();
    const { courses, employees, references, educations } = useSelector((state) => state.master);
    const [preview, setPreview] = useState(null);
    
    // UI States for Modals
    const [showRefModal, setShowRefModal] = useState(false);
    const [showEduModal, setShowEduModal] = useState(false);
    
    // New Entry States
    const [newRef, setNewRef] = useState({ name: '', mobile: '', address: '' });
    const [newEdu, setNewEdu] = useState('');

    useEffect(() => {
        dispatch(fetchEmployees());
        dispatch(fetchReferences());
        dispatch(fetchEducations());
    }, [dispatch]);

    // Determine source based on mode
    let fixedSource = 'Walk-in';
    if (mode === 'DSR') fixedSource = 'DSR';
    if (mode === 'Online') fixedSource = 'Online';
    if (mode === 'Edit') fixedSource = initialData?.source || 'Walk-in';

    const { register, handleSubmit, reset, setValue, watch, getValues } = useForm({
        defaultValues: {
            city: 'Surat',
            state: 'Gujarat',
            inquiryDate: new Date().toISOString().split('T')[0],
            source: fixedSource,
            relationType: 'Father'
        }
    });

    // Helper for file preview
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            setValue('studentPhoto', file); 
        }
    };

    // Copy / Paste Logic
    const handleCopy = () => {
        const data = getValues();
        // Exclude sensitive or unique fields if needed, but request said "copy content of full form"
        localStorage.setItem('copiedInquiryForm', JSON.stringify(data));
        toast.info('Form data copied to clipboard (local storage)');
    };

    const handlePaste = () => {
        const dataStr = localStorage.getItem('copiedInquiryForm');
        if (dataStr) {
            const data = JSON.parse(dataStr);
            // Don't overwrite ID or Date unless intended. Request said "same form is filling up again"
            // We usually want fresh dates for new inquiry
            reset({
                ...data,
                inquiryDate: new Date().toISOString().split('T')[0], // Reset date to today
                _id: undefined // Don't copy ID
            });
            toast.success('Form data pasted!');
        } else {
            toast.warn('No copied data found');
        }
    };

    useEffect(() => {
        if (initialData) {
            // Check if this is a visitor conversion
            if (initialData.isConversion) {
                reset({
                    firstName: initialData.studentName, 
                    contactStudent: initialData.mobileNumber,
                    contactParent: '',
                    interestedCourse: initialData.course?._id || initialData.course,
                    referenceBy: initialData.reference,
                    inquiryDate: initialData.visitingDate ? new Date(initialData.visitingDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    source: 'Walk-in',
                    visitorId: initialData._id, 
                    city: 'Surat',
                    state: 'Gujarat',
                    relationType: 'Father'
                });
            } else {
                // Normal Edit Mode
                const formattedData = {
                    ...initialData,
                    interestedCourse: initialData.interestedCourse?._id || initialData.interestedCourse,
                    inquiryDate: initialData.inquiryDate ? initialData.inquiryDate.split('T')[0] : '',
                    dob: initialData.dob ? initialData.dob.split('T')[0] : '',
                    followUpDate: initialData.followUpDate ? initialData.followUpDate.split('T')[0] : '',
                    relationType: initialData.relationType || 'Father'
                };
                
                // Handle complex fields manually
                // Handle Education mapping if it was custom
                if (initialData.education) {
                     // logic to ensure it shows up is handled by the list, if it was custom it should be in the list now or we add it?
                     // If it's legacy data not in master, we might just set it.
                }
                
                // If photo exists (and is string path), show preview logic could be added here if backend serves static files
                if (initialData.studentPhoto) {
                    setPreview(initialData.studentPhoto);
                }

                reset(formattedData);
            }
        } else {
            // Reset for New Entry
            reset({
                city: 'Surat',
                state: 'Gujarat',
                inquiryDate: new Date().toISOString().split('T')[0],
                source: fixedSource,
                relationType: 'Father',
                contactHome: '-',
                contactParent: '-',
                contactStudent: '-'
            });
        }
    }, [initialData, reset, fixedSource, setValue]);

    const onSubmit = (data) => {
        const formData = new FormData();
        
        // Append all standard fields
        Object.keys(data).forEach(key => {
            if (key === 'studentPhoto' && data[key] instanceof File) {
                formData.append('studentPhoto', data[key]);
            } else if (key === 'referenceDetail' && typeof data[key] === 'object') {
                 formData.append('referenceDetail', JSON.stringify(data[key]));
            } else if (data[key] !== undefined && data[key] !== null && key !== 'studentPhoto') {
                formData.append(key, data[key]);
            }
        });

        // Handle specific logic
        if (initialData?._id && !initialData.isConversion) formData.append('_id', initialData._id);
        
        // Create final FormData
        if (initialData?._id && !initialData.isConversion) formData.append('_id', initialData._id);
        
        // Ensure source is set
        if (!data.source) formData.append('source', fixedSource);

        onSave(formData); // Pass FormData object
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col animate-fadeIn relative">
                
                {/* Header */}
                <div className="flex justify-between items-center p-3 border-b bg-gray-50 rounded-t-lg flex-none">
                    <h3 className="text-lg font-bold text-gray-800">
                        {initialData ? 'Edit Inquiry' : `New ${mode} Inquiry`}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-500"><X size={24}/></button>
                </div>
                
                {/* Scrollable Body */}
                <div className="overflow-y-auto p-4 sm:p-6 flex-grow">
                    <form id="inquiry-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    
                    {/* 1. Personal Details */}
                    <div>
                        <h4 className="text-sm font-bold text-blue-600 border-b pb-1 mb-3 uppercase flex items-center gap-2">
                            <User size={16}/> Personal Information
                        </h4>
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Photo Upload - Drag & Drop Style */}
                            <div className="w-full md:w-40 flex-shrink-0">
                                <label className="block text-xs font-bold text-gray-700 mb-1">Student Photo</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex flex-col justify-center items-center bg-gray-50 hover:bg-gray-100 cursor-pointer overflow-hidden relative mb-2">
                                    <input type="file" onChange={handleFileChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                    {preview ? (
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <Camera size={24} className="text-gray-400 mb-1"/>
                                            <p className="text-[10px] text-gray-500 text-center px-1">Drag or Click to Upload</p>
                                        </>
                                    )}
                                </div>
                                
                                {/* Moved Inquiry Date Here */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700">Inquiry Date</label>
                                    <input type="date" {...register('inquiryDate')} className="w-full border p-2 rounded text-sm"/>
                                </div>
                            </div>

                            {/* Inputs Grid - Adjusted for Alignment */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-grow content-start">
                                {/* Row 1: First Name | Relation+Name | Last Name (All in one row) */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700">First Name *</label>
                                    <input 
                                        {...register('firstName', {required: true})} 
                                        className="w-full border p-2 rounded text-sm" 
                                        placeholder="First Name"
                                        onChange={(e) => setValue('firstName', formatInputText(e.target.value))}
                                    />
                                </div>
                                
                                {/* Father/Husband Combined */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700">Father/Husband Name</label>
                                    <div className="flex gap-1">
                                        <div className="w-1/3">
                                            <select {...register('relationType')} className="w-full border p-2 rounded text-sm">
                                                <option>Father</option><option>Husband</option>
                                            </select>
                                        </div>
                                        <div className="w-2/3">
                                            <input 
                                                {...register('middleName')} 
                                                className="w-full border p-2 rounded text-sm" 
                                                placeholder="Name"
                                                onChange={(e) => setValue('middleName', formatInputText(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700">Last Name</label>
                                    <input 
                                        {...register('lastName')} 
                                        className="w-full border p-2 rounded text-sm" 
                                        placeholder="Surname"
                                        onChange={(e) => setValue('lastName', formatInputText(e.target.value))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700">Email Address</label>
                                    <input type="email" {...register('email')} className="w-full border p-2 rounded text-sm" placeholder="student@example.com"/>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700">Gender</label>
                                    <select {...register('gender')} className="w-full border p-2 rounded text-sm">
                                        <option>Male</option><option>Female</option><option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700">Date of Birth</label>
                                    <input type="date" {...register('dob')} className="w-full border p-2 rounded text-sm"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Contact & Address */}
                    <div>
                        <h4 className="text-sm font-bold text-blue-600 border-b pb-1 mb-3 uppercase flex items-center gap-2">
                            <Phone size={16}/> Contact & Location
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Contact (Student) *</label>
                                <input {...register('contactStudent', {required: true})} className="w-full border p-2 rounded text-sm" placeholder="Mobile No"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Contact (Home)</label>
                                <input {...register('contactHome')} className="w-full border p-2 rounded text-sm" placeholder="Landline/Other"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Contact (Parent)</label>
                                <input {...register('contactParent')} className="w-full border p-2 rounded text-sm" placeholder="Parent No"/>
                            </div>
                            
                             <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-gray-700">City</label>
                                <input 
                                    {...register('city')} 
                                    className="w-full border p-2 rounded text-sm"
                                    onChange={(e) => setValue('city', formatInputText(e.target.value))}
                                />
                            </div>

                            <div className="md:col-span-3">
                                <label className="block text-xs font-bold text-gray-700">Address</label>
                                <textarea 
                                    {...register('address')} 
                                    rows="1" 
                                    className="w-full border p-2 rounded text-sm" 
                                    placeholder="Full Address"
                                    onChange={(e) => setValue('address', formatInputText(e.target.value))}
                                ></textarea>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-700">State</label>
                                <select {...register('state')} className="w-full border p-2 rounded text-sm">
                                    <option>Gujarat</option><option>Maharashtra</option><option>Rajasthan</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 3. Academic & Inquiry */}
                    <div>
                        <h4 className="text-sm font-bold text-blue-600 border-b pb-1 mb-3 uppercase flex items-center gap-2">
                            <BookOpen size={16}/> Academic & Course Interest
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Education</label>
                                <div className="flex gap-1">
                                    <select 
                                        {...register('education')} 
                                        className="w-full border p-2 rounded text-sm"
                                    >
                                        <option value="">-- Select --</option>
                                        {educations.map((edu, idx) => (
                                            <option key={edu._id || idx} value={edu.name}>{edu.name}</option>
                                        ))}
                                    </select>
                                    <button type="button" onClick={() => setShowEduModal(true)} className="p-2 bg-blue-50 text-blue-600 rounded border hover:bg-blue-100" title="Add New Education">
                                        <Plus size={16}/>
                                    </button>
                                </div>
                            </div>
                            {/* Qualification Input Removed as per request */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Interested Course</label>
                                <select {...register('interestedCourse')} className="w-full border p-2 rounded text-sm">
                                    <option value="">-- Select Course --</option>
                                    {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                            </div>
                            
                            {/* Reference Logic */}
                            <div className="relative">
                                <label className="block text-xs font-bold text-gray-700">Reference</label>
                                <div className="flex gap-1">
                                    <select {...register('referenceBy')} className="w-full border p-2 rounded text-sm">
                                        <option value="">-- Select Reference --</option>
                                        <optgroup label="Staff">
                                            {employees.map(e => <option key={e._id} value={e.name}>{e.name}</option>)}
                                        </optgroup>
                                        <optgroup label="External References">
                                            {references.map((r, i) => <option key={r._id || i} value={r.name}>{r.name}</option>)}
                                        </optgroup>
                                    </select>
                                    <button type="button" onClick={() => setShowRefModal(true)} className="p-2 bg-blue-50 text-blue-600 rounded border hover:bg-blue-100" title="Add New Reference">
                                        <Plus size={16}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. Follow Up Details Section */}
                    <div>
                        <h4 className="text-sm font-bold text-blue-600 border-b pb-1 mb-3 uppercase flex items-center gap-2">
                            <Calendar size={16}/> Follow-up Initial Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-gray-700">Update Date</label>
                                        <input type="date" {...register('followUpDate')} className="w-full border p-2 rounded text-sm"/>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-gray-700">Time (12h)</label>
                                        <input type="time" name="followUpTime" className="w-full border p-2 rounded text-sm" /> 
                                        {/* Ideally merge this into followUpDate before submit if needed, or keeping it separate for now */}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700">Details</label>
                                <textarea 
                                    {...register('followUpDetails')} 
                                    rows="1" 
                                    className="w-full border p-2 rounded text-sm" 
                                    placeholder="Initial discussion notes..."
                                    onChange={(e) => setValue('followUpDetails', formatInputText(e.target.value))}
                                />
                            </div>
                        </div>
                        
                        {/* Control Buttons */}
                        <div className="flex gap-2 mt-3 pt-2 border-t border-gray-100">
                           <button type="button" onClick={handleCopy} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded hover:bg-blue-100 border border-blue-200">
                                <Copy size={12}/> Copy Form
                           </button>
                           <button type="button" onClick={handlePaste} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded hover:bg-blue-100 border border-blue-200">
                                <Clipboard size={12}/> Paste
                           </button>
                           <button type="button" onClick={() => reset()} className="flex items-center gap-1 text-xs bg-gray-50 text-gray-600 px-3 py-1.5 rounded hover:bg-gray-100 border border-gray-200">
                                <RotateCcw size={12}/> Reset
                           </button>
                        </div>
                    </div>

                    </form>
                </div>
                
                {/* Modals Layer */}
                {showRefModal && (
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
                        <div className="bg-white p-4 rounded shadow-lg w-80 border animate-fadeIn">
                            <h4 className="font-bold text-gray-700 mb-2 border-b pb-1">Add New Reference</h4>
                            <div className="space-y-2">
                                <input 
                                    className="w-full border p-2 rounded text-sm" placeholder="Full Name"
                                    value={newRef.name}
                                    onChange={e => setNewRef({...newRef, name: formatInputText(e.target.value)})}
                                />
                                <input 
                                    className="w-full border p-2 rounded text-sm" placeholder="Mobile Number"
                                    value={newRef.mobile}
                                    onChange={e => setNewRef({...newRef, mobile: e.target.value})}
                                />
                                <input 
                                    className="w-full border p-2 rounded text-sm" placeholder="Address"
                                    value={newRef.address}
                                    onChange={e => setNewRef({...newRef, address: formatInputText(e.target.value)})}
                                />
                                <div className="flex justify-end gap-2 mt-2">
                                    <button type="button" onClick={() => setShowRefModal(false)} className="px-3 py-1 text-xs border rounded">Cancel</button>
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            if(!newRef.name || !newRef.mobile) return toast.error('Name & Mobile required');
                                            dispatch(createReference(newRef)).then((res) => {
                                                if(!res.error) {
                                                    setValue('referenceBy', newRef.name);
                                                    setShowRefModal(false);
                                                    setNewRef({ name: '', mobile: '', address: '' });
                                                }
                                            });
                                        }}
                                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Save Reference
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {showEduModal && (
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
                        <div className="bg-white p-4 rounded shadow-lg w-80 border animate-fadeIn">
                             <h4 className="font-bold text-gray-700 mb-2 border-b pb-1">Add Education Type</h4>
                             <div className="space-y-2">
                                <input 
                                    className="w-full border p-2 rounded text-sm" placeholder="Education Name (e.g. BCA)"
                                    value={newEdu}
                                    onChange={e => setNewEdu(formatInputText(e.target.value))}
                                />
                                <div className="flex justify-end gap-2 mt-2">
                                    <button type="button" onClick={() => setShowEduModal(false)} className="px-3 py-1 text-xs border rounded">Cancel</button>
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            if(!newEdu) return toast.error('Education Name required');
                                            dispatch(createEducation({ name: newEdu })).then((res) => {
                                                 if(!res.error) {
                                                    setValue('education', newEdu);
                                                    setShowEduModal(false);
                                                    setNewEdu('');
                                                 }
                                            });
                                        }}
                                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Save Education
                                    </button>
                                </div>
                             </div>
                        </div>
                    </div>
                )}

                {/* Footer Actions */}
                 <div className="flex justify-end gap-3 p-3 border-t bg-gray-50 rounded-b-lg flex-none">
                    <button type="button" onClick={onClose} className="px-5 py-2 border rounded text-gray-600 hover:bg-gray-100">Cancel</button>
                    <button type="submit" form="inquiry-form" className="bg-green-600 text-white px-8 py-2 rounded shadow hover:bg-green-700 flex items-center gap-2 font-bold transform hover:scale-105 transition-transform">
                        <Save size={18}/> Save {mode === 'Edit' ? 'Update' : 'Inquiry'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InquiryForm;