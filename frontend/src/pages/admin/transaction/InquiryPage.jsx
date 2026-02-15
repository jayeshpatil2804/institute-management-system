import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInquiries, updateInquiry, resetTransaction } from '../../../features/transaction/transactionSlice';
import SmartTable from '../../../components/ui/SmartTable';
import { toast } from 'react-toastify';
import { AlertCircle, CheckCircle, PhoneCall, X } from 'lucide-react';
import { useForm } from 'react-hook-form';

// --- Conversion Modal ---
const ConvertToOnlineModal = ({ inquiry, onClose, onConvert }) => {
    const { register, handleSubmit } = useForm({
        defaultValues: {
            firstName: inquiry.firstName,
            lastName: inquiry.lastName,
            contactStudent: inquiry.contactStudent,
            email: inquiry.email,
            city: inquiry.city,
            state: inquiry.state,
            interestedCourse: inquiry.interestedCourse?._id,
            remarks: inquiry.remarks,
            // New Fields for Online Inquiry
            contactParent: '',
            gender: 'Male',
            dob: '',
            address: ''
        }
    });

    const { courses } = useSelector((state) => state.master); // Need courses for dropdown if needed

    const onSubmit = (data) => {
        onConvert({
            id: inquiry._id,
            data: {
                ...data,
                source: 'Online',
                status: 'Pending' // Or Open
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 animate-fadeIn max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <CheckCircle size={20} className="text-green-600"/> Convert to Online Inquiry
                    </h3>
                    <button onClick={onClose}><X size={20} className="text-gray-500 hover:text-red-500"/></button>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Basic Info (Pre-filled) */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase">First Name</label>
                            <input {...register('firstName', {required: true})} className="w-full border p-2 rounded text-sm bg-gray-50"/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase">Last Name</label>
                            <input {...register('lastName')} className="w-full border p-2 rounded text-sm bg-gray-50"/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase">Student Mobile</label>
                            <input {...register('contactStudent', {required: true})} className="w-full border p-2 rounded text-sm bg-gray-50"/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase">Email</label>
                            <input {...register('email')} className="w-full border p-2 rounded text-sm bg-gray-50"/>
                        </div>
                        
                        {/* New Fields */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase">Parent Mobile</label>
                            <input {...register('contactParent')} className="w-full border p-2 rounded text-sm" placeholder="Optional"/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase">Gender</label>
                            <select {...register('gender')} className="w-full border p-2 rounded text-sm">
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase">City</label>
                            <input {...register('city')} className="w-full border p-2 rounded text-sm"/>
                        </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase">State</label>
                            <input {...register('state')} className="w-full border p-2 rounded text-sm"/>
                        </div>
                    </div>

                    <div>
                         <label className="block text-xs font-bold text-gray-700 uppercase">Address</label>
                         <textarea {...register('address')} rows="2" className="w-full border p-2 rounded text-sm"></textarea>
                    </div>

                    <div>
                         <label className="block text-xs font-bold text-gray-700 uppercase">Description / Remarks</label>
                         <textarea {...register('remarks')} rows="3" className="w-full border p-2 rounded text-sm"></textarea>
                    </div>

                    <div className="flex justify-end pt-4 gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded text-gray-700 hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Convert to Online</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const InquiryPage = () => {
  const dispatch = useDispatch();
  const { inquiries, isSuccess, message } = useSelector((state) => state.transaction);
  
  const [showConvertModal, setShowConvertModal] = useState(null);

  useEffect(() => { 
      // Fetch ONLY 'QuickContact' inquiries
      dispatch(fetchInquiries({ source: 'QuickContact' }));
  }, [dispatch]);

  useEffect(() => {
      if (isSuccess && message) {
          if(message === 'Inquiry adds successfully' || message === 'Inquiry Source Updated' || message === 'Inquiry Updated') {
             // Refresh list
             dispatch(fetchInquiries({ source: 'QuickContact' }));
             setShowConvertModal(null); // Close modal on success
          }
          dispatch(resetTransaction());
      }
  }, [isSuccess, message, dispatch]);

  const handleConvert = ({ id, data }) => {
     dispatch(updateInquiry({ id, data }));
  };

  const columns = [
    { header: 'Serial No', render: (_, index) => index + 1 },
    { header: 'Contact Date', render: (row) => new Date(row.createdAt).toLocaleDateString('en-GB') },
    { header: 'Contact Person', render: (row) => `${row.firstName} ${row.lastName || ''}` }, 
    { header: 'Mobile', accessor: 'contactStudent' },
    { header: 'Email', accessor: 'email' },
    { header: 'State', accessor: 'state' },
    { header: 'City', accessor: 'city' },
    { header: 'Course', render: (row) => row.interestedCourse?.name || 'N/A' },
    { header: 'Contact Detail', render: (row) => row.remarks || '-' },
    { header: 'Online Inquiry', render: (row) => (
        <button 
            onClick={() => setShowConvertModal(row)}
            className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors shadow-sm"
        >
            <CheckCircle size={14} /> Add Now
        </button>
    )},
  ];

  return (
    <div className="container mx-auto p-6">
       <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                <PhoneCall className="text-primary" /> Quick Contact Inquiries
            </h2>
            <div className="text-gray-500 text-sm">
                Manage website inquiries
            </div>
       </div>

       <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-primary">
            {inquiries && inquiries.length > 0 ? (
                <SmartTable columns={columns} data={inquiries} />
            ) : (
                <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                    <AlertCircle size={48} className="text-gray-300 mb-2"/>
                    <p>No Quick Contact inquiries found.</p>
                </div>
            )}
       </div>

       {showConvertModal && (
           <ConvertToOnlineModal 
                inquiry={showConvertModal}
                onClose={() => setShowConvertModal(null)}
                onConvert={handleConvert}
           />
       )}
    </div>
  );
};

export default InquiryPage;