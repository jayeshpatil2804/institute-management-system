import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExamSchedules, fetchBatches, fetchExamResults, createExamResult, updateExamResult, resetMasterStatus } from '../../../features/master/masterSlice';
import { fetchStudents } from '../../../features/student/studentSlice';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Plus, Search, RefreshCw, Edit, Printer, Award, Save } from 'lucide-react';

const ExamResult = () => {
  const dispatch = useDispatch();
  const { examSchedules, batches, examResults, isSuccess, message } = useSelector((state) => state.master);
  const { students } = useSelector((state) => state.students); // Use for dropdown in form

  // Local State
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [filters, setFilters] = useState({ examId: '', batch: '', regNo: '', studentName: '' });
  
  // Pagination State
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  // Form Setup
  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    dispatch(fetchExamSchedules());
    dispatch(fetchBatches());
    dispatch(fetchExamResults());
    // Fetch all students for the dropdown in "Add New" form (optimization needed for large datasets)
    dispatch(fetchStudents({ pageSize: 1000 }));
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess && message) {
        toast.success(message);
        dispatch(resetMasterStatus());
        if (showForm) setShowForm(false);
        setEditMode(null);
        reset();
    }
  }, [isSuccess, message, dispatch, showForm, reset]);

  const onSearch = () => dispatch(fetchExamResults(filters));
  const onReset = () => {
    setFilters({ examId: '', batch: '', regNo: '', studentName: '' });
    dispatch(fetchExamResults());
  };

  const onSubmit = (data) => {
    if (editMode) {
        dispatch(updateExamResult({ id: editMode, data }));
    } else {
        dispatch(createExamResult(data));
    }
  };

  const handleEdit = (result) => {
    setEditMode(result._id);
    setShowForm(true);
    setValue('studentId', result.student._id);
    setValue('examId', result.exam._id);
    setValue('somNumber', result.somNumber);
    setValue('csrNumber', result.csrNumber);
    setValue('marksObtained', result.marksObtained);
    setValue('totalMarks', result.totalMarks);
    setValue('grade', result.grade);
    setValue('isActive', result.isActive);
  };

  const printDocument = (type, result) => {
      toast.info(`Printing ${type} for ${result.student.firstName}...`);
      // Implement actual PDF generation logic here
  };

  // Client-side pagination
  const paginatedData = examResults.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(examResults.length / pageSize);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Exam Results</h2>
        {!showForm && (
            <button onClick={() => { setShowForm(true); reset(); setEditMode(null); }} className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700">
                <Plus size={18} /> Add New Result
            </button>
        )}
      </div>

      {/* --- ADD / EDIT FORM --- */}
      {showForm && (
        <div className="bg-white p-6 rounded shadow mb-6 border-l-4 border-primary animate-fadeIn">
            <h3 className="text-lg font-bold mb-4">{editMode ? 'Edit Result' : 'Add New Exam Result'}</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                {/* Student Selection */}
                <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Select Student</label>
                    <select {...register('studentId', {required: true})} className="border p-2 rounded w-full" disabled={!!editMode}>
                        <option value="">-- Search/Select Student --</option>
                        {students.map(s => (
                            <option key={s._id} value={s._id}>{s.firstName} {s.lastName} ({s.regNo}) - {s.course?.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Select Exam</label>
                    <select {...register('examId', {required: true})} className="border p-2 rounded w-full">
                        <option value="">-- Select Exam --</option>
                        {examSchedules.map(e => <option key={e._id} value={e._id}>{e.examName}</option>)}
                    </select>
                </div>
                
                {/* Fields implied by table requirements */}
                <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">SOM Number</label>
                    <input {...register('somNumber')} className="border p-2 rounded w-full" placeholder="SOM-XXX" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">CSR Number</label>
                    <input {...register('csrNumber')} className="border p-2 rounded w-full" placeholder="CSR-XXX" />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Marks Obtained</label>
                    <input type="number" {...register('marksObtained', {required: true})} className="border p-2 rounded w-full" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Total Marks</label>
                    <input type="number" {...register('totalMarks', {required: true})} className="border p-2 rounded w-full" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Grade</label>
                    <input {...register('grade')} className="border p-2 rounded w-full" placeholder="A, B, C..." />
                </div>

                <div className="flex items-center gap-2 mt-6">
                    <input type="checkbox" {...register('isActive')} id="isActive" className="h-4 w-4" defaultChecked />
                    <label htmlFor="isActive" className="text-sm font-medium">Is Active</label>
                </div>

                <div className="md:col-span-4 flex justify-end gap-2 mt-4 border-t pt-4">
                    <button type="button" onClick={() => setShowForm(false)} className="border px-4 py-2 rounded hover:bg-gray-100">Cancel</button>
                    <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded flex items-center gap-2 hover:bg-green-700">
                        <Save size={18} /> Save Result
                    </button>
                </div>
            </form>
        </div>
      )}

      {/* --- FILTER SECTION --- */}
      {!showForm && (
        <div className="bg-white p-4 rounded shadow mb-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Select Exam</label>
                    <select className="border p-2 rounded w-full text-sm" value={filters.examId} onChange={(e) => setFilters({...filters, examId: e.target.value})}>
                        <option value="">-- All Exams --</option>
                        {examSchedules.map(e => <option key={e._id} value={e._id}>{e.examName}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Batch</label>
                    <input list="batchList" className="border p-2 rounded w-full text-sm" placeholder="Select Batch"
                        value={filters.batch} onChange={(e) => setFilters({...filters, batch: e.target.value})} />
                    <datalist id="batchList">{batches.map(b => <option key={b._id} value={b.name} />)}</datalist>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Reg Number</label>
                    <input className="border p-2 rounded w-full text-sm" placeholder="Search Reg No..."
                        value={filters.regNo} onChange={(e) => setFilters({...filters, regNo: e.target.value})} />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Student Name</label>
                    <input className="border p-2 rounded w-full text-sm" placeholder="Search Name..."
                        value={filters.studentName} onChange={(e) => setFilters({...filters, studentName: e.target.value})} />
                </div>
                <div className="flex gap-2">
                    <button onClick={onReset} className="bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300"><RefreshCw size={16}/></button>
                    <button onClick={onSearch} className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-black w-full">Search</button>
                </div>
            </div>
        </div>
      )}

      {/* --- TABLE SECTION --- */}
      <div className="bg-white rounded shadow overflow-x-auto border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Enrollment No</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Reg No</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap">SOM No</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap">CSR No</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Student Name</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Course</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Exam</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Batch</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Status</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.length > 0 ? paginatedData.map((res) => (
                    <tr key={res._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-600">{res.student?.enrollmentNo}</td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-800">{res.student?.regNo}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{res.somNumber || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{res.csrNumber || '-'}</td>
                        <td className="px-4 py-3 text-sm font-medium text-primary">
                            {res.student?.firstName} {res.student?.lastName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{res.course?.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{res.exam?.examName}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{res.batch}</td>
                        <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-1 text-xs rounded-full ${res.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {res.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </td>
                        <td className="px-4 py-3 text-center flex justify-center gap-2">
                            <button onClick={() => printDocument('Marksheet', res)} className="text-purple-600 hover:text-purple-800" title="Marksheet">
                                <Printer size={18} />
                            </button>
                            <button onClick={() => printDocument('Certificate', res)} className="text-orange-600 hover:text-orange-800" title="Certificate">
                                <Award size={18} />
                            </button>
                            <button onClick={() => handleEdit(res)} className="text-blue-600 hover:text-blue-800" title="Edit">
                                <Edit size={18} />
                            </button>
                        </td>
                    </tr>
                )) : (
                    <tr><td colSpan="10" className="text-center py-8 text-gray-500 italic">No results found.</td></tr>
                )}
            </tbody>
        </table>

        {/* Pagination */}
        <div className="p-4 flex justify-between items-center bg-gray-50 border-t">
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rows:</span>
                <select className="border rounded p-1 text-sm" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                    <option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
                </select>
            </div>
            <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border rounded bg-white disabled:opacity-50">Prev</button>
                <span className="text-sm font-medium pt-1">Page {page} of {totalPages || 1}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded bg-white disabled:opacity-50">Next</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ExamResult;