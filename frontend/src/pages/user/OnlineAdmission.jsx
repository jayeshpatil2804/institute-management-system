import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createPublicInquiry } from '../../features/transaction/transactionSlice';
import { fetchCourses, fetchBatches, fetchReferences, fetchEducations, createReference, createEducation } from '../../features/master/masterSlice';
import { getBranches } from '../../features/master/branchSlice';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Phone, MapPin, BookOpen, Building, Image as ImageIcon, CheckCircle, Plus, X, Upload } from 'lucide-react';
import axios from 'axios';
import { formatInputText } from '../../utils/textFormatter'; // Import util

const OnlineAdmission = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedCourseId = searchParams.get('courseId');

  const { isSuccess, isError, message, isLoading } = useSelector((state) => state.transaction);
  const { courses, references, educations } = useSelector((state) => state.master);
  const { branches } = useSelector((state) => state.branch);

  const [previewImage, setPreviewImage] = useState(null);
  const [newRefMode, setNewRefMode] = useState(false);
  const [newEduMode, setNewEduMode] = useState(false);
  
  // Local state for "Add New" inputs
  const [newRefName, setNewRefName] = useState('');
  const [newRefMobile, setNewRefMobile] = useState(''); // Optional per schema but good to have
  const [newEduName, setNewEduName] = useState('');

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      relationType: 'Father',
      state: 'Gujarat',
      city: 'Surat',
      gender: 'Male',
      source: 'OnlineAdmission',
      selectedCourse: preSelectedCourseId || ''
    }
  });

  const watchReference = watch('reference');
  const watchEducation = watch('education');
  
  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchReferences());
    dispatch(fetchEducations());
    dispatch(getBranches());
  }, [dispatch]);

  useEffect(() => {
    if (preSelectedCourseId) {
      setValue('selectedCourse', preSelectedCourseId);
    }
  }, [preSelectedCourseId, setValue]);

  const onSubmit = async (data) => {
    if (!data.agreeTerms) {
        toast.error("You must agree to the Terms and Conditions");
        return;
    }

    // Build FormData for file upload
    const formData = new FormData();
    Object.keys(data).forEach(key => {
        if (key === 'studentPhoto' && data[key][0]) {
            formData.append('studentPhoto', data[key][0]);
        } else if (key !== 'studentPhoto' && key !== 'agreeTerms') {
             // Map form fields to Inquiry Schema fields
             // Note: Inquiry expects 'interestedCourse', 'branchId', 'referenceBy'
             if(key === 'selectedCourse') formData.append('interestedCourse', data[key]);
             else if(key === 'selectedBranch') formData.append('branchId', data[key]);
             else if(key === 'reference') formData.append('referenceBy', data[key]);
             else formData.append(key, data[key]);
        }
    });

    // Special handling if using "Add New" fields that weren't saved to master yet?
    // User requirement: "add new option side of that". 
    // Ideally we save them to master DB or pass as custom string. 
    // Inquiry schema supports `customEducation`. 
    // Let's rely on standard flow: If Create New is used, we save to Master first OR pass as text.
    // Given the previous code in StudentAdmission, it saves to Master.
    
    // Actually, Inquiry.js has `referenceDetail` for new references.
    if (newRefMode) {
        if(!newRefName.trim()) {
            toast.error("Please enter reference name");
            return;
        }
        try {
            await dispatch(createReference({ name: newRefName, mobile: newRefMobile })).unwrap();
            formData.set('referenceBy', newRefName);
        } catch (err) {
            toast.error("Failed to create reference");
            return;
        }
    }
     if (newEduMode) {
        if(newEduName.trim()) {
            try {
                await dispatch(createEducation({ name: newEduName })).unwrap();
                formData.set('education', newEduName);
            } catch (err) {
                toast.error("Failed to create education record");
                return;
            }
        }
    }    
    // Explicitly set Source
    formData.set('source', 'OnlineAdmission');

    dispatch(createPublicInquiry(formData)).then((res) => {
        if(!res.error) {
            toast.success("Registration Successful!");
            navigate('/'); // Redirect to home or success page
        }
    });
  };

  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (previewImage) URL.revokeObjectURL(previewImage);
      setPreviewImage(URL.createObjectURL(file));
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-blue-800 px-8 py-6 text-white text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">Online Admission Form</h2>
          <p className="mt-2 text-blue-100">Join Smart Institute and start your journey</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
          
          {/* Section 1: Personal Details */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
                <User size={20} className="text-primary"/> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
                   <input 
                      {...register("firstName", { required: "Required" })} 
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all" 
                      placeholder="Student First Name" 
                      onChange={(e) => setValue('firstName', formatInputText(e.target.value))}
                   />
                   {errors.firstName && <span className="text-red-500 text-xs">{errors.firstName.message}</span>}
                </div>
                <div>
                    <div className="flex gap-2 mb-1">
                        <select {...register("relationType")} className="border rounded px-2 py-0.5 text-xs bg-gray-50 font-semibold">
                            <option value="Father">Father's Name</option>
                            <option value="Husband">Husband's Name</option>
                        </select>
                        <span className="text-red-500">*</span>
                    </div>
                   <input 
                      {...register("middleName")} 
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all" 
                      placeholder="Father/Husband Name" 
                      onChange={(e) => setValue('middleName', formatInputText(e.target.value))}
                   />
                </div>
                <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name <span className="text-red-500">*</span></label>
                   <input 
                      {...register("lastName", { required: "Required" })} 
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all" 
                      placeholder="Surname" 
                      onChange={(e) => setValue('lastName', formatInputText(e.target.value))}
                   />
                    {errors.lastName && <span className="text-red-500 text-xs">{errors.lastName.message}</span>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth <span className="text-red-500">*</span></label>
                   <input type="date" {...register("dob", { required: "Required" })} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all" />
                    {errors.dob && <span className="text-red-500 text-xs">{errors.dob.message}</span>}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
                    <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" value="Male" {...register("gender")} className="text-primary focus:ring-primary" /> Male
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" value="Female" {...register("gender")} className="text-pink-500 focus:ring-pink-500" /> Female
                        </label>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Student Photo</label>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden border">
                            {previewImage ? <img src={previewImage} alt="Student photo preview" className="w-full h-full object-cover" /> : <User className="w-full h-full p-2 text-gray-400"/>}                        </div>
                        <label className="cursor-pointer bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors flex items-center gap-1">
                            <Upload size={14}/> Upload
                            <input type="file" className="hidden" accept="image/*" {...register("studentPhoto")} onChange={handleImageChange} />
                        </label>
                    </div>
                </div>
            </div>
          </div>

          {/* Section 2: Contact Details */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
                <Phone size={20} className="text-primary"/> Contact Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-1">Student Mobile <span className="text-red-500">*</span></label>
                   <input {...register("contactStudent", { required: "Required", pattern: { value: /^[0-9]{10}$/, message: "Invalid Mobile" } })} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="10 Digit Mobile" maxLength={10}/>
                    {errors.contactStudent && <span className="text-red-500 text-xs">{errors.contactStudent.message}</span>}
                </div>
                <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-1">Parent Mobile <span className="text-red-500">*</span></label>
                   <input {...register("contactParent", { required: "Required", pattern: { value: /^[0-9]{10}$/, message: "Invalid Mobile" } })} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="10 Digit Mobile" maxLength={10}/>
                    {errors.contactParent && <span className="text-red-500 text-xs">{errors.contactParent.message}</span>}
                </div>
                <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-1">Home Contact</label>
                   <input {...register("contactHome")} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Landline / Alt" />
                </div>
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="md:col-span-3">
                   <label className="block text-sm font-semibold text-gray-700 mb-1">Address <span className="text-red-500">*</span></label>
                   <textarea 
                      {...register("address", { required: "Required" })} 
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all" 
                      rows="2" 
                      placeholder="Full Postal Address"
                      onChange={(e) => setValue('address', formatInputText(e.target.value))}
                   ></textarea>
                   {errors.address && <span className="text-red-500 text-xs">{errors.address.message}</span>}
                </div>
                <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
                   <input 
                      {...register("city", { required: "Required" })} 
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all" 
                      onChange={(e) => setValue('city', formatInputText(e.target.value))}
                   />
                </div>
                <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-1">State <span className="text-red-500">*</span></label>
                   <input 
                      {...register("state", { required: "Required" })} 
                      className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all" 
                      onChange={(e) => setValue('state', formatInputText(e.target.value))}
                   />
                </div>
            </div>
          </div>

          {/* Section 3: Course & Academic */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
                <BookOpen size={20} className="text-primary"/> Academic Interest
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-1">Select Branch <span className="text-red-500">*</span></label>
                   <select {...register("selectedBranch", { required: "Required" })} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all bg-white">
                        <option value="">-- Select Branch --</option>
                        {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                   </select>
                   {errors.selectedBranch && <span className="text-red-500 text-xs">{errors.selectedBranch.message}</span>}
                </div>
                <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-1">Interested Course <span className="text-red-500">*</span></label>
                   <select {...register("selectedCourse", { required: "Required" })} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all bg-white">
                        <option value="">-- Select Course --</option>
                        {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                   </select>
                    {errors.selectedCourse && <span className="text-red-500 text-xs">{errors.selectedCourse.message}</span>}
                </div>
                
                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-1">Education Qualification</label>
                   <div className="flex gap-2">
                       {!newEduMode ? (
                           <select {...register("education")} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none bg-white">
                                <option value="">-- Select Education --</option>
                                {educations.map(e => <option key={e._id} value={e.name}>{e.name}</option>)}
                           </select>
                       ) : (
                           <input 
                                value={newEduName} 
                                onChange={(e) => setNewEduName(formatInputText(e.target.value))} 
                                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none" 
                                placeholder="Enter Education Name"
                           />
                       )}
                       <button 
                            type="button" 
                            onClick={() => setNewEduMode(!newEduMode)}
                            className={`p-2 rounded-lg transition-colors ${newEduMode ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}
                            title={newEduMode ? "Cancel Add New" : "Add New Education"}
                       >
                           {newEduMode ? <X size={20} /> : <Plus size={20} />}
                       </button>
                   </div>
                </div>

                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-1">Reference <span className="text-red-500">*</span></label>
                   <div className="flex gap-2">
                       {!newRefMode ? (
                           <select {...register("reference", { required: "Required" })} className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none bg-white">
                                <option value="">-- Select Reference --</option>
                                <option value="Direct">Direct / Walk-in</option>
                                {references.map(r => <option key={r._id} value={r.name}>{r.name}</option>)}
                           </select>
                       ) : (
                           <input 
                                value={newRefName} 
                                onChange={(e) => setNewRefName(formatInputText(e.target.value))} 
                                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none" 
                                placeholder="Enter Reference Name"
                           />
                       )}
                        <button 
                            type="button" 
                            onClick={() => setNewRefMode(!newRefMode)}
                            className={`p-2 rounded-lg transition-colors ${newRefMode ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}
                            title={newRefMode ? "Cancel Add New" : "Add New Reference"}
                       >
                           {newRefMode ? <X size={20} /> : <Plus size={20} />}
                       </button>
                   </div>
                    {errors.reference && <span className="text-red-500 text-xs">{errors.reference.message}</span>}
                </div>
            </div>
          </div>

          {/* Section 4: Terms & Actions */}
          <div className="pt-4 border-t">
              <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                     <input type="checkbox" {...register("agreeTerms", { required: true })} className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm transition-all checked:border-primary checked:bg-primary hover:shadow-md" />
                  </div>
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                      I agree to the <Link to="/terms-and-conditions" target="_blank" className="text-primary font-bold hover:underline">Terms and Conditions</Link> for admission at Smart Institute.
                  </span>
              </label>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-accent hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/30 transition-all transform hover:-translate-y-1 mb-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
             {isLoading ? 'Registering...' : 'Register Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnlineAdmission;
