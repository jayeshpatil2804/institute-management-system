import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInquiries, updateInquiry } from '../../features/transaction/transactionSlice';
import { fetchExamRequests, fetchCourses } from '../../features/master/masterSlice';
import EmployeeDashboard from './EmployeeDashboard';
import { useUserRights } from '../../hooks/useUserRights';
import { useNavigate } from 'react-router-dom';
import { Search, RefreshCw, ExternalLink, Clock, AlertCircle, CheckCircle, UserPlus } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux Data
  const { inquiries } = useSelector((state) => state.transaction);
  const { pendingExams, courses } = useSelector((state) => state.master);
  const { user } = useSelector((state) => state.auth);

  // Local State
  const [activeTab, setActiveTab] = useState('inquiry'); // 'inquiry', 'online-admission', 'exam'
  
  // Exam Filters
  const [examFilters, setExamFilters] = useState({
    courseId: '',
    minPendingDays: ''
  });

  // Initial Fetch
  useEffect(() => {
    // Fetching ONLY "QuickContact" for dashboard as per requirements
    dispatch(fetchInquiries({ source: 'QuickContact' }));
    dispatch(fetchExamRequests()); // Changed from fetchPendingExams
    dispatch(fetchCourses());
  }, [dispatch]);

  const handleExamFilter = () => {
    dispatch(fetchExamRequests(examFilters)); // Changed from fetchPendingExams
  };

  const handleResetExamFilter = () => {
    setExamFilters({ courseId: '', minPendingDays: '' });
    dispatch(fetchExamRequests()); // Changed from fetchPendingExams
  };

  const handleAddToOnline = (inquiry) => {
    if (confirm(`Transfer inquiry for ${inquiry.firstName} to Online list?`)) {
        dispatch(updateInquiry({ 
            id: inquiry._id, 
            data: { source: 'Online' } 
        })).then((res) => {
            if (!res.error) {
                toast.success("Inquiry transferred to Online list");
                dispatch(fetchInquiries({ source: 'QuickContact' })); // Refresh list with correct filter
            }
        });
    }
  };

  
  // Check User Rights
  const { view: hasDashboardAccess } = useUserRights('Admin Home');
  const { view: canViewInquiryList } = useUserRights('Admin Home - Inquiry List');
  const { view: canViewOnlineAdmissions } = useUserRights('Admin Home - Online Admissions');
  const { view: canViewExamList } = useUserRights('Admin Home - Exam Pending List');

  // Conditionally Render Fallback
  // If user is logged in, NOT a Super Admin, and does NOT have 'Admin Home' view rights
  if (user && user.type !== 'Super Admin' && user.role !== 'Super Admin' && !hasDashboardAccess) {
      return <EmployeeDashboard />;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl animate-fadeIn">
      
      {/* --- Dashboard Header --- */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-500 mt-2">Daily Overview & Tasks</p>
      </div>

      {/* --- Tab Navigation --- */}
      <div className="flex justify-center mb-8">
        <div className="bg-white p-1 rounded-full shadow-md inline-flex border">
          {(canViewInquiryList || (user && user.role === 'Super Admin')) && (
          <button 
            onClick={() => setActiveTab('inquiry')}
            className={`px-8 py-2 rounded-full font-medium transition-all ${
              activeTab === 'inquiry' 
              ? 'bg-primary text-white shadow-sm' 
              : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Inquiry List
          </button>
          )}

          {(canViewOnlineAdmissions || (user && user.role === 'Super Admin')) && (
          <button 
            onClick={() => {
                setActiveTab('online-admission');
                dispatch(fetchInquiries({ source: 'OnlineAdmission' }));
            }}
            className={`px-8 py-2 rounded-full font-medium transition-all ${
              activeTab === 'online-admission' 
              ? 'bg-primary text-white shadow-sm' 
              : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Online Admissions
          </button>
          )}
          
          {(canViewExamList || (user && user.role === 'Super Admin')) && (
          <button 
            onClick={() => setActiveTab('exam')}
            className={`px-8 py-2 rounded-full font-medium transition-all ${
              activeTab === 'exam' 
              ? 'bg-primary text-white shadow-sm' 
              : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Student Exam Pending List
          </button>
          )}
        </div>
      </div>

      {/* --- CONTENT: INQUIRY LIST --- */}
      {activeTab === 'inquiry' && (canViewInquiryList || (user && user.role === 'Super Admin')) && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden animate-fadeIn">
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <AlertCircle size={20} className="text-blue-500"/> Recent Quick Contact Inquiries
                </h3>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        Total: {inquiries?.length || 0}
                    </span>
                    <button onClick={() => dispatch(fetchInquiries({ source: 'QuickContact' }))} className="p-1 hover:bg-gray-200 rounded-full transition-colors" title="Refresh">
                        <RefreshCw size={16} className="text-gray-500"/>
                    </button>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Serial No</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Contact Date</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Contact Person</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Mobile</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">State</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">City</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Branch</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Course</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Contact Detail</th>
                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Online Inquiry</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {inquiries && inquiries.length > 0 ? inquiries.map((inq, index) => (
                            <tr key={inq._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString('en-GB') : '-'}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-blue-900">
                                    {inq.firstName} {inq.lastName}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{inq.contactStudent}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{inq.email || '-'}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{inq.state || '-'}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{inq.city || '-'}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 font-semibold">{inq.branchId?.name || '-'}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {inq.interestedCourse?.name || 'General'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">
                                    {inq.remarks || '-'}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button 
                                        onClick={() => handleAddToOnline(inq)}
                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1 mx-auto shadow-sm transition-all"
                                        title="Add to Online Inquiry"
                                    >
                                        <CheckCircle size={12}/> Add Now
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="10" className="text-center py-10 text-gray-500 flex flex-col items-center justify-center w-full">
                                <AlertCircle size={32} className="mb-2 opacity-50"/>
                                No Quick Contact inquiries found.
                            </td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {/* --- CONTENT: ONLINE ADMISSION LIST --- */}
      {activeTab === 'online-admission' && (canViewOnlineAdmissions || (user && user.role === 'Super Admin')) && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden animate-fadeIn">
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <UserPlus size={20} className="text-green-600"/> Online Admission Inquiries
                </h3>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold bg-green-100 text-green-800 px-3 py-1 rounded-full">
                        Total: {inquiries?.length || 0}
                    </span>
                    <button onClick={() => dispatch(fetchInquiries({ source: 'OnlineAdmission' }))} className="p-1 hover:bg-gray-200 rounded-full transition-colors" title="Refresh">
                        <RefreshCw size={16} className="text-gray-500"/>
                    </button>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Applied Date</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Student Name</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Mobile</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">City</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Course</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Branch</th>
                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {inquiries && inquiries.length > 0 ? inquiries.map((inq) => (
                            <tr key={inq._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString('en-GB') : '-'}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-blue-900">
                                    {inq.firstName} {inq.lastName}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{inq.contactStudent}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{inq.city || '-'}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 font-semibold">
                                    {inq.interestedCourse?.name || 'General'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {inq.branchId?.name || 'All'}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button 
                                        onClick={() => navigate('/master/student/new', { state: { inquiryData: inq } })}
                                        className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-md text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 mx-auto"
                                    >
                                        <CheckCircle size={14}/> Complete Admission
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="7" className="text-center py-10 text-gray-500 flex flex-col items-center justify-center w-full">
                                <AlertCircle size={32} className="mb-2 opacity-50"/>
                                No Online Admission inquiries found.
                            </td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {/* --- CONTENT: EXAM PENDING LIST (Unchanged Logic) --- */}
      {activeTab === 'exam' && (canViewExamList || (user && user.role === 'Super Admin')) && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden animate-fadeIn">
            {/* ... Exam Filters ... */}
            <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="flex flex-wrap gap-4 items-end justify-between">
                    <div>
                         <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-2">
                            <Clock size={20} className="text-orange-500"/> Exam Pending List
                        </h3>
                        <p className="text-xs text-gray-500">Students who haven't taken exam after request.</p>
                    </div>
                    
                    <div className="flex gap-2 items-center">
                        <select 
                            className="border rounded px-3 py-2 text-sm focus:ring-primary outline-none"
                            value={examFilters.courseId}
                            onChange={(e) => setExamFilters({...examFilters, courseId: e.target.value})}
                        >
                            <option value="">-- All Courses --</option>
                            {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>

                        <input 
                            type="number" 
                            placeholder="Min Pending Days" 
                            className="border rounded px-3 py-2 text-sm w-40 outline-none"
                            value={examFilters.minPendingDays}
                            onChange={(e) => setExamFilters({...examFilters, minPendingDays: e.target.value})}
                        />

                        <button onClick={handleResetExamFilter} className="bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300">
                            <RefreshCw size={18}/>
                        </button>
                        <button onClick={handleExamFilter} className="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-blue-700 flex items-center gap-1">
                            <Search size={16}/> Filter
                        </button>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-center w-10"><input type="checkbox" className="rounded"/></th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Sr No.</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Admission Date</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Reg Number</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Student Name</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Course</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Contact</th>
                            <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Pending Days</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase w-48">Reason</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {pendingExams && pendingExams.length > 0 ? pendingExams.map((exam, index) => (
                            <tr key={exam._id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-center"><input type="checkbox"/></td>
                                <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                    {exam.student?.admissionDate ? new Date(exam.student.admissionDate).toLocaleDateString('en-GB') : '-'}
                                </td>
                                <td className="px-4 py-3 text-sm font-mono text-gray-800">{exam.student?.regNo}</td>
                                <td className="px-4 py-3 text-sm font-semibold text-gray-800">{exam.student?.firstName} {exam.student?.lastName}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{exam.student?.course?.name}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{exam.student?.mobileStudent}</td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        exam.pendingDays > 30 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {exam.pendingDays} Days
                                    </span>
                                </td>
                                <td className="px-4 py-3"><input type="text" placeholder="Reason..." className="border rounded px-2 py-1 text-xs w-full"/></td>
                            </tr>
                        )) : (
                            <tr><td colSpan="9" className="text-center py-10 text-gray-500">No pending exams.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminHome;