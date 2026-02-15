import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, resetPassword, reset } from '../../features/auth/authSlice';
import { fetchEducations, createEducation } from '../../features/master/masterSlice';
import { X, Camera, User, Lock, Save, RefreshCw, Plus, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const ProfileSettingsModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { user, isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);
    const { educations } = useSelector((state) => state.master);

    const [activeTab, setActiveTab] = useState('profile');
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        mobile: user?.mobile || '',
        email: user?.email || '',
        gender: user?.gender || '',
        education: user?.education || '',
        address: user?.address || '',
        branchName: user?.branchName || 'Main Branch',
        photo: null
    });
    const [previewImage, setPreviewImage] = useState(user?.photo || '');
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    // Password Visibility States
    const [showOldPass, setShowOldPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    // Education Modal States
    const [showEduModal, setShowEduModal] = useState(false);
    const [newEdu, setNewEdu] = useState('');

    const [localMessage, setLocalMessage] = useState('');
    const isSubmitting = React.useRef(false); // Ref to track form submission

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchEducations());
            dispatch(reset()); // Reset auth state on open
            isSubmitting.current = false;
        }
    }, [dispatch, isOpen]);

    useEffect(() => {
        if (isSuccess && isOpen && isSubmitting.current) { // Only toast if we submitted from here
            toast.success(message || 'Operation Successful');
            dispatch(reset());
            onClose();
            isSubmitting.current = false;
        }
    }, [isSuccess, message, isOpen, dispatch, onClose]);

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                mobile: user.mobile || '',
                email: user.email || '',
                gender: user.gender || '',
                education: user.education || '',
                address: user.address || '',
                branchName: user.branchName || 'Main Branch',
                photo: null
            });
            setPreviewImage(user.photo || '');
        }
    }, [user, isOpen]);

    useEffect(() => {
        if (isError && message) {
           setLocalMessage(message);
           const timer = setTimeout(() => setLocalMessage(''), 3000);
           return () => clearTimeout(timer);
        }
    }, [isError, message]);

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileData({ ...profileData, photo: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const submitProfile = (e) => {
        e.preventDefault();
        isSubmitting.current = true; // Mark as submitting
        const formData = new FormData();
        Object.keys(profileData).forEach(key => {
            formData.append(key, profileData[key]);
        });
        dispatch(updateProfile(formData));
    };

    const submitPasswordReset = (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setLocalMessage("New password and confirm password do not match");
            return;
        }
        isSubmitting.current = true; // Mark as submitting
        dispatch(resetPassword({
            oldPassword: passwordData.oldPassword,
            newPassword: passwordData.newPassword
        }));
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    };

    const handleAddEducation = () => {
        if (!newEdu) return toast.error('Education Name required');
        dispatch(createEducation({ name: newEdu })).then((res) => {
            if (!res.error) {
                setProfileData({ ...profileData, education: newEdu });
                setShowEduModal(false);
                toast.success('Education Added!');
                setNewEdu('');
            }
        });
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] relative"
                    >
                        {/* Education Add Modal Overlay */}
                        {showEduModal && (
                            <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                                <motion.div 
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="bg-white p-6 rounded-lg shadow-2xl w-80 border border-gray-100"
                                >
                                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                                        <h4 className="font-bold text-gray-800">Add Education</h4>
                                        <button type="button" onClick={() => setShowEduModal(false)}><X size={18} className="text-gray-500 hover:text-red-500"/></button>
                                    </div>
                                    <div className="space-y-4">
                                        <input 
                                            className="w-full border p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 outline-none" 
                                            placeholder="Degree / Certificate Name *"
                                            value={newEdu}
                                            onChange={e => setNewEdu(e.target.value)}
                                        />
                                        <button 
                                            type="button" 
                                            onClick={handleAddEducation}
                                            className="w-full py-2 bg-primary text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-md"
                                        >
                                            Save Education
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        )}

                        {/* Sidebar */}
                        <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 p-6 flex-shrink-0">
                            <h2 className="text-xl font-bold text-gray-800 mb-8">Settings</h2>
                            <nav className="space-y-2">
                                <button 
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
                                >
                                    <User size={18} />
                                    Update Profile
                                </button>
                                <button 
                                    onClick={() => setActiveTab('password')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'password' ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
                                >
                                    <Lock size={18} />
                                    Reset Password
                                </button>
                            </nav>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-800">
                                    {activeTab === 'profile' ? 'Profile Information' : 'Change Password'}
                                </h3>
                                <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            {localMessage && (
                                <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${isError ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                                    {localMessage}
                                </div>
                            )}

                            {activeTab === 'profile' ? (
                                <form onSubmit={submitProfile} className="space-y-6">
                                    {/* Photo Upload */}
                                    <div className="flex flex-col items-center justify-center mb-8">
                                        <div className="relative group">
                                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
                                                {previewImage ? (
                                                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-4xl font-bold text-gray-300">{user?.name?.charAt(0)}</span>
                                                )}
                                            </div>
                                            <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-blue-600 transition-colors">
                                                <Camera size={18} />
                                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                            </label>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2">Allowed *.jpeg, *.jpg, *.png, *.webp</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                                            <input type="text" name="name" value={profileData.name} onChange={handleProfileChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                                            <input type="email" name="email" value={profileData.email} onChange={handleProfileChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
                                            <input type="text" name="mobile" value={profileData.mobile} onChange={handleProfileChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
                                            <select name="gender" value={profileData.gender} onChange={handleProfileChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none">
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-1">
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Education</label>
                                            <div className="flex gap-2">
                                                <select 
                                                    name="education" 
                                                    value={profileData.education} 
                                                    onChange={handleProfileChange} 
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                                >
                                                    <option value="">Select Education</option>
                                                    {educations && educations.map((edu, idx) => (
                                                        <option key={edu._id || idx} value={edu.name}>{edu.name}</option>
                                                    ))}
                                                </select>
                                                <button 
                                                    type="button" 
                                                    onClick={() => setShowEduModal(true)}
                                                    className="p-2 bg-blue-50 text-primary border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors"
                                                    title="Add new education"
                                                >
                                                    <Plus size={20} />
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Branch (Read Only)</label>
                                            <input type="text" name="branchName" value={profileData.branchName} readOnly className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed outline-none" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Address</label>
                                            <textarea name="address" value={profileData.address} onChange={handleProfileChange} rows="3" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"></textarea>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 mt-8">
                                        <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed font-medium">
                                            {isLoading ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                                            Update Profile
                                        </button>
                                        <button type="button" onClick={onClose} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={submitPasswordReset} className="space-y-6 max-w-lg">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                                        <input type="text" value={user?.username || user?.email} readOnly className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed outline-none" />
                                        <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                                    </div>
                                    <div className="relative">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Old Password</label>
                                        <div className="relative">
                                            <input 
                                                type={showOldPass ? "text" : "password"} 
                                                name="oldPassword" 
                                                value={passwordData.oldPassword} 
                                                onChange={handlePasswordChange} 
                                                required 
                                                className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => setShowOldPass(!showOldPass)} 
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showOldPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
                                        <div className="relative">
                                            <input 
                                                type={showNewPass ? "text" : "password"} 
                                                name="newPassword" 
                                                value={passwordData.newPassword} 
                                                onChange={handlePasswordChange} 
                                                required 
                                                className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => setShowNewPass(!showNewPass)} 
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
                                        <div className="relative">
                                            <input 
                                                type={showConfirmPass ? "text" : "password"} 
                                                name="confirmPassword" 
                                                value={passwordData.confirmPassword} 
                                                onChange={handlePasswordChange} 
                                                required 
                                                className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => setShowConfirmPass(!showConfirmPass)} 
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 mt-8">
                                        <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed font-medium">
                                            {isLoading ? <RefreshCw size={18} className="animate-spin" /> : <Lock size={18} />}
                                            Reset Password
                                        </button>
                                        <button type="button" onClick={onClose} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProfileSettingsModal;
