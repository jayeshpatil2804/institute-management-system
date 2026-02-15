import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchStudents } from '../../../features/student/studentSlice';
import { fetchEmployees } from '../../../features/employee/employeeSlice';
import { Search, RotateCcw, Printer, UserPlus, Eye, Edit } from 'lucide-react';
import StudentSearch from '../../../components/StudentSearch';

const PendingStudentRegistration = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { students, pagination, isLoading } = useSelector((state) => state.students);
  const { employees } = useSelector((state) => state.employees) || { employees: [] };

  // Filters
  const [filters, setFilters] = useState({
    studentName: '',
    reference: '',
    startDate: '', // Default Today
    endDate: new Date().toISOString().split('T')[0],
    isRegistered: 'false', // Only unregistered
    isAdmissionFeesPaid: 'true' // Only those who paid admission fees
  });

  useEffect(() => {
    dispatch(fetchStudents({ ...filters, pageNumber: 1 }));
    dispatch(fetchEmployees());
  }, [dispatch]); // Initial Load

  const handleSearch = () => {
    dispatch(fetchStudents({ ...filters, pageNumber: 1 }));
  };

  const handleReset = () => {
    setFilters({
      studentName: '',
      reference: '',
      startDate: '',
      endDate: '',
      isRegistered: 'false',
      isAdmissionFeesPaid: 'true'
    });
    dispatch(fetchStudents({ isRegistered: 'false', isAdmissionFeesPaid: 'true', pageNumber: 1 }));
  };

  const handleRegister = (id) => {
    navigate(`/transaction/student-registration-process/${id}`);
  };

  const handleView = (student) => {
    alert(`View Details for ${student.firstName}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <UserPlus className="text-blue-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-800">Pending Student Registration</h2>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <StudentSearch 
            placeholder="Search Student..."
            additionalFilters={{ isRegistered: 'false', isAdmissionFeesPaid: 'true' }} 
            onSelect={(id, student) => {
              // When selected via search, we can directly update list or just set the name filter
              if (student) {
                setFilters(prev => ({ ...prev, studentName: student.firstName }));
              } else {
                setFilters(prev => ({ ...prev, studentName: '' }));
              }
            }}
          />
          
          <select 
            className="border p-2 rounded"
            value={filters.reference}
            onChange={(e) => setFilters({...filters, reference: e.target.value})}
          >
            <option value="">-- Reference --</option>
            {employees?.map(emp => (
                <option key={emp._id} value={emp.name}>{emp.name}</option>
            ))}
          </select>
          <input 
            type="date" 
            className="border p-2 rounded"
            value={filters.startDate}
            onChange={(e) => setFilters({...filters, startDate: e.target.value})}
          />
          <input 
            type="date" 
            className="border p-2 rounded"
            value={filters.endDate}
            onChange={(e) => setFilters({...filters, endDate: e.target.value})}
          />
          <div className="flex gap-2">
            <button onClick={handleSearch} className="bg-blue-600 text-white p-2 rounded"><Search size={20}/></button>
            <button onClick={handleReset} className="bg-gray-500 text-white p-2 rounded"><RotateCcw size={20}/></button>
            <button className="bg-purple-600 text-white p-2 rounded"><Printer size={20}/></button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enrollment No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adm Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                  <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
              ) : students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">{student.enrollmentNo}</td>
                      <td className="px-6 py-4 text-sm">{new Date(student.admissionDate).toLocaleDateString('en-GB')}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                        <div className="text-xs text-gray-500">Father: {student.middleName}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div>S: {student.mobileStudent || '-'}</div>
                        <div className="text-xs text-gray-500">P: {student.mobileParent}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">{student.course?.name}</td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button onClick={() => handleView(student)} className="text-blue-600" title="View"><Eye size={18}/></button>
                        <button onClick={() => handleRegister(student._id)} className="text-green-600 font-bold border border-green-600 px-2 py-1 rounded text-xs hover:bg-green-50">
                            Register
                        </button>
                        <button onClick={() => navigate(`/print/admission-form/${student._id}?mode=REGISTRATION`)} className="text-purple-600" title="Print Form"><Printer size={18}/></button>
                        <button className="text-gray-600" title="Edit"><Edit size={18}/></button>
                      </td>
                    </tr>
                  ))
              ) : (
                  <tr><td colSpan="6" className="text-center py-4">No pending registrations found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination (Simplified) */}
        <div className="mt-4 flex justify-between text-sm text-gray-600">
             <span>Showing {students.length} of {pagination.count} records</span>
             <div className="flex gap-2">
                <button disabled={pagination.page===1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
                <button disabled={pagination.page===pagination.pages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
             </div>
        </div>

      </div>
    </div>
  );
};

export default PendingStudentRegistration;