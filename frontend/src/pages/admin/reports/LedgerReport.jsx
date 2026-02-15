import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents } from '../../../features/student/studentSlice';
import { fetchLedger, resetTransaction } from '../../../features/transaction/transactionSlice';
import { Search, Printer, FileText, X } from 'lucide-react';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useReactToPrint } from 'react-to-print';

const LedgerReport = () => {
    const dispatch = useDispatch();
    const { students } = useSelector((state) => state.students);
    const { ledgerData, isLoading, message } = useSelector((state) => state.transaction);
    
    // Filters
    const [searchType, setSearchType] = useState('student'); // 'student' or 'regNo'
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [regNoInput, setRegNoInput] = useState('');
    const [searchName, setSearchName] = useState('');

    const componentRef = useRef();

    // useReactToPrint hook usage
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Statement of Account - ${ledgerData?.student?.firstName || 'Student'}`,
        onAfterPrint: () => toast.success("Printed Successfully")
    });

    // Fetch registered students on mount
    useEffect(() => {
        dispatch(fetchStudents({ isRegistered: 'true', pageSize: 1000 }));
    }, [dispatch]);

    // Cleanup on unmount
    useEffect(() => {
        return () => { dispatch(resetTransaction()); };
    }, [dispatch]);

    // Handle Search
    const handleShowReport = () => {
        if (searchType === 'student' && !selectedStudentId) {
            toast.error('Please select a student');
            return;
        }
        if (searchType === 'regNo' && !regNoInput) {
            toast.error('Please enter registration number');
            return;
        }

        const query = searchType === 'student' ? { studentId: selectedStudentId } : { regNo: regNoInput };
        dispatch(fetchLedger(query));
    };

    const resetFilter = () => {
        setSelectedStudentId('');
        setRegNoInput('');
        setSearchName('');
        dispatch(resetTransaction());
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FileText className="text-primary"/> Statement of Account (Ledger)
            </h1>

            {/* --- Filter Section --- */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    
                    {/* Search Type Selector */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Search By</label>
                        <select 
                            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-primary outline-none bg-gray-50"
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                        >
                            <option value="student">Student Name</option>
                            <option value="regNo">Registration No</option>
                        </select>
                    </div>

                    {/* Input Field Based on Type */}
                    <div className="md:col-span-6">
                        {searchType === 'student' ? (
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-2">Select Student</label>
                                <input 
                                    list="studentList" 
                                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="Type to search student..."
                                    value={searchName}
                                    onChange={(e) => {
                                        setSearchName(e.target.value);
                                        const found = students.find(s => `${s.firstName} ${s.lastName} (${s.regNo})` === e.target.value);
                                        if(found) setSelectedStudentId(found._id);
                                        else setSelectedStudentId('');
                                    }}
                                />
                                <datalist id="studentList">
                                    {students.map(s => (
                                        <option key={s._id} value={`${s.firstName} ${s.lastName} (${s.regNo})`} />
                                    ))}
                                </datalist>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-2">Registration Number</label>
                                <input 
                                    type="text" 
                                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="Enter Reg No (e.g. 2026-1001)"
                                    value={regNoInput}
                                    onChange={(e) => setRegNoInput(e.target.value)}
                                />
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-4 flex gap-2">
                        <button 
                            onClick={handleShowReport} 
                            disabled={isLoading}
                            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-700 font-bold shadow transition flex items-center gap-2 w-full justify-center"
                        >
                           {isLoading ? 'Loading...' : <><Search size={18}/> Show Report</>}
                        </button>
                        <button 
                            onClick={resetFilter} 
                            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-200 border border-gray-300 font-medium transition"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {/* --- Report Display Section --- */}
            {ledgerData && (
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                    {/* Toolbar */}
                    <div className="bg-gray-50 p-3 border-b border-gray-200 flex justify-end">
                        <button onClick={handlePrint} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition font-medium">
                            <Printer size={18}/> Print Statement
                        </button>
                    </div>

                    {/* Printable Area */}
                    <div ref={componentRef} className="p-10 print:p-0 bg-white min-h-[800px]">
                        <div className="max-w-4xl mx-auto">
                            
                            {/* Header */}
                            <div className="text-center mb-8 border-b-2 border-primary pb-4">
                                <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wider">Statement of Account</h1>
                                <p className="text-gray-500 text-sm mt-1">Smart Institute Management System</p>
                            </div>

                            {/* Section 1: Student & Course Details */}
                            <div className="grid grid-cols-2 gap-8 mb-8">
                                {/* Column 1: Personal Details */}
                                <div>
                                    <h3 className="text-primary font-bold border-b border-gray-200 mb-3 pb-1 uppercase text-sm">Student Details</h3>
                                    <table className="w-full text-sm">
                                        <tbody>
                                            <tr className="border-b border-dashed border-gray-100"><td className="py-1 font-semibold text-gray-600 w-1/3">Reg. No:</td><td className="py-1 font-bold">{ledgerData.student.regNo}</td></tr>
                                            <tr className="border-b border-dashed border-gray-100"><td className="py-1 font-semibold text-gray-600">Name:</td><td className="py-1">{ledgerData.student.firstName} {ledgerData.student.lastName}</td></tr>
                                            <tr className="border-b border-dashed border-gray-100"><td className="py-1 font-semibold text-gray-600">DOB:</td><td className="py-1">{moment(ledgerData.student.dob).format('DD-MM-YYYY')}</td></tr>
                                            <tr className="border-b border-dashed border-gray-100"><td className="py-1 font-semibold text-gray-600">Reference:</td><td className="py-1">{ledgerData.student.reference}</td></tr>
                                            <tr className="border-b border-dashed border-gray-100"><td className="py-1 font-semibold text-gray-600">Address:</td><td className="py-1">{ledgerData.student.city}, {ledgerData.student.state}</td></tr>
                                            <tr className="border-b border-dashed border-gray-100"><td className="py-1 font-semibold text-gray-600">Contact (Home):</td><td className="py-1">{ledgerData.student.contactHome || '-'}</td></tr>
                                            <tr className="border-b border-dashed border-gray-100"><td className="py-1 font-semibold text-gray-600">Contact (Student):</td><td className="py-1">{ledgerData.student.mobileStudent}</td></tr>
                                            <tr><td className="py-1 font-semibold text-gray-600">Contact (Parent):</td><td className="py-1">{ledgerData.student.mobileParent}</td></tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Column 2: Course Details */}
                                <div>
                                    <h3 className="text-primary font-bold border-b border-gray-200 mb-3 pb-1 uppercase text-sm">Course & Fees Details</h3>
                                    <table className="w-full text-sm">
                                        <tbody>
                                            <tr className="border-b border-dashed border-gray-100"><td className="py-1 font-semibold text-gray-600 w-1/3">Course:</td><td className="py-1 font-bold">{ledgerData.course.name}</td></tr>
                                            <tr className="border-b border-dashed border-gray-100"><td className="py-1 font-semibold text-gray-600">Duration:</td><td className="py-1">{ledgerData.course.duration} {ledgerData.course.durationType}</td></tr>
                                            <tr className="border-b border-dashed border-gray-100"><td className="py-1 font-semibold text-gray-600">Total Fees:</td><td className="py-1 font-bold text-gray-800">₹ {ledgerData.summary.totalCourseFees}</td></tr>
                                            <tr className="border-b border-dashed border-gray-100"><td className="py-1 font-semibold text-gray-600">Batch:</td><td className="py-1">{ledgerData.student.batch}</td></tr>
                                            <tr className="border-b border-dashed border-gray-100"><td className="py-1 font-semibold text-gray-600">Batch Time:</td><td className="py-1">{ledgerData.batch ? `${ledgerData.batch.startTime} - ${ledgerData.batch.endTime}` : 'N/A'}</td></tr>
                                            <tr className="border-b border-dashed border-gray-100"><td className="py-1 font-semibold text-gray-600">Plan:</td><td className="py-1 badge bg-blue-50 text-blue-700 px-2 rounded inline-block text-xs">{ledgerData.student.paymentPlan}</td></tr>
                                            <tr className="border-b border-dashed border-gray-100"><td className="py-1 font-semibold text-gray-600">Admission Fee:</td><td className="py-1">₹ {ledgerData.student.admissionFeeAmount || ledgerData.course.admissionFees}</td></tr>
                                            <tr><td className="py-1 font-semibold text-gray-600">Monthly Fee:</td><td className="py-1">{ledgerData.student.paymentPlan === 'Monthly' ? `₹ ${ledgerData.course.monthlyFees}` : 'N/A'}</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Section 2: Fees Table */}
                            <div className="mb-8">
                                <h3 className="text-primary font-bold border-b border-gray-200 mb-3 pb-1 uppercase text-sm">Payment History</h3>
                                <table className="w-full border-collapse border border-gray-300 text-sm">
                                    <thead className="bg-gray-100 text-gray-700">
                                        <tr>
                                            <th className="border border-gray-300 px-4 py-2 w-16 text-center">Sr.No.</th>
                                            <th className="border border-gray-300 px-4 py-2 text-center">Receipt Date</th>
                                            <th className="border border-gray-300 px-4 py-2 text-center">Receipt No</th>
                                            <th className="border border-gray-300 px-4 py-2 text-center">Type</th>
                                            <th className="border border-gray-300 px-4 py-2">Particulars</th>
                                            <th className="border border-gray-300 px-4 py-2 text-right">Amount (₹)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ledgerData.receipts.length > 0 ? ledgerData.receipts.map((receipt, index) => (
                                            <tr key={receipt._id} className="text-gray-800 hover:bg-gray-50">
                                                <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                                                <td className="border border-gray-300 px-4 py-2 text-center">{moment(receipt.date).format('DD-MM-YYYY')}</td>
                                                <td className="border border-gray-300 px-4 py-2 text-center font-mono">{receipt.receiptNo}</td>
                                                <td className="border border-gray-300 px-4 py-2 text-center uppercase">{receipt.paymentMode}</td>
                                                <td className="border border-gray-300 px-4 py-2">{receipt.remarks || 'Fees Payment'}</td>
                                                <td className="border border-gray-300 px-4 py-2 text-right font-medium">{receipt.amountPaid}</td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="6" className="border border-gray-300 px-4 py-6 text-center text-gray-500 italic">No payments recorded yet.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Section 3: Summary */}
                            <div className="flex justify-end">
                                <div className="w-1/3 bg-gray-50 p-4 rounded border border-gray-200">
                                    <h4 className="font-bold text-gray-700 border-b border-gray-300 pb-2 mb-2 uppercase text-xs tracking-wide">Financial Summary</h4>
                                    <div className="flex justify-between items-center mb-1 text-sm">
                                        <span className="text-gray-600">Total Course Fees:</span>
                                        <span className="font-bold">₹ {ledgerData.summary.totalCourseFees}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-1 text-sm">
                                        <span className="text-gray-600">Total Received Amount:</span>
                                        <span className="font-bold text-green-600">₹ {ledgerData.summary.totalPaid}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-300 text-lg">
                                        <span className="font-bold text-gray-800">Due Amount:</span>
                                        <span className="font-bold text-red-600">₹ {ledgerData.summary.dueAmount}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Print Footer */}
                            <div className="mt-12 text-center text-xs text-gray-400 hidden print:block">
                                <p>This is a computer-generated statement and does not require a signature.</p>
                                <p>Printed on: {moment().format('DD-MM-YYYY HH:mm:ss')}</p>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LedgerReport;