import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchStudents,
  deleteStudent,
} from "../../../features/student/studentSlice";
import { fetchEmployees } from "../../../features/employee/employeeSlice";
import {
  Filter,
  Search,
  RotateCcw,
  Printer,
  Eye,
  CreditCard,
  Trash2,
} from "lucide-react";
import StudentSearch from "../../../components/StudentSearch";

const PendingAdmissionFees = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { students, pagination, isLoading } = useSelector(
    (state) => state.students
  );
  const { employees } = useSelector((state) => state.employees) || {
    employees: [],
  }; // Select Employees

  // Filters State
  const [filters, setFilters] = useState({
    studentName: "",
    reference: "",
    startDate: "",
    endDate: "",
    isAdmissionFeesPaid: "false", // Show only those who haven't paid admission fees
  });

  // Load Data
  useEffect(() => {
    dispatch(fetchStudents({ ...filters, pageNumber: 1 }));
    dispatch(fetchEmployees()); // Fetch Employees
  }, [dispatch]); // Initial load

  // Handlers
  const handleSearch = () => {
    dispatch(fetchStudents({ ...filters, pageNumber: 1 }));
  };

  const handleReset = () => {
    const resetFilters = {
      studentName: "",
      reference: "",
      startDate: "",
      endDate: "",
      isAdmissionFeesPaid: "false",
    };
    setFilters(resetFilters);
    dispatch(fetchStudents({ ...resetFilters, pageNumber: 1 }));
  };

  const handlePageChange = (newPage) => {
    dispatch(fetchStudents({ ...filters, pageNumber: newPage }));
  };

  // Actions
  const handleAdmissionPayment = (id) => {
    navigate(`/transaction/admission-payment/${id}`);
  };

  const handleView = (student) => {
    // Navigate to a student profile view (assuming one exists or reused)
    // For now logging
    console.log("View Student", student);
    alert(`View Details for ${student.firstName}`);
  };

  const handleDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this student record? This cannot be undone."
      )
    ) {
      dispatch(deleteStudent(id));
    }
  };

  // Table Columns
  const columns = [
    { header: "Enrollment No", accessor: "enrollmentNo" },
    {
      header: "Admission Date",
      accessor: "admissionDate",
      render: (row) => new Date(row.admissionDate).toLocaleDateString('en-GB'),
    },
    {
      header: "Student Name",
      accessor: "firstName",
      render: (row) => `${row.firstName} ${row.lastName}`,
    },
    { header: "Father/Husband", accessor: "middleName" },
    { header: "Last Name", accessor: "lastName" },
    { header: "Contact (Parent)", accessor: "mobileParent" },
    {
      header: "Course",
      accessor: "course",
      render: (row) => row.course?.name || "-",
    },
    {
      header: "Pending Fees",
      accessor: "pendingFees",
      render: (row) => `₹${row.pendingFees}`,
    },
    { header: "Reference", accessor: "reference" },
  ];

  // Custom Action Buttons for SmartTable (if supported) or override render in SmartTable
  // Since SmartTable currently has hardcoded Edit/Delete, we will modify SmartTable conceptually
  // OR we can pass a custom render to the last column if we modify SmartTable.
  // Assuming SmartTable usage is standard, I will create a specific Action Column render.

  const actionColumn = {
    header: "Actions",
    accessor: "_id",
    render: (row) => (
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => handleView(row)}
          title="View Details"
          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
        >
          <Eye size={18} />
        </button>
        <button
          onClick={() => handleAdmissionPayment(row._id)}
          title="Pay Admission Fee"
          className="p-1 text-green-600 hover:bg-green-50 rounded flex items-center gap-1"
        >
          <CreditCard size={18} />
        </button>
        <button
          onClick={() => navigate(`/print/admission-form/${row._id}?mode=NO_FEES`)}
          title="Print Admission Form"
          className="p-1 text-gray-600 hover:bg-gray-50 rounded"
        >
          <Printer size={18} />
        </button>
        <button
          onClick={() => handleDelete(row._id)}
          title="Delete Record"
          className="p-1 text-red-600 hover:bg-red-50 rounded"
        >
          <Trash2 size={18} />
        </button>
      </div>
    ),
  };

  // Merge columns avoiding duplicate Actions if SmartTable adds one automatically.
  // To strictly follow the "Table" requirements in prompt:
  const tableColumns = [...columns, actionColumn];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <CreditCard className="text-green-600" /> Pending Admission Fees
          </h2>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <StudentSearch 
            placeholder="Search Student..."
            additionalFilters={{ isAdmissionFeesPaid: 'false' }}
            onSelect={(id, student) => {
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
            onChange={(e) =>
              setFilters({ ...filters, reference: e.target.value })
            }
          >
            <option value="">-- Select Reference --</option>
            <option value="Faculty A">Faculty A</option>
            <option value="Admin">Admin</option>
            {/* Populate dynamically if Employee API exists */}
          </select>

          <input
            type="date"
            className="border p-2 rounded"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
            placeholder="From Date"
          />
          <input
            type="date"
            className="border p-2 rounded"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
            placeholder="To Date"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
          >
            <Search size={18} /> Search
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-600"
          >
            <RotateCcw size={18} /> Reset
          </button>
          
          {/* Note: Global report or selected print logic can be here. For row specific print, see the table actions below. */}
          <button className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-purple-700">
            <Printer size={18} /> Report
          </button>
        </div>

        {/* Table */}
        {isLoading ? (
          <p className="text-center py-4">Loading students...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border">
              <thead className="bg-gray-50">
                <tr>
                  {tableColumns.map((col, idx) => (
                    <th
                      key={idx}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student._id}>
                    {tableColumns.map((col, idx) => (
                      <td
                        key={idx}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {col.render
                          ? col.render(student)
                          : student[col.accessor]}
                      </td>
                    ))}
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td
                      colSpan={tableColumns.length}
                      className="text-center py-4"
                    >
                      No pending admission fees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls - Simple Implementation */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            disabled={pagination.page === 1}
            onClick={() => handlePageChange(pagination.page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            disabled={pagination.page === pagination.pages}
            onClick={() => handlePageChange(pagination.page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingAdmissionFees;
