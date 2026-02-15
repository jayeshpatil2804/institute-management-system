import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentById } from '../../../features/student/studentSlice';
import { useReactToPrint } from 'react-to-print';
import { Printer, ArrowLeft, Mail, Phone, MapPin, Calendar, Book, User, CreditCard } from 'lucide-react';
import moment from 'moment';

const StudentProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const componentRef = useRef();
    
    const { currentStudent: student, isLoading } = useSelector((state) => state.students);

    useEffect(() => {
        dispatch(fetchStudentById(id));
    }, [dispatch, id]);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Student_Profile_${student?.enrollmentNo || 'View'}`,
    });

    if (isLoading || !student) {
        return <div className="p-8 text-center text-gray-500">Loading student details...</div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            {/* Header Actions */}
            <div className="flex justify-between items-center mb-6 no-print">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
                    <ArrowLeft size={20} /> Back to List
                </button>
                <button onClick={handlePrint} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition-colors">
                    <Printer size={20} /> Print Profile
                </button>
            </div>

            {/* Printable Area */}
            <div ref={componentRef} className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 p-8 max-w-4xl mx-auto print:shadow-none print:border-none print:w-full">
                
                {/* Header / ID Card Style Top */}
                <div className="flex flex-col md:flex-row gap-6 border-b border-gray-100 pb-8 mb-8">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-100 rounded-lg overflow-hidden border-4 border-white shadow flex-shrink-0 mx-auto md:mx-0">
                        {student.studentPhoto ? (
                            <img src={`${import.meta.env.VITE_API_URL}/${student.studentPhoto}`} alt="Student" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <User size={48} />
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-1">{student.firstName} {student.middleName} {student.lastName}</h1>
                                <p className="text-lg text-primary font-medium mb-4">{student.course?.name}</p>
                            </div>
                            <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 text-center">
                                <span className="block text-xs text-blue-500 uppercase font-semibold">Enrollment No</span>
                                <span className="text-xl font-bold text-blue-800 font-mono">{student.enrollmentNo}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Phone size={16} className="text-accent" />
                                <span>{student.mobileStudent}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Mail size={16} className="text-accent" />
                                <span>{student.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Calendar size={16} className="text-accent" />
                                <span>DOB: {moment(student.dob).format('DD MMM YYYY')}</span>
                            </div>
                             <div className="flex items-center gap-2 text-gray-600">
                                <MapPin size={16} className="text-accent" />
                                <span className="truncate max-w-[200px]">{student.city}, {student.state}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Academic Details */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                            <Book size={20} className="text-primary"/> Academic Information
                        </h2>
                        <div className="grid grid-cols-2 gap-y-4 text-sm">
                            <div>
                                <span className="block text-gray-500 text-xs">Course Name</span>
                                <span className="font-medium text-gray-800">{student.course?.name}</span>
                            </div>
                             <div>
                                <span className="block text-gray-500 text-xs">Batch Time</span>
                                <span className="font-medium text-gray-800">{student.batch}</span>
                            </div>
                             <div>
                                <span className="block text-gray-500 text-xs">Admission Date</span>
                                <span className="font-medium text-gray-800">{moment(student.admissionDate).format('DD MMM YYYY')}</span>
                            </div>
                             <div>
                                <span className="block text-gray-500 text-xs">Registration No</span>
                                <span className="font-medium text-gray-800">{student.regNo || 'Not Registered'}</span>
                            </div>
                             <div>
                                <span className="block text-gray-500 text-xs">Registration Date</span>
                                <span className="font-medium text-gray-800">{student.registrationDate ? moment(student.registrationDate).format('DD MMM YYYY') : '-'}</span>
                            </div>
                             <div>
                                <span className="block text-gray-500 text-xs">Status</span>
                                <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${student.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {student.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Personal & Family */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                            <User size={20} className="text-primary"/> Personal & Family
                        </h2>
                         <div className="grid grid-cols-2 gap-y-4 text-sm">
                            <div>
                                <span className="block text-gray-500 text-xs">Father/Husband</span>
                                <span className="font-medium text-gray-800">{student.firstName} (Self) / {student.middleName} ({student.relationType})</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 text-xs">Mother Name</span>
                                <span className="font-medium text-gray-800">{student.motherName || 'N/A'}</span>
                            </div>
                             <div>
                                <span className="block text-gray-500 text-xs">Gender</span>
                                <span className="font-medium text-gray-800">{student.gender}</span>
                            </div>
                             <div>
                                <span className="block text-gray-500 text-xs">Aadhar Card</span>
                                <span className="font-medium text-gray-800">{student.aadharCard}</span>
                            </div>
                             <div>
                                <span className="block text-gray-500 text-xs">Parent Mobile</span>
                                <span className="font-medium text-gray-800">{student.mobileParent}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 text-xs">Address</span>
                                <span className="font-medium text-gray-800">{student.address}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 text-xs">Reference By</span>
                                <span className="font-medium text-gray-800">{student.reference || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                 {/* Fees Summary */}
                 <div className="mt-8">
                        <h2 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                            <CreditCard size={20} className="text-primary"/> Fees Summary
                        </h2>
                        {/* Dynamic Calculation for Display */}
                        {(() => {
                            const courseAdmFee = student.course?.admissionFees || 0;
                            const paidAdmFee = student.admissionFeeAmount || 0;
                            // Effective Admission Fee (Paid or Course Default, whichever is higher, or just Course Default if we follow standard)
                            // User Logic: "total fees = course fees + dynamic admission fees"
                            const effectiveAdmFee = Math.max(courseAdmFee, paidAdmFee);
                            
                            const calculatedTotalFees = (student.totalFees || 0) + effectiveAdmFee;
                            
                            const pendingAdmission = Math.max(0, courseAdmFee - paidAdmFee);
                            const calculatedPendingFees = (student.pendingFees || 0) + pendingAdmission;

                            return (
                                <div className="grid grid-cols-3 gap-4 mt-4 bg-gray-50 p-4 rounded-lg">
                                    <div>
                                        <span className="block text-gray-500 text-xs">Total Fees</span>
                                        <span className="font-bold text-gray-800 text-lg">₹{calculatedTotalFees}</span>
                                        <span className="block text-[10px] text-gray-400">
                                            (Include Adm: ₹{effectiveAdmFee})
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500 text-xs">Pending Fees</span>
                                        <span className="font-bold text-red-600 text-lg">₹{calculatedPendingFees}</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500 text-xs">Payment Plan</span>
                                        <span className="font-medium text-gray-800">{student.paymentPlan || 'One Time'}</span>
                                    </div>
                                </div>
                            );
                        })()}
                 </div>

                 {/* Footer for Print */}
                 <div className="hidden print:block mt-16 pt-8 border-t border-gray-300">
                    <div className="flex justify-between text-sm text-gray-600">
                        <div>
                            <p>Printed on: {moment().format('DD MMM YYYY HH:mm')}</p>
                            <p>Authorized Signature</p>
                        </div>
                        <div className="text-right">
                            <p>Smart Institute</p>
                            <p>www.smartinstitute.com</p>
                        </div>
                    </div>
                 </div>

            </div>
        </div>
    );
};

export default StudentProfile;
