import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBranch, getBranches, updateBranch, deleteBranch, getBranchEmployees, reset } from '../../../features/master/branchSlice';
import { toast } from 'react-toastify';
import { Edit, Trash2, Plus, Search, X, Eye, EyeOff } from 'lucide-react';

const BranchMaster = () => {
    const dispatch = useDispatch();
    const { branches, branchEmployees, isLoading, isError, message } = useSelector((state) => state.branch);
    const { user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: '',
        shortCode: '',
        phone: '',
        mobile: '',
        email: '',
        address: '',
        city: '',
        state: '',
        isActive: true,
        branchDirector: '',
        directorUsername: '',
        directorPassword: ''
    });

    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDirectorPassword, setShowDirectorPassword] = useState(false);

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        dispatch(getBranches());
        return () => {
            dispatch(reset());
        };
    }, [isError, message, dispatch]);

    // Fetch employees when modal is open (for both create and edit)
    useEffect(() => {
        if (isModalOpen) {
            dispatch(getBranchEmployees());
        }
    }, [isModalOpen, dispatch]);

    const { name, shortCode, phone, mobile, email, address, city, state: branchState, isActive, 
            branchDirector, directorUsername, directorPassword } = formData;

    const onChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await dispatch(updateBranch({ id: editId, branchData: formData })).unwrap();
                toast.success('Branch Updated Successfully');
            } else {
                await dispatch(createBranch(formData)).unwrap();
                toast.success('Branch Created Successfully');
            }
            closeModal();
            // dispatch(getBranches()); // Removed to rely on Redux state update and avoid race conditions
        } catch (error) {
            toast.error(error || 'Something went wrong');
        }
    };

    const handleEdit = (branch) => {
        setIsEditMode(true);
        setEditId(branch._id);
        setFormData({
            name: branch.name,
            shortCode: branch.shortCode,
            phone: branch.phone || '',
            mobile: branch.mobile || '',
            email: branch.email || '',
            address: branch.address || '',
            city: branch.city || '',
            state: branch.state || '',
            isActive: branch.isActive,
            branchDirector: branch.branchDirector || '',
            directorUsername: branch.directorUsername || '',
            directorPassword: branch.directorPassword || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this branch?')) {
            try {
                await dispatch(deleteBranch(id)).unwrap();
                toast.success('Branch Deleted Successfully');
            } catch (error) {
                toast.error(error || 'Delete failed');
            }
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditId(null);
        setShowDirectorPassword(false);
        setFormData({
            name: '',
            shortCode: '',
            phone: '',
            mobile: '',
            email: '',
            address: '',
            city: '',
            state: '',
            isActive: true,
            branchDirector: '',
            directorUsername: '',
            directorPassword: ''
        });
    };



    const filteredBranches = Array.isArray(branches) ? branches.filter(branch => 
        branch && (
            (branch.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (branch.shortCode || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
    ) : [];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Branch Management</h1>
                    <p className="text-gray-500 text-sm">Manage institute branches</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm"
                >
                    <Plus size={20} />
                    Add New Branch
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6 relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search by Branch Name or Code..."
                    className="pl-10 w-full md:w-1/3 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="p-4 font-semibold text-gray-600 text-sm">Branch Name</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Code</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Contact</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Location</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm text-center">Status</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredBranches.length > 0 ? (
                                filteredBranches.map((branch, index) => (
                                    <tr key={branch._id || index} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-sm font-medium text-gray-900">{branch.name}</td>
                                        <td className="p-4 text-sm text-gray-600 font-mono bg-gray-50 rounded px-2 py-1 w-min whitespace-nowrap">{branch.shortCode}</td>
                                        <td className="p-4 text-sm text-gray-600">
                                            <div className="flex flex-col">
                                                <span>{branch.mobile}</span>
                                                <span className="text-xs text-gray-400">{branch.email}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {branch.city}, {branch.state}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${branch.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {branch.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => handleEdit(branch)} 
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(branch._id)} 
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">
                                        No branches found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto anim-scale-in">
                        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center z-10">
                            <h2 className="text-xl font-bold text-gray-800">
                                {isEditMode ? 'Edit Branch' : 'Add New Branch'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">Branch Name <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={name} 
                                        onChange={onChange} 
                                        required 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="e.g. Godadara Branch"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">Short Code <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" 
                                        name="shortCode" 
                                        value={shortCode} 
                                        onChange={onChange} 
                                        required 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all uppercase"
                                        placeholder="e.g. GOD"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">Email ID <span className="text-red-500">*</span></label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={email} 
                                        onChange={onChange} 
                                        required 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="branch@example.com"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">Mobile Number <span className="text-red-500">*</span></label>
                                    <input 
                                        type="tel" 
                                        name="mobile" 
                                        value={mobile} 
                                        onChange={onChange} 
                                        required 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="e.g. 9876543210"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        name="phone" 
                                        value={phone} 
                                        onChange={onChange} 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="Optional landline"
                                    />
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-sm font-semibold text-gray-700">Address <span className="text-red-500">*</span></label>
                                    <textarea 
                                        name="address" 
                                        value={address} 
                                        onChange={onChange} 
                                        required 
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="Full address of the branch"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">City <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" 
                                        name="city" 
                                        value={city} 
                                        onChange={onChange} 
                                        required 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="e.g. Surat"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">State <span className="text-red-500">*</span></label>
                                    <input 
                                        type="text" 
                                        name="state" 
                                        value={branchState} 
                                        onChange={onChange} 
                                        required 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="e.g. Gujarat"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input 
                                    type="checkbox" 
                                    name="isActive" 
                                    id="isActive"
                                    checked={isActive} 
                                    onChange={onChange} 
                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                />
                                <label htmlFor="isActive" className="text-sm text-gray-700">Branch is Active</label>
                            </div>

                            {/* Branch Director Section */}
                            <div className="md:col-span-2 mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h3 className="text-sm font-bold text-blue-800 mb-4 uppercase">Assign Branch Director</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-700">Select Employee</label>
                                        <select
                                            name="branchDirector"
                                            value={branchDirector}
                                            onChange={onChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        >
                                            <option value="">-- No Director --</option>
                                            {Array.isArray(branchEmployees) && branchEmployees.map(emp => (
                                                <option key={emp._id} value={emp._id}>
                                                    {emp.name} ({emp.type})
                                                </option>
                                            ))}
                                        </select>                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-700">Director Username</label>
                                        <input
                                            type="text"
                                            name="directorUsername"
                                            value={directorUsername}
                                            onChange={onChange}
                                            disabled={!branchDirector}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:bg-gray-100"
                                            placeholder="Enter username"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-700">Director Password</label>
                                        <div className="relative">
                                            <input
                                                type={showDirectorPassword ? "text" : "password"}
                                                name="directorPassword"
                                                value={directorPassword}
                                                onChange={onChange}
                                                disabled={!branchDirector}
                                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:bg-gray-100"
                                                placeholder="Enter password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowDirectorPassword(!showDirectorPassword)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                disabled={!branchDirector}
                                            >
                                                {showDirectorPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {branchDirector && (
                                    <p className="text-xs text-blue-600 mt-2">
                                        ℹ️ Assigning a director will update their login credentials to the ones specified above.
                                    </p>
                                )}
                            </div>

                            <div className="pt-4 flex gap-3 justify-end border-t border-gray-100 mt-4">
                                <button 
                                    type="button" 
                                    onClick={closeModal} 
                                    className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-5 py-2.5 text-sm font-medium text-white bg-primary hover:bg-blue-700 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Saving...' : (isEditMode ? 'Update Branch' : 'Create Branch')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BranchMaster;
