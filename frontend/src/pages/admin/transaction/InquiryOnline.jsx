import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInquiries, updateInquiry, resetTransaction } from '../../../features/transaction/transactionSlice';
import { fetchCourses } from '../../../features/master/masterSlice';
import InquiryForm from '../../../components/transaction/InquiryForm';
import SmartTable from '../../../components/ui/SmartTable';
import { Search, RotateCcw, PhoneCall, Globe, X, Edit, Trash2, Eye, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

// --- SUB-COMPONENT: Follow Up Form ---
import { formatDate } from '../../../utils/dateUtils';

// ... (imports remain)

// --- SUB-COMPONENT: Follow Up Form ---
const FollowUpForm = ({ inquiry, onClose, onSave }) => {
    const navigate = useNavigate();
    
    // Get current time in HH:MM format for default
    const getCurrentTime = () => {
        const now = new Date();
        return now.toTimeString().slice(0, 5); // Returns HH:MM
    };

    const [selectedStatus, setSelectedStatus] = useState(inquiry.status || 'Open');
    
    const { register, handleSubmit, watch } = useForm({ 
        defaultValues: { 
            status: inquiry.status || 'Open', 
            followUpDetails: inquiry.followUpDetails,
            fDate: inquiry.followUpDate ? new Date(inquiry.followUpDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            fTime: inquiry.followUpDate ? new Date(inquiry.followUpDate).toTimeString().slice(0, 5) : getCurrentTime(),
        } 
    });

    // Watch status field for conditional rendering
    const statusValue = watch('status');
    useEffect(() => {
        setSelectedStatus(statusValue);
    }, [statusValue]);

    const onSubmit = async (data) => {
        let fDate = null;
        if(data.fDate) {
             const time = data.fTime || '00:00';
             fDate = new Date(`${data.fDate}T${time}`);
        }

        let vDate = null;
        if(data.vDate && selectedStatus !== 'Close' && selectedStatus !== 'Complete') {
            const time = data.vTime || '00:00';
            vDate = new Date(`${data.vDate}T${time}`);
        }

        const updateData = { 
            status: data.status,
            followUpDetails: data.followUpDetails,
            followUpDate: fDate, 
            nextVisitingDate: vDate,
            visitReason: (selectedStatus !== 'Close' && selectedStatus !== 'Complete') ? data.visitReason : undefined,
        };

        // Save the inquiry update first
        await onSave({ id: inquiry._id, data: updateData });
        
        // If status is Complete, navigate to Student Admission with inquiry data
        if(data.status === 'Complete') {
            setTimeout(() => {
                navigate('/master/student/new', { 
                    state: { 
                        inquiryData: inquiry 
                    } 
                });
            }, 500); // Small delay to ensure the save completes
        } else {
            onClose();
        }
    };

    const showNextVisit = selectedStatus !== 'Close' && selectedStatus !== 'Complete';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl animate-fadeIn">
                <div className="flex justify-between mb-4 border-b pb-2"><h3 className="font-bold text-blue-800">Online Follow Up</h3><button onClick={onClose}><X/></button></div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                     <div>
                        <label className="text-xs font-bold block mb-1">Inquiry Status</label>
                        <select {...register('status')} className="border p-2 rounded w-full text-sm">
                            <option value="Open">Open</option>
                            <option value="InProgress">InProgress</option>
                            <option value="Recall">Recall</option>
                            <option value="Close">Close</option>
                            <option value="Complete">Complete</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="text-xs font-bold block mb-1">Follow-Up Date (dd-mm-yyyy)</label><input type="date" {...register('fDate')} required className="border p-2 rounded w-full text-sm"/></div>
                        <div><label className="text-xs font-bold block mb-1">Time (12h)</label><input type="time" {...register('fTime')} required className="border p-2 rounded w-full text-sm"/></div>
                    </div>
                    <div><label className="text-xs font-bold block mb-1">Discussion / Remarks</label><textarea {...register('followUpDetails')} className="border p-2 rounded w-full text-sm" rows="3"></textarea></div>
                    
                    {/* Conditional Next Visit Schedule */}
                    {showNextVisit && (
                        <div className="bg-gray-50 p-3 rounded mt-2 border border-gray-100">
                            <p className="font-bold text-xs mb-2 text-purple-700 flex items-center gap-1"><Calendar size={12}/> Next Visit Schedule</p>
                            <div className="grid grid-cols-2 gap-3 mb-2">
                                 <input type="date" {...register('vDate')} className="border p-2 rounded w-full text-sm" defaultValue={new Date().toISOString().split('T')[0]}/>
                                 <input type="time" {...register('vTime')} className="border p-2 rounded w-full text-sm" defaultValue={getCurrentTime()}/>
                            </div>
                            <input {...register('visitReason')} placeholder="Reason for visit..." className="border p-2 rounded w-full text-sm"/>
                        </div>
                    )}
                    <button className="bg-blue-600 text-white w-full py-2 rounded mt-2 hover:bg-blue-700 font-bold shadow-sm">Update Status</button>
                </form>
            </div>
        </div>
    );
};

const InquiryOnline = () => {
  const dispatch = useDispatch();
  const { inquiries, isSuccess, message } = useSelector((state) => state.transaction);
  
  const [showFollowUpModal, setShowFollowUpModal] = useState(null);
  const [editModalData, setEditModalData] = useState(null);
  
  // Filter State
  const [filters, setFilters] = useState({
      startDate: '',
      endDate: new Date().toISOString().split('T')[0],
      status: '',
      studentName: '',
      dateFilterType: 'inquiryDate',
      source: 'Online' // Locked to Online
  });

  useEffect(() => {
    dispatch(fetchInquiries(filters));
    dispatch(fetchCourses()); // Required for InquiryForm dropdowns
  }, [dispatch, filters]);

  useEffect(() => {
      if (isSuccess && message && (showFollowUpModal || editModalData)) {
          toast.success(message); // "Inquiry Updated" or "Follow-up Updated"
          dispatch(resetTransaction());
          setShowFollowUpModal(null);
          setEditModalData(null);
          // fetchInquiries removed to prevent list reset
      }
  }, [isSuccess, message, dispatch, showFollowUpModal, editModalData]);

  const handleFilterChange = (e) => {
      setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleResetFilters = () => {
      setFilters({ 
          startDate: new Date().toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0], status: '', studentName: '', 
          dateFilterType: 'inquiryDate', source: 'Online' 
      });
  };

  const handleSaveFollowUp = ({ id, data }) => {
      dispatch(updateInquiry({ id, data }));
  };

  const handleSaveInquiry = (data) => {
      // Check for FormData/File upload support if InquiryForm uses it now
      if(data instanceof FormData) {
           const id = data.get('_id');
           if(id) dispatch(updateInquiry({ id, data }));
      } else {
           if (data._id) dispatch(updateInquiry({ id: data._id, data }));
      }
  };

  const handleDelete = (id) => {
      if(window.confirm("Are you sure you want to delete this inquiry?")) {
          dispatch(updateInquiry({ id, data: { isDeleted: true } })).then(() => dispatch(fetchInquiries(filters)));
      }
  };

  // --- Table Columns ---
  const columns = [
      { header: 'Sr', render: (_, idx) => idx + 1 },
      { header: 'Date', render: (row) => formatDate(row.inquiryDate) },
      { header: 'Student Name', render: r => <span className="font-bold text-gray-700">{r.firstName} {r.lastName || ''}</span> },
      { header: 'Contact (Home)', render: r => r.contactHome || '-' },
      { header: 'Contact (Student)', render: r => r.contactStudent || '-' },
      { header: 'Contact (Parent)', render: r => r.contactParent || '-' },
      { header: 'Gender', accessor: 'gender' },
      { header: 'Status', render: r => <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${r.status==='Open'?'bg-green-100 text-green-700': r.status==='Recall' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>{r.status}</span> },
      { header: 'Follow Up', render: r => (
          <div className="text-xs">
              <div className="font-bold">{r.followUpDate ? formatDate(r.followUpDate) : '-'}</div>
              <div className="text-gray-500 truncate max-w-[100px]">{r.followUpDetails}</div>
          </div>
      )},
      { header: 'Allocated To', render: r => r.allocatedTo?.name || 'Unallocated' },
      { header: 'Action', render: r => (
          <div className="flex gap-2">
            <button onClick={() => setShowFollowUpModal(r)} className="bg-purple-50 text-purple-600 border border-purple-200 p-1.5 rounded hover:bg-purple-100" title="Follow Up">
                <PhoneCall size={14}/>
            </button>
            <button onClick={() => setEditModalData(r)} className="bg-blue-50 text-blue-600 border border-blue-200 p-1.5 rounded hover:bg-blue-100" title="Edit">
                <Edit size={14}/>
            </button>
            <button onClick={() => handleDelete(r._id)} className="bg-red-50 text-red-600 border border-red-200 p-1.5 rounded hover:bg-red-100" title="Delete">
                <Trash2 size={14}/>
            </button>
          </div>
      )},
  ];

  return (
    <div className="container mx-auto p-4 max-w-full animate-fadeIn">
      
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <div className="bg-blue-100 p-2 rounded-lg"><Globe className="text-blue-600" size={24} /></div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Online Inquiries</h2>
            <p className="text-xs text-gray-500">Manage inquiries received from Website or Social Media</p>
          </div>
      </div>

      {/* --- FILTER SECTION --- */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <div className="col-span-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Inquiry Type</label>
                <select name="dateFilterType" onChange={handleFilterChange} value={filters.dateFilterType} className="w-full border p-2 rounded text-sm focus:ring-2 ring-blue-100 outline-none">
                    <option value="inquiryDate">Inquiry Date</option>
                    <option value="followUpDate">Follow-up Date</option>
                    <option value="createdAt">Allocation Date</option>
                </select>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Start Date</label>
                <input type="date" name="startDate" onChange={handleFilterChange} value={filters.startDate} className="w-full border p-2 rounded text-sm focus:ring-2 ring-blue-100 outline-none"/>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase">End Date</label>
                <input type="date" name="endDate" onChange={handleFilterChange} value={filters.endDate} className="w-full border p-2 rounded text-sm focus:ring-2 ring-blue-100 outline-none"/>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
                <select name="status" onChange={handleFilterChange} value={filters.status} className="w-full border p-2 rounded text-sm focus:ring-2 ring-blue-100 outline-none">
                    <option value="">All Status</option>
                    <option value="Open">Open</option>
                    <option value="InProgress">InProgress</option>
                    <option value="Recall">Recall</option>
                    <option value="Close">Close</option>
                    <option value="Complete">Complete</option>
                </select>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Search Student</label>
                <input type="text" name="studentName" onChange={handleFilterChange} value={filters.studentName} placeholder="Name..." className="w-full border p-2 rounded text-sm focus:ring-2 ring-blue-100 outline-none"/>
            </div>
            <div className="flex gap-2">
                <button onClick={() => dispatch(fetchInquiries(filters))} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition flex items-center gap-2">
                    <Search size={16}/> Search
                </button>
                <button onClick={handleResetFilters} className="bg-gray-100 text-gray-600 px-3 py-2 rounded hover:bg-gray-200 transition" title="Reset Filters">
                    <RotateCcw size={18}/>
                </button>
            </div>
        </div>
      </div>

      {/* --- TABLE --- */}
      <SmartTable 
        columns={columns}
        data={inquiries}
        // Removed onEdit and onDelete to prevent duplicate actions
      />

      {/* Follow Up Modal */}
      {showFollowUpModal && (
        <FollowUpForm 
            inquiry={showFollowUpModal} 
            onClose={() => setShowFollowUpModal(null)}
            onSave={handleSaveFollowUp}
        />
      )}

      {/* Edit Inquiry Mdoal */}
      {editModalData && (
        <InquiryForm
            mode="Online"
            initialData={editModalData}
            onClose={() => setEditModalData(null)}
            onSave={handleSaveInquiry}
        />
      )}
    </div>
  );
};

export default InquiryOnline;