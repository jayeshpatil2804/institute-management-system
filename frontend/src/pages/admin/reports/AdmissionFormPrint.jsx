import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import logo from '../../../assets/logo2.png';
import moment from 'moment';
import { fetchBatches } from '../../../features/master/masterSlice';
import { getBranches } from '../../../features/master/branchSlice';

const AdmissionFormPrint = () => {
    const { id } = useParams();
    const dispatch = useDispatch(); // Added dispatch
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode') || 'FULL'; // FULL, NO_FEES, REGISTRATION
    
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [localPaymentPlan, setLocalPaymentPlan] = useState(null); // Local state for print toggle

    const { user } = useSelector((state) => state.auth); 
    const { batches } = useSelector((state) => state.master); // Get batches from Redux
    const { branches } = useSelector((state) => state.branch); // Get branches from Redux
    
    // ... rest of code
    const canEdit = user && (user.role === 'Super Admin' || user.role === 'Admin');

    const API_URL = `${import.meta.env.VITE_API_URL}/students/`;

    useEffect(() => {
        dispatch(fetchBatches()); // Fetch batches
        dispatch(getBranches()); // Fetch branches
        const fetchStudent = async () => {
             // ... existing fetch logic
            try {
                const { data } = await axios.get(API_URL + id, { withCredentials: true });
                setStudent(data);
                setLocalPaymentPlan(data.paymentPlan || 'Monthly'); // Default to Monthly if not set
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch student", error);
                setLoading(false);
            }
        };
        fetchStudent();
    }, [id, dispatch]);

    if (loading) return <div className="p-10 text-center">Loading form data...</div>;
    if (!student) return <div className="p-10 text-center text-red-500">Student not found</div>;

    // Helper for editable fields
    const Editable = ({ value, className = "", tag: Tag = 'span' }) => (
        <Tag 
            contentEditable={canEdit}
            suppressContentEditableWarning 
            className={`outline-none px-1 border-b border-gray-300 min-w-[50px] inline-block ${canEdit ? 'hover:bg-yellow-50 focus:bg-yellow-50' : ''} ${className}`}
            title={canEdit ? "Click to edit" : ""}
        >
            {value || " "}
        </Tag>
    );

    // Helper for checkbox (Made interactive)
    const CheckBox = ({ label, checked = false, onClick }) => (
        <div 
            className="flex items-center gap-1 mr-4 cursor-pointer print:cursor-default"
            onClick={onClick}
        >
            <div className={`w-4 h-4 border border-gray-800 flex items-center justify-center ${checked ? 'bg-black text-white' : ''}`}>
                {checked && <span className="text-xs">✓</span>}
            </div>
            <span className="text-sm font-semibold">{label}</span>
        </div>
    );

    // --- Derived Data Helper ---
    const getBatchTime = () => {
        if (!student || !batches) return "";
        const batchObj = batches.find(b => b.name === student.batch);
        if (batchObj) return `${batchObj.startTime} TO ${batchObj.endTime}`;
        return student.batch || ""; // Fallback
    };
    
    const getBatchDate = () => {
        if (!student || !batches) return "";
        const batchObj = batches.find(b => b.name === student.batch);
        if (batchObj && batchObj.startDate) return moment(batchObj.startDate).format('DD/MM/YYYY');
        return "";
    };

    const getBranchInfo = () => {
        if (!student || !branches) return {};
        // Match by ID (student.branch) or Name (student.branchName)
        const branchObj = branches.find(b => b._id === student.branch || b.name === student.branchName);
        return branchObj || {};
    };

    const batchTimeDisplay = getBatchTime();
    const batchDateDisplay = getBatchDate();
    const branchInfo = getBranchInfo();

    return (
        <div className="max-w-[210mm] mx-auto bg-white min-h-screen p-0 print:p-0">
            {/* --- Web Only Controls --- */}
            <div className="print:hidden p-4 bg-gray-100 flex justify-between items-center mb-4 border-b">
                 {/* ... existing controls ... */}
                <div className="text-sm text-gray-600">
                    <span className="font-bold">Print Mode:</span> {mode} <br/>
                    <span className="text-xs">Click on any text to edit before printing.</span>
                </div>
                <button 
                    onClick={() => window.print()} 
                    className="bg-primary text-white px-4 py-2 rounded font-bold hover:bg-blue-700"
                >
                    Print Form
                </button>
            </div>

            {/* ================= PAGE 1 ================= */}
            {/* REDUCED PADDING & HEIGHT to avoid blank page overflow */}
            <div className="p-5 h-[290mm] relative text-black leading-tight border border-gray-200 print:border-0 print:shadow-none shadow-lg">
                
                {/* Header */}
                <div className="flex justify-between items-start mb-2 border-b-2 border-black pb-2">
                    <div className="w-1/3">
                        <img src={logo} alt="Logo" className="h-16 object-contain" />
                    </div>
                    <div className="w-2/3 text-right">
                        <h1 className="text-xl font-bold uppercase tracking-wide">
                            <Editable value={branchInfo.name || student.branchName || "JAYESH INSTITUTE BRANCH"} />
                        </h1>
                        <p className="text-xs font-semibold mt-1">
                             <Editable value={branchInfo.address || student.branchLocation || "LUDHIANA"} />
                        </p>
                        <p className="text-xs">
                            Ph. No.: <Editable value={branchInfo.phone || student.branchPhone || "6354116595"} /> &nbsp; 
                            Mo.: +91 <Editable value={branchInfo.mobile || student.branchMobile || "6354116595"} />
                        </p>
                        <p className="text-xs font-bold text-blue-800">
                            <Editable value={branchInfo.website || student.website || "www.smartinstituteonline.com"} />
                        </p>
                    </div>
                </div>

                {/* Title & Photo */}
                <div className="flex justify-between items-start mt-4 mb-4 relative">
                    <div className="w-3/4 pr-4">
                         <div className="bg-black text-white inline-block px-4 py-1 font-bold text-sm mb-2 rounded-sm uppercase tracking-wider">
                            Admission Form
                         </div>
                         <p className="text-[10px] italic font-semibold">(USE CAPITAL LETTERS)</p>
                         
                         <div className="flex items-center mt-4 gap-2">
                            <span className="font-bold text-sm text-nowrap">Enrollment Number:</span>
                            <Editable value={student.enrollmentNo || ""} className="font-mono font-bold w-32"/>
                            <span className="font-bold text-sm text-nowrap ml-4">Registration No. :</span>
                            <Editable value={student.regNo || ""} className="font-mono font-bold w-32"/>
                         </div>
                         <div className="flex items-center mt-2 gap-2">
                            <span className="font-bold text-sm">Reg. Date :</span>
                            <Editable value={student.isRegistered && student.registrationDate ? moment(student.registrationDate).format('DD / MM / YYYY') : ""} className="w-32 text-center"/>
                            <span className="font-bold text-sm ml-4 text-nowrap">Student Aadhar No.</span>
                            <Editable value={student.aadharCard || ""} className="flex-grow"/>
                         </div>
                    </div>

                    <div className="absolute right-0 top-0 w-32 h-40 border-2 border-black flex items-center justify-center bg-gray-50 overflow-hidden">
                        {student.studentPhoto ? (
                             <img 
                                src={student.studentPhoto.startsWith('http') ? student.studentPhoto : `http://localhost:5000/${student.studentPhoto}`} 
                                alt="Student"
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                             />
                        ) : null}
                         <div className={`text-xs text-gray-500 font-bold ${student.studentPhoto ? 'hidden' : 'flex'} flex-col items-center justify-center w-full h-full`}>
                            <span>Fix Photo</span>
                        </div>
                    </div>
                </div>

                <hr className="border-black mb-4"/>

                {/* Student Personal Info */}
                <div className="space-y-3 text-sm">
                    <div className="flex items-end gap-2">
                        <span className="font-bold w-32 flex-shrink-0">Name of Student :</span>
                        <Editable value={`${student.firstName || ''} ${student.middleName || ''} ${student.lastName || ''}`.toUpperCase()} className="flex-grow font-bold"/>
                    </div>

                    <div className="flex items-center gap-6 pl-32">
                        <CheckBox label="Father" checked={student.relationType === 'Father'} />
                        <CheckBox label="Husband Name :" checked={student.relationType === 'Husband'} />
                        <Editable value={student.middleName ? student.middleName.toUpperCase() : ""} className="flex-grow"/>
                    </div>

                    <div className="flex items-end gap-2">
                        <span className="font-bold w-32 flex-shrink-0">Occupation :</span>
                        <div className="flex items-center gap-4">
                             <CheckBox label="Service" checked={student.occupationType === 'Service'} />
                             <CheckBox label="Business" checked={student.occupationType === 'Business'} />
                             <CheckBox label="Student" checked={student.occupationType === 'Student'} />
                             <CheckBox label="Other" checked={!['Service', 'Business', 'Student'].includes(student.occupationType) && !!student.occupationType} />
                        </div>
                        <Editable value={student.occupation || ""} className="flex-grow border-b border-gray-300"/>
                    </div>

                    <div className="flex items-end gap-2">
                        <span className="font-bold w-32 flex-shrink-0">Mother Name:</span>
                        <Editable value={student.motherName ? student.motherName.toUpperCase() : ""} className="flex-grow"/>
                    </div>

                    <div className="flex items-end gap-2">
                        <span className="font-bold w-32 flex-shrink-0">Date of Birth :</span>
                        <Editable value={student.dob ? moment(student.dob).format('DD / MM / YYYY') : ""} className="flex-grow"/>
                    </div>

                    <div className="flex items-start gap-2">
                        <span className="font-bold w-32 flex-shrink-0 pt-1">Correspondence Address :</span>
                        <div className="flex-grow">
                             <Editable value={student.address || ""} className="w-full mb-1 block"/>
                             <div className="flex gap-2 mt-1">
                                <span className="font-bold">City</span>
                                <Editable value={student.city || ""} className="flex-grow"/>
                                <span className="font-bold">State</span>
                                <Editable value={student.state || ""} className="flex-grow"/>
                                <span className="font-bold">Pin Code</span>
                                <Editable value={student.pincode || ""} className="w-24"/>
                             </div>
                        </div>
                    </div>

                    <div className="flex items-end gap-2 mt-2">
                        <span className="font-bold">Tel No. :(Home)</span>
                        <Editable value="" className="w-32"/>
                        <span className="font-bold ml-2">Mo.: (Stud)</span>
                        <Editable value={student.mobileStudent || ""} className="flex-grow"/>
                        <span className="font-bold ml-2">Mo.: (Gurd.)</span>
                        <Editable value={student.mobileParent || ""} className="flex-grow"/>
                    </div>
                </div>

                <hr className="border-black my-4"/>

                {/* Course & Fees Section */}
                <div className="text-sm">
                    <div className="flex items-center gap-6 mb-2">
                             <span className="font-bold">Select Fees method:</span>
                             {/* Interactive Checkboxes for Print Adjustment */}
                             <CheckBox label="(A) One Time" checked={localPaymentPlan === 'One Time'} onClick={() => setLocalPaymentPlan('One Time')} />
                             <CheckBox label="(B) Monthly" checked={localPaymentPlan === 'Monthly'} onClick={() => setLocalPaymentPlan('Monthly')} />
                        </div>

                        <table className="w-full border border-black border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-black font-bold bg-gray-100 print:bg-transparent">
                                    <th className="border-r border-black p-2 w-1/3 text-left">Name of Course</th>
                                    <th className="border-r border-black p-2 text-center" colSpan="2">Fees Payment</th>
                                </tr>
                                <tr className="border-b border-black font-bold">
                                    <th className="border-r border-black p-2"></th>
                                    <th className="border-r border-black p-1 w-1/3 text-center">Monthly Fees</th>
                                    <th className="p-1 w-1/3 text-center">Registration Fees</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="h-24 align-top">
                                    <td className="border-r border-black p-2 font-bold text-sm">
                                        <Editable value={student.course?.name || ""} />
                                    </td>
                                    <td className="border-r border-black p-2 relative">
                                        <div className="absolute bottom-2 left-2 flex gap-1 w-full pr-4">
                                           <span className="font-bold">Amt.</span>
                                            {/* Logic: If Monthly, show EMI amount (Student EMI > Course Default > Blank) */}
                                           <Editable 
                                                value={
                                                    localPaymentPlan === 'Monthly' 
                                                        ? (student.emiDetails?.monthlyInstallment || student.course?.monthlyFees || "")
                                                        : ""
                                                } 
                                                className="w-[60px]"
                                            />
                                           <span className="font-bold text-[10px] ml-1">*(Into)</span>
                                           <span className="font-bold ml-1">Time</span>
                                           <Editable 
                                                value={
                                                    localPaymentPlan === 'Monthly'
                                                        ? (student.emiDetails?.months || student.course?.totalInstallment || "")
                                                        : ""
                                                }
                                                className="w-10"
                                            />
                                        </div>
                                    </td>
                                    <td className="p-0">
                                         <table className="w-full h-full">
                                            <tbody>
                                                <tr className="border-b border-black h-6">
                                                    <td className="border-r border-black w-1/2 text-center font-bold bg-gray-50 print:bg-white">Date</td>
                                                    <td className="text-center font-bold bg-gray-50 print:bg-white">Amt.</td>
                                                </tr>
                                                <tr className="h-full">
                                                    <td className="border-r border-black text-center p-2 align-top">
                                                        <Editable value={mode !== 'NO_FEES' && student.isRegistered && student.registrationDate ? moment(student.registrationDate).format('DD/MM/YY') : ""} />
                                                    </td>
                                                    <td className="text-center p-2 align-top">
                                                        {/* Show ONLY if Monthly payment plan is selected. Shows PAID amount. */}
                                                        <Editable 
                                                            value={
                                                                localPaymentPlan === 'Monthly' && mode !== 'NO_FEES'
                                                                    ? (student.isRegistered ? (student.emiDetails?.registrationFees || student.course?.registrationFees) : "") 
                                                                    : "" 
                                                            } 
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                         </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <div className="grid grid-cols-2 gap-4 mt-2">
                             <div className="flex items-end gap-1">
                                <span className="font-bold text-nowrap">Batch Date:</span>
                                <Editable value={batchDateDisplay} className="w-32 text-center"/>
                             </div>
                             <div className="flex items-end gap-1">
                                <span className="font-bold text-nowrap">Batch Time:</span>
                                <Editable value={batchTimeDisplay} className="flex-grow text-center"/>
                             </div>
                              <div className="flex items-end gap-1 col-span-2">
                                <span className="font-bold text-nowrap">Course Fees: ₹</span>
                                {/* Fixed: Use totalFees */}
                                <Editable value={student.totalFees || ""} className="w-48 font-bold"/>
                             </div>
                        </div>

                    </div>


                <div className="mt-6 space-y-4 text-sm">
                     <div className="flex items-end gap-2">
                        <span className="font-bold w-48 text-nowrap">Executive/Reference Name:</span>
                        <Editable value={student.reference || ""} className="flex-grow"/>
                     </div>
                     <div className="flex items-end gap-2">
                        <span className="font-bold w-48 text-nowrap">Reference Address :</span>
                        <Editable value="" className="flex-grow"/>
                     </div>
                     <div className="flex items-end gap-2">
                        <span className="font-bold w-16">Mr./Mrs./Miss.</span>
                        <Editable value="" className="flex-grow"/>
                     </div>

                     <p className="text-xs text-justify mt-2 leading-relaxed">
                        Hereby state the above statement is correct up to my knowledge and I will be responsible for any disciplinarian action, I accept the terms and condition of <span className="font-bold">Smart Institute®.</span>
                     </p>
                </div>


                {/* Signatures Footer */}
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                    <div className="text-center w-40 border-t border-black pt-1 font-bold text-sm">
                        Guardian Signature
                    </div>
                    <div className="text-center w-40 border-t border-black pt-1 font-bold text-sm">
                        Student Signature
                    </div>
                </div>

            </div>

             {/* ================= PAGE 2: Rules ================= */}
            <div className="p-5 h-[290mm] bg-white relative text-black leading-relaxed border border-gray-200 print:border-0 print:shadow-none shadow-lg mt-8 print:mt-0 break-before-page">
                 
                 <div className="flex justify-center mb-8">
                     <div className="bg-black text-white px-8 py-2 font-bold text-lg rounded-sm uppercase tracking-wider shadow-sm">
                        RULES & REGULATIONS
                     </div>
                 </div>

                 <div className="space-y-4 text-sm text-justify px-4">
                    <ul className="list-none space-y-3">
                        {/* Custom Bullet Logic to match image diamonds if needed, using standard unicode for now */}
                        <li className="flex gap-3">
                            <span className="font-bold text-lg">❖</span>
                            <span contentEditable suppressContentEditableWarning>I-Card, Tie should be required daily at the time of entry.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-bold text-lg">❖</span>
                            <span contentEditable suppressContentEditableWarning>Student must be attend at all the class and maintain attendance above 80%.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-bold text-lg">❖</span>
                            <span contentEditable suppressContentEditableWarning>It is must that student have conduct theory, Practical and other Exam by <span className="font-bold">Smart Institute®.</span></span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-bold text-lg">❖</span>
                            <span contentEditable suppressContentEditableWarning>In the case of any absence/leave, submit a leave application with sign of faculty as well authorized person of the Institute.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-bold text-lg">❖</span>
                            <span contentEditable suppressContentEditableWarning>If student have completed the above attendance then student shall be eligible to sit for semesters Exams, project and as well as final exam.</span>
                        </li>
                         <li className="flex gap-3">
                            <span className="font-bold text-lg">❖</span>
                            <span contentEditable suppressContentEditableWarning>Guardians/Parents shall be get every month student performance.</span>
                        </li>
                         <li className="flex gap-3">
                            <span className="font-bold text-lg">❖</span>
                            <span contentEditable suppressContentEditableWarning>Student batch time will be change only one or two time in any genuine circumstances.</span>
                        </li>
                         <li className="flex gap-3">
                            <span className="font-bold text-lg">❖</span>
                            <span contentEditable suppressContentEditableWarning>Student admission will be cancel in case of inconvenience; <span className="font-bold">Smart Intitute®</span> Will not hesitate to confect you or parent/ guardian.</span>
                        </li>
                         <li className="flex gap-3">
                            <span className="font-bold text-lg">❖</span>
                            <span contentEditable suppressContentEditableWarning>When any problem created by the student or me be violated student shall restricted from the course and no further claim can be done by the student.</span>
                        </li>
                         <li className="flex gap-3">
                            <span className="font-bold text-lg">❖</span>
                            <span contentEditable suppressContentEditableWarning>No further claim has refund of payments can be done by the student, in case of down gradation of the course.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-bold text-lg">❖</span>
                            <span contentEditable suppressContentEditableWarning>Student has to maintain discipline with us faculty and in the institute as well as with institute authorities.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="font-bold text-lg">❖</span>
                            <span contentEditable suppressContentEditableWarning>Any <span className="underline font-bold">Fees will be not refundable</span> pay by the student/guardian.</span>
                        </li>
                         <li className="flex gap-3">
                            <span className="font-bold text-lg">❖</span>
                            <span contentEditable suppressContentEditableWarning>Student has to follow the above rules of institute without fail.</span>
                        </li>
                         <li className="flex gap-3">
                            <span className="font-bold text-lg">❖</span>
                            <span contentEditable suppressContentEditableWarning><span className="font-bold">1) ID Proof</span> (Aadhar Card, Pan-card, Election Card, Driving License, if any) <span className="font-bold">2) Address Proof</span> (Electricity Bill, Bera bill, Telephone Bill, Gas Bill, if any) <span className="font-bold">3) Certificate</span> (last Qualification) submitted with admission form <span className="font-bold">mandatory</span>.</span>
                        </li>
                    </ul>
                 </div>

                 {/* Signatures Footer Page 2 */}
                <div className="absolute bottom-16 right-8 text-right">
                    <div className="text-center w-48 border-t border-black pt-1 font-bold text-sm mb-12">
                         (Student Signature)
                    </div>
                </div>

                <div className="absolute bottom-8 left-8 text-xs font-semibold">
                    <p>Smart Intitute® Will have competed to the best of institute and will try & Fulfill the</p>
                    <p>needs in fascinating manner.</p>
                </div>
                
                 <div className="absolute bottom-8 right-8 text-right">
                    <div className="text-center w-48 border-t border-black pt-1 font-bold text-sm">
                         Authorized Signature
                    </div>
                </div>
            </div>

            <style type="text/css" media="print">
                {`
                    @page { size: A4; margin: 0; }
                    body { -webkit-print-color-adjust: exact; }
                `}
            </style>
        </div>
    );
};

export default AdmissionFormPrint;
