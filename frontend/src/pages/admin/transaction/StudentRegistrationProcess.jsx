import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentById, confirmRegistration, resetStatus } from '../../../features/student/studentSlice';
import { toast } from 'react-toastify';
import { ArrowLeft, Save, X, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { generateCredentials } from '../../../utils/credentialGenerator';

const StudentRegistrationProcess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentStudent: student, isLoading } = useSelector((state) => state.students);
  const { isSuccess, message } = useSelector((state) => state.students); // reusing student slice

  const [step, setStep] = useState(1); // Always start with Step 1 (Credentials)
  const [showPassword, setShowPassword] = useState(false); // For password visibility toggle
  
  // Registration Form Data
  const [regData, setRegData] = useState({
    regNo: 'Loading...', // Will be fetched from API
    username: '',
    password: '',
    isActive: true
  });

  // Fee Form Data
  const [feeData, setFeeData] = useState({
    receiptNo: 'Loading...',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    paymentMode: 'Cash',
    remarks: '',
    // Dynamic Fields
    bankName: '',
    chequeNumber: '',
    chequeDate: '',
    transactionId: '',
    transactionDate: ''
  });

  useEffect(() => {
    dispatch(fetchStudentById(id));
    return () => dispatch(resetStatus());
  }, [id, dispatch]);

  useEffect(() => {
    if (isSuccess && message === "Student Registration Completed") {
      toast.success(message);
      setTimeout(() => navigate('/master/student'), 1500); // Go to Master List
    } else if (isSuccess === false && message) {
        toast.error(message);
    }
  }, [isSuccess, message, navigate]);


  // Initial Logic - Always start at Step 1 (Credentials) for all students
  useEffect(() => {
      if (student) {
          // Auto-Generate Credentials if empty (only once when student loads)
          setRegData(prev => {
              const needsCredentials = !prev.username && !prev.password;
              if (needsCredentials) {
                  const { username, password } = generateCredentials(student.firstName, student.lastName);
                  return { ...prev, username, password };
              }
              return prev;
          });

          // Fetch Preview Registration Number
          const fetchPreviewRegNo = async () => {
              try {
                  const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/students/preview-regno`, {
                      params: { branchId: student.branchId },
                      withCredentials: true
                  });
                  setRegData(prev => ({ ...prev, regNo: data.regNo || 'Error' }));
              } catch (error) {
                  console.error("Failed to fetch preview regNo", error);
                  setRegData(prev => ({ ...prev, regNo: "Error" }));
              }
          };
          fetchPreviewRegNo();

          // Auto-fill fee amount
          if (student.course) {
              // Always prefer Registration Fees if defined (User requested "pre decided registration fees")
              if (student.course.registrationFees && student.course.registrationFees > 0) {
                  setFeeData(prev => ({ ...prev, amount: student.course.registrationFees }));
              } else if (student.paymentPlan === 'One Time') {
                   // Fallback for One Time if no reg fee defined: Total Fees
                   setFeeData(prev => ({ ...prev, amount: student.course.fees || student.course.courseFees }));
              }
          }
      }
  }, [student]); // Only depend on student, not regData

   useEffect(() => {
        // Fetch Receipt No when entering Fee Step (Step 2)
        if (step === 2 && student) {
            const fetchReceiptNo = async () => {
                try {
                    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/transaction/fees/next-no`, {
                        withCredentials: true
                    });
                    setFeeData(prev => ({ ...prev, receiptNo: data }));
                } catch (error) {
                    console.error("Failed to fetch next receipt no", error);
                    setFeeData(prev => ({ ...prev, receiptNo: "Error" }));
                }
            };
            fetchReceiptNo();
        }
   }, [step, student]);

  const handleContinueFromCredentials = () => {
      // Validate credentials before continuing to fees
      if(!regData.username || !regData.password) {
          toast.error("Username and Password are required");
          return;
      }
      // Go to Step 2 (Fees) for ALL plans now
      setStep(2); 
  };

  const handleBackFromFees = () => {
      setStep(1); // Go back to Credentials
  };

  const handleFinalSubmit = (e) => {
    if(e) e.preventDefault();
    if(!regData.username || !regData.password) {
        toast.error("Username and Password are required");
        return;
    }

    // Validate Fees for both plans
    if (!feeData.amount || Number(feeData.amount) <= 0) {
        toast.error("Please enter a valid amount for fees");
        return;
    }

    const payload = {
        id: student._id,
        data: {
            ...regData,
            feeDetails: { ...feeData, amount: Number(feeData.amount) || 0 }
        }
    };
    
    // Check loading state to prevent double submission
    if (isLoading) return;
    
    dispatch(confirmRegistration(payload));
  };

  if (!student || isLoading) return <div className="p-6 text-center">Loading Data...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center text-gray-600 hover:text-gray-900">
        <ArrowLeft size={16} className="mr-1" /> Back
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 text-white px-6 py-4">
          <h2 className="text-xl font-bold">Student Registration Process</h2>
        </div>

        {/* SECTION 1: Student Details (Read Only) - Always Visible */}
        <div className="p-6 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Student Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div><span className="text-gray-500 block">Student Name</span> <span className="font-medium">{student.firstName} {student.lastName}</span></div>
            <div><span className="text-gray-500 block">Father Name</span> <span className="font-medium">{student.middleName}</span></div>
            <div><span className="text-gray-500 block">Admission Date</span> <span className="font-medium">{new Date(student.admissionDate).toLocaleDateString()}</span></div>
            <div><span className="text-gray-500 block">Mobile</span> <span className="font-medium">{student.mobileStudent || student.mobileParent}</span></div>
            <div><span className="text-gray-500 block">Email</span> <span className="font-medium">{student.email || '-'}</span></div>
            <div><span className="text-gray-500 block">Date of Birth</span> <span className="font-medium">{new Date(student.dob).toLocaleDateString()}</span></div>
            <div className="col-span-1 md:col-span-3 mt-2">
                <span className="text-gray-500 block mb-1">Student Photo</span>
                {student.studentPhoto ? (
                    <img 
                        src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/${student.studentPhoto.replace(/\\/g, '/')}`} 
                        alt="Student" 
                        className="h-24 w-24 object-cover rounded border"
                    />
                ) : (
                    <span className="text-gray-400 italic">No Photo Available</span>
                )}
            </div>
          </div>
        </div>

        {/* SECTION 2: Registration Details (Credentials) - Show Only on Step 1 */}
        {step === 1 && (
            <div className="p-6 animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Step 1: Create Credentials
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Registration No</label>
                    <input 
                        type="text" 
                        disabled
                        value={regData.regNo}
                        className="w-full bg-gray-100 border rounded px-3 py-2 text-gray-700 cursor-not-allowed"
                    />
                </div>
                <div className="flex items-center mt-6">
                    <input 
                        type="checkbox" 
                        checked={regData.isActive}
                        onChange={(e) => setRegData({...regData, isActive: e.target.checked})}
                        className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">Is Active</label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username <span className="text-red-500">*</span></label>
                    <input 
                        type="text" 
                        required
                        value={regData.username}
                        onChange={(e) => setRegData({...regData, username: e.target.value})}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <input 
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={regData.password}
                            onChange={(e) => setRegData({...regData, password: e.target.value})}
                            className="w-full border rounded px-3 py-2 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="mt-6 flex gap-4">
                <button onClick={handleContinueFromCredentials} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
                    Continue
                </button>
                <button onClick={() => navigate(-1)} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">
                    Cancel
                </button>
            </div>
            </div>
        )}

        {/* SECTION 3: Fees Details - Show Only on Step 2 */}
         {step === 2 && (
           <div className="p-6 border-t animate-fade-in">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Step 2: Fee Payment</h3>
              <div className="bg-orange-50 border border-orange-200 p-3 mb-4 rounded text-sm text-orange-800">
                <strong>Note:</strong> {student.paymentPlan === 'Monthly' ? 'Registration fees payment is required.' : 'Please pay the remaining course fees.'}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Receipt No</label>
                     <input type="text" disabled value={feeData.receiptNo} className="w-full bg-gray-100 border rounded px-3 py-2" />
                 </div>
                 <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                     <input 
                         type="date" 
                         value={feeData.date} 
                         onChange={(e) => setFeeData({...feeData, date: e.target.value})}
                         className="w-full border rounded px-3 py-2" 
                     />
                 </div>
                 <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                     <input type="text" disabled value={student.course?.name} className="w-full bg-gray-100 border rounded px-3 py-2" />
                 </div>
                 <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                     <input 
                         type="number" 
                         value={feeData.amount} 
                         onChange={(e) => setFeeData({...feeData, amount: e.target.value})}
                         placeholder="0.00"
                         className="w-full border rounded px-3 py-2" 
                     />
                 </div>
                 <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
                     <select 
                         value={feeData.paymentMode} 
                         onChange={(e) => setFeeData({...feeData, paymentMode: e.target.value})}
                         className="w-full border rounded px-3 py-2"
                     >
                         <option value="Cash">Cash</option>
                         <option value="Cheque">Cheque</option>
                         <option value="Online/UPI">Online/UPI</option>
                     </select>
                 </div>

                 {/* Dynamic Payment Fields */}
                 {feeData.paymentMode === 'Cheque' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name *</label>
                            <input 
                                type="text"
                                value={feeData.bankName}
                                onChange={(e) => setFeeData({...feeData, bankName: e.target.value})}
                                className="w-full border rounded px-3 py-2"
                                placeholder="Bank Name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cheque Number *</label>
                            <input 
                                type="text"
                                value={feeData.chequeNumber}
                                onChange={(e) => setFeeData({...feeData, chequeNumber: e.target.value})}
                                className="w-full border rounded px-3 py-2"
                                placeholder="Cheque No"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cheque Date *</label>
                            <input 
                                type="date"
                                value={feeData.chequeDate}
                                onChange={(e) => setFeeData({...feeData, chequeDate: e.target.value})}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                    </>
                 )}

                 {feeData.paymentMode === 'Online/UPI' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name *</label>
                            <input 
                                type="text"
                                value={feeData.bankName}
                                onChange={(e) => setFeeData({...feeData, bankName: e.target.value})}
                                className="w-full border rounded px-3 py-2"
                                placeholder="Bank / Wallet Name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID *</label>
                            <input 
                                type="text"
                                value={feeData.transactionId}
                                onChange={(e) => setFeeData({...feeData, transactionId: e.target.value})}
                                className="w-full border rounded px-3 py-2"
                                placeholder="Txn ID / Ref No"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Date *</label>
                            <input 
                                type="date"
                                value={feeData.transactionDate}
                                onChange={(e) => setFeeData({...feeData, transactionDate: e.target.value})}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                    </>
                 )}
                 <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Remark</label>
                     <textarea 
                         value={feeData.remarks} 
                         onChange={(e) => setFeeData({...feeData, remarks: e.target.value})}
                         className="w-full border rounded px-3 py-2"
                         rows="1"
                     ></textarea>
                 </div>
              </div>

              <div className="mt-8 flex gap-4">
                 <button 
                    onClick={handleFinalSubmit} 
                    disabled={isLoading}
                    className={`bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 flex items-center gap-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                 >
                     <Save size={18} /> {isLoading ? 'Processing...' : 'Register'}
                 </button>
                 <button onClick={handleBackFromFees} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">
                     Back
                 </button>
              </div>
           </div>
         )}
      </div>
    </div>
  );
};

export default StudentRegistrationProcess;