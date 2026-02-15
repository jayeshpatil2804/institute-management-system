import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { fetchInquiries, createInquiry, updateInquiry, resetTransaction } from '../../../features/transaction/transactionSlice';
import { fetchCourses } from '../../../features/master/masterSlice';
import SmartTable from '../../../components/ui/SmartTable';
import InquiryForm from '../../../components/transaction/InquiryForm'; // Imported reusable form
import { 
    Plus, Search, RotateCcw, X, PhoneCall, User, Edit, Trash2, Eye, Calendar
} from 'lucide-react';
import { toast } from 'react-toastify';
import { formatDate } from '../../../utils/dateUtils';

// Follow Up Modal (Specific to Action Button)
const FollowUpModal = ({ inquiry, onClose, onSave }) => {
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
        // Construct full Date objects
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
                <div className="flex justify-between mb-4 border-b pb-2"><h3 className="font-bold text-blue-800">Follow Up Update</h3><button onClick={onClose}><X/></button></div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    
                    {/* Inquiry Status */}
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

const InquiryOffline = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { inquiries, isSuccess, message } = useSelector((state) => state.transaction);
  
  // Filter defaults to Walk-in for Offline page
  const [filters, setFilters] = useState({ startDate: '', endDate: new Date().toISOString().split('T')[0], status: '', studentName: '', source: 'Walk-in' });
  const [modal, setModal] = useState({ type: null, data: null }); // type: 'form', 'followup', 'view'

  useEffect(() => { dispatch(fetchInquiries(filters)); dispatch(fetchCourses()); }, [dispatch, filters]);
  
  // Check for conversion data from Visitors page
  useEffect(() => {
    if (location.state?.visitorData) {
        setModal({ type: 'form', data: { ...location.state.visitorData, isConversion: true } });
        window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => { 
      if (isSuccess && message) { 
          toast.success(message); 
          dispatch(resetTransaction()); 
          setModal({type:null});
          // fetchInquiries removed to prevent resetting list filters/showing all data
          // Redux state is already updated via create/update thunks
      } 
  }, [isSuccess, message, dispatch]);

  const handleSave = (data) => {
      // Data is now FormData if coming from InquiryForm, or object from FollowUpModal
      // If FormData, we pass it directly. Backend handles multipart.
      if(data instanceof FormData) {
          // Check for ID in FormData to decide create or update
          const id = data.get('_id');
          if(id) dispatch(updateInquiry({ id, data }));
          else dispatch(createInquiry(data));
      } else {
          // Normal JSON update (FollowUpModal)
          if(data._id) dispatch(updateInquiry({ id: data._id, data })); // Wrong structure in handleSave? 
          // Wait, FollowUpModal passes {id, data} wrapper to onSave, InquiryForm passes Payload or FormData.
          // Let's normalize inside the components or here.
          // InquiryForm calls onSave(formData). FollowUp call logic is below.
      }
  };
  
  // Wrapper for InquiryForm save
  const handleFormSave = (payload) => {
       if (payload instanceof FormData) {
           const id = payload.get('_id');
            if(id && id !== 'undefined') dispatch(updateInquiry({ id, data: payload }));
            else dispatch(createInquiry(payload));
       } else {
           // Fallback/Legacy
           if(payload._id) dispatch(updateInquiry({ id: payload._id, data: payload }));
           else dispatch(createInquiry(payload));
       }
  };


  const handleDelete = (id) => {
      if(window.confirm('Delete this inquiry?')) dispatch(updateInquiry({ id, data: { isDeleted: true } })).then(() => dispatch(fetchInquiries(filters)));
  };

  const columns = [
      { header: 'Sr', render: (_, i) => i + 1 },
      { header: 'Date', render: r => formatDate(r.inquiryDate) },
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
      { header: 'Action', render: r => (
          <div className="flex gap-2">
            <button onClick={() => setModal({type:'followup', data:r})} className="bg-purple-50 text-purple-600 border border-purple-200 p-1.5 rounded hover:bg-purple-100" title="Follow Up">
                <PhoneCall size={14}/>
            </button>
            <button onClick={() => setModal({type:'form', data:r})} className="bg-blue-50 text-blue-600 border border-blue-200 p-1.5 rounded hover:bg-blue-100" title="Edit">
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
        <div className="flex justify-between mb-4 items-center">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><User className="text-blue-600"/> Offline Inquiries</h2>
            <button onClick={() => setModal({type:'form'})} className="bg-blue-600 text-white px-4 py-2 rounded shadow flex items-center gap-2 hover:bg-blue-700 font-bold transition-all transform hover:scale-105">
                <Plus size={18}/> Add Offline Inquiry
            </button>
        </div>
        
        {/* Filter Bar */}
        <div className="bg-white p-3 rounded border shadow-sm flex gap-3 mb-4 flex-wrap">
             <input type="date" value={filters.startDate} onChange={e => setFilters({...filters, startDate: e.target.value})} className="border p-2 rounded text-sm"/>
             <input type="date" value={filters.endDate} onChange={e => setFilters({...filters, endDate: e.target.value})} className="border p-2 rounded text-sm"/>
             <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} className="border p-2 rounded text-sm min-w-[120px]">
                <option value="">All Status</option>
                <option value="Open">Open</option>
                <option value="InProgress">InProgress</option>
                <option value="Recall">Recall</option>
                <option value="Close">Close</option>
                <option value="Complete">Complete</option>
             </select>
             <input placeholder="Search Name..." value={filters.studentName} onChange={e => setFilters({...filters, studentName: e.target.value})} className="border p-2 rounded text-sm flex-grow min-w-[200px]"/>
             <button onClick={() => dispatch(fetchInquiries(filters))} className="bg-gray-800 text-white px-4 rounded hover:bg-black"><Search size={18}/></button>
        </div>

        <SmartTable 
            columns={columns} 
            data={inquiries} 
        />

        {/* Reusable Form Modal */}
        {modal.type === 'form' && (
            <InquiryForm 
                mode="Offline" 
                initialData={modal.data} 
                onClose={() => setModal({type:null})} 
                onSave={handleFormSave}
            />
        )}

        {/* Follow Up Modal */}
        {modal.type === 'followup' && <FollowUpModal inquiry={modal.data} onClose={() => setModal({type:null})} onSave={({id, data}) => dispatch(updateInquiry({id, data}))}/>}
    </div>
  );
};

export default InquiryOffline;