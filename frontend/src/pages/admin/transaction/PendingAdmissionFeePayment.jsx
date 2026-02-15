import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudentById,
  resetStatus,
} from "../../../features/student/studentSlice";
import {
  collectFees,
  resetTransaction,
} from "../../../features/transaction/transactionSlice";
import { toast } from "react-toastify";
import { Save, ArrowLeft } from "lucide-react";
import axios from "axios";

const PendingAdmissionFeePayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentStudent: student, isLoading: studentLoading } = useSelector(
    (state) => state.students
  );
  const {
    isSuccess,
    message,
    isLoading: feeLoading,
  } = useSelector((state) => state.transaction);

  const [formData, setFormData] = useState({
    amountPaid: "",
    paymentMode: "Cash",
    remarks: "",
    receiptNo: "Loading...",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchStudentById(id));
    }
    return () => {
      dispatch(resetStatus());
      dispatch(resetTransaction());
    };
  }, [id, dispatch]);

  useEffect(() => {
    // Fetch Next Receipt No
    const fetchReceiptNo = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/transaction/fees/next-no`, {
                withCredentials: true
            });
            setFormData(prev => ({ ...prev, receiptNo: data }));
        } catch (error) {
            console.error("Failed to fetch next receipt no", error);
            setFormData(prev => ({ ...prev, receiptNo: "Error" }));
        }
    };
    fetchReceiptNo();
  }, []);

  useEffect(() => {
    if (student && student.course) {
      const defaultFee = student.course.admissionFees || "";
      setFormData((prev) => ({ ...prev, amountPaid: defaultFee }));
    }
  }, [student]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(message);
      setTimeout(() => {
        navigate("/transaction/pending-registration");
      }, 1500);
    }
  }, [isSuccess, message, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amountPaid || formData.amountPaid <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // FIXED: Prevent double click
    if (feeLoading) return;

    const feeData = {
      studentId: student._id,
      courseId: student.course._id,
      amountPaid: formData.amountPaid,
      paymentMode: formData.paymentMode,
      // FIXED: If remarks is empty, send 'Admission Fee'
      remarks: formData.remarks || 'Admission Fee',
    };

    dispatch(collectFees(feeData));
  };

  if (studentLoading || !student) {
    return <div className="p-6 text-center">Loading student details...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={16} className="mr-1" /> Back to List
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 text-white px-6 py-4">
          <h2 className="text-xl font-bold">Pending Admission Fee Payment</h2>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border-r border-gray-100 pr-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
              Student Information
            </h3>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-3">
                <span className="text-gray-500">Student Name:</span>
                <span className="col-span-2 font-medium">
                  {student.firstName} {student.lastName}
                </span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-gray-500">Father Name:</span>
                <span className="col-span-2 font-medium">
                  {student.middleName || "-"}
                </span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-gray-500">Mobile Number:</span>
                <span className="col-span-2 font-medium">
                  {student.mobileStudent || student.mobileParent}
                </span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-gray-500">E-mail ID:</span>
                <span className="col-span-2 font-medium">
                  {student.email || "-"}
                </span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-gray-500">Admission Date:</span>
                <span className="col-span-2 font-medium">
                  {new Date(student.admissionDate).toLocaleDateString()}
                </span>
              </div>
              <div className="grid grid-cols-3">
                <span className="text-gray-500">Date of Birth:</span>
                <span className="col-span-2 font-medium">
                  {new Date(student.dob).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
              Fee Payment
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Receipt Number
                </label>
                <input
                  type="text"
                  disabled
                  value={formData.receiptNo}
                  className="w-full bg-gray-100 border rounded px-3 py-2 text-sm text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Receipt Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  disabled
                  value={student.course?.name || ""}
                  className="w-full bg-gray-100 border rounded px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Amount (₹)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Admission Fees"
                  value={formData.amountPaid}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!isNaN(val))
                      setFormData({ ...formData, amountPaid: val });
                  }}
                  className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200 font-bold text-gray-800"
                />
                <span className="text-xs text-gray-400">
                  Default: Admission Fee
                </span>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Payment Mode
                </label>
                <select
                  className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                  value={formData.paymentMode}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentMode: e.target.value })
                  }
                >
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Online">Online</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Remarks
                </label>
                <textarea
                  rows="2"
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
                  placeholder="Optional"
                ></textarea>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  disabled={feeLoading}
                  className="w-full bg-green-600 text-white py-2 rounded shadow hover:bg-green-700 disabled:bg-green-300 flex justify-center items-center gap-2 font-bold"
                >
                  <Save size={18} /> {feeLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingAdmissionFeePayment;