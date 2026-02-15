import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudentById,
  updateStudent,
  resetStatus,
} from "../../../features/student/studentSlice";
import { fetchBatches } from "../../../features/master/masterSlice";
import { fetchEmployees } from "../../../features/employee/employeeSlice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ChevronRight, Save, X, UserCheck } from "lucide-react";

const LOCATION_DATA = {
  Gujarat: ["Surat", "Ahmedabad", "Vadodara", "Rajkot"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik"],
  Delhi: ["New Delhi", "Noida", "Gurgaon"],
};

// Helper to get unique education list from existing students (Optional, can be hardcoded or fetched)
const educationList = ["10th Pass", "12th Pass", "Graduate", "Post Graduate"];

const StudentUpdate = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux
  const { currentStudent, isSuccess, isLoading, message } = useSelector(
    (state) => state.students
  );
  const { batches } = useSelector((state) => state.master) || { batches: [] };
  const { employees } = useSelector((state) => state.employees) || {
    employees: [],
  };

  // Local State
  const [educationOptions, setEducationOptions] = useState(educationList);
  const [previewImage, setPreviewImage] = useState(null);

  // Form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const watchState = watch("state");
  const watchRelation = watch("relationType");
  const watchCourseId = currentStudent?.course?._id || currentStudent?.course; // To filter batches

  // --- INITIALIZATION ---
  useEffect(() => {
    if (id) {
      dispatch(fetchStudentById(id));
    }
    dispatch(fetchBatches());
    dispatch(fetchEmployees());
  }, [dispatch, id]);

  // --- PRE-FILL DATA ---
  useEffect(() => {
    if (currentStudent) {
      reset({
        admissionDate: currentStudent.admissionDate?.split("T")[0],
        aadharCard: currentStudent.aadharCard,
        firstName: currentStudent.firstName,
        middleName: currentStudent.middleName,
        lastName: currentStudent.lastName,
        relationType: currentStudent.relationType || "Father",
        occupationType: currentStudent.occupationType,
        occupationName: currentStudent.occupationName,
        motherName: currentStudent.motherName,
        email: currentStudent.email,
        dob: currentStudent.dob?.split("T")[0],
        gender: currentStudent.gender,
        contactHome: currentStudent.contactHome,
        mobileStudent: currentStudent.mobileStudent,
        mobileParent: currentStudent.mobileParent,
        education: currentStudent.education,
        address: currentStudent.address,
        state: currentStudent.state,
        city: currentStudent.city,
        pincode: currentStudent.pincode,
        reference: currentStudent.reference,
        batch: currentStudent.batch,
      });
      // Handle Photo if needed (not implemented in backend update yet, logic similar to Admission)
    }
  }, [currentStudent, reset]);

  // --- HELPERS ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setValue("studentPhoto", file); // Set file in form to be sent to Redux
    }
  };

  // --- SUBMISSION HANDLER ---
  useEffect(() => {
    if (isSuccess) {
      toast.success("Student details updated successfully!");
      dispatch(resetStatus());
      navigate("/master/student");
    }
    if (message && !isSuccess && !isLoading) {
      toast.error(message);
      dispatch(resetStatus());
    }
  }, [isSuccess, message, isLoading, dispatch, navigate]);

  const onSubmit = (data) => {
    dispatch(updateStudent({ id, data }));
  };

  if (!currentStudent)
    return <div className="p-10 text-center">Loading Student Data...</div>;

  return (
    <div className="bg-gray-100 min-h-screen p-6 font-sans">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-4 flex justify-between items-center text-white shadow-md">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <UserCheck size={24} /> Update Student Details
          </h1>
          <button
            type="button"
            onClick={() => navigate("/master/student")}
            className="hover:bg-white/20 p-2 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8">
          {/* PERSONAL DETAILS SECTION */}
          <div className="grid grid-cols-12 gap-5 animate-fade-in-up">
            {/* Row 1 */}
            <div className="col-span-12 md:col-span-4">
              <label className="label">Admission Date</label>
              <input
                type="date"
                {...register("admissionDate")}
                className="input"
              />
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className="label">Aadhar Card No</label>
              <input
                {...register("aadharCard", { minLength: 12 })}
                className="input bg-gray-100 cursor-not-allowed"
                disabled
                title="Cannot change unique ID"
              />
            </div>
            <div className="col-span-12 md:col-span-4 flex justify-center items-center">
              {/* Photo Upload Section */}
              <label className="relative cursor-pointer group">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 group-hover:border-blue-500 transition">
                  {previewImage || currentStudent?.studentPhoto ? (
                    <img
                      src={
                        previewImage ||
                        (currentStudent.studentPhoto?.startsWith("http")
                          ? currentStudent.studentPhoto
                          : `${import.meta.env.VITE_API_URL}/${currentStudent.studentPhoto}`)
                      }
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                  ) : (
                    <div className="text-gray-400 text-xs text-center p-1">
                      No Photo
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/*"
                />
                <span className="block text-center text-xs text-blue-600 font-bold mt-1 group-hover:underline">
                  Change Photo
                </span>
              </label>
            </div>

            {/* Row 2 */}
            <div className="col-span-12 md:col-span-3">
              <label className="label">First Name *</label>
              <input
                {...register("firstName", { required: true })}
                className="input"
              />
            </div>
            <div className="col-span-6 md:col-span-2">
              <label className="label">Relation</label>
              <select
                {...register("relationType")}
                className="input bg-gray-50"
              >
                <option value="Father">Father</option>
                <option value="Husband">Husband</option>
              </select>
            </div>
            <div className="col-span-6 md:col-span-3">
              <label className="label">{watchRelation} Name</label>
              <input {...register("middleName")} className="input" />
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className="label">Last Name *</label>
              <input
                {...register("lastName", { required: true })}
                className="input"
              />
            </div>

            {/* Row 3 */}
            <div className="col-span-6 md:col-span-3">
              <label className="label">Occupation Type</label>
              <select {...register("occupationType")} className="input">
                <option value="Student">Student</option>
                <option value="Service">Service</option>
                <option value="Business">Business</option>
                <option value="Unemployed">Unemployed</option>
              </select>
            </div>
            <div className="col-span-6 md:col-span-3">
              <label className="label">Occupation Name</label>
              <input {...register("occupationName")} className="input" />
            </div>
            <div className="col-span-12 md:col-span-6">
              <label className="label">Mother Name</label>
              <input {...register("motherName")} className="input" />
            </div>

            {/* Row 4 */}
            <div className="col-span-12 md:col-span-5">
              <label className="label">E-mail</label>
              <input type="email" {...register("email")} className="input" />
            </div>
            <div className="col-span-6 md:col-span-3">
              <label className="label">Date of Birth *</label>
              <input
                type="date"
                {...register("dob", { required: true })}
                className="input"
              />
            </div>
            <div className="col-span-6 md:col-span-4">
              <label className="label">Gender *</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Male"
                    {...register("gender", { required: true })}
                    className="text-blue-600"
                  />{" "}
                  Male
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Female"
                    {...register("gender", { required: true })}
                    className="text-pink-600"
                  />{" "}
                  Female
                </label>
              </div>
            </div>

            {/* Row 5 */}
            <div className="col-span-12 md:col-span-4">
              <label className="label">Home Contact</label>
              <input
                {...register("contactHome", { maxLength: 10 })}
                className="input"
              />
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className="label">Student Contact</label>
              <input
                {...register("mobileStudent", { maxLength: 10 })}
                className="input"
              />
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className="label text-blue-700">Parent Contact *</label>
              <input
                {...register("mobileParent", {
                  required: true,
                  maxLength: 10,
                  minLength: 10,
                })}
                className="input border-blue-300 bg-blue-50"
              />
            </div>

            {/* Row 6 */}
            <div className="col-span-12">
              <label className="label">Education</label>
              <input
                list="eduOptions"
                {...register("education")}
                className="input"
              />
              <datalist id="eduOptions">
                {educationOptions.map((opt, i) => (
                  <option key={i} value={opt} />
                ))}
              </datalist>
            </div>

            {/* Row 7 */}
            <div className="col-span-12">
              <label className="label">Address *</label>
              <textarea
                {...register("address", { required: true })}
                rows="2"
                className="input"
              ></textarea>
            </div>

            {/* Row 8 */}
            <div className="col-span-12 md:col-span-4">
              <label className="label">State *</label>
              <select
                {...register("state", { required: true })}
                className="input"
              >
                {Object.keys(LOCATION_DATA).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className="label">City *</label>
              <select
                {...register("city", { required: true })}
                className="input"
              >
                {LOCATION_DATA[watchState]?.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className="label">Pincode</label>
              <input {...register("pincode")} className="input" />
            </div>

            {/* BATCH UPDATE SECTION */}
            <div className="col-span-12 mt-6 border-t pt-6">
              <h3 className="text-lg font-bold text-gray-700 mb-4 bg-gray-50 p-2 border-l-4 border-orange-500">
                Update Batch{" "}
                <span className="text-xs font-normal text-red-500 ml-2">
                  (Course cannot be changed)
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Current Course</label>
                  <div className="p-3 bg-gray-100 rounded border font-medium text-gray-700">
                    {currentStudent?.course?.name || "N/A"}
                  </div>
                </div>
                <div>
                  <label className="label">Batch Selection</label>
                  <select {...register("batch")} className="input">
                    <option value="">-- Change Batch --</option>
                    {/* Filter batches for this course */}
                    {batches
                      .filter(
                        (b) =>
                          b.course === watchCourseId ||
                          b.courses?.some((c) => (c._id || c) === watchCourseId)
                      )
                      .map((b) => (
                        <option key={b._id} value={b.name}>
                          {b.name} ({b.startTime} - {b.endTime})
                        </option>
                      ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Select a new batch to move the student.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="col-span-12 flex justify-end gap-4 mt-8 border-t pt-4">
              <button
                type="button"
                onClick={() => navigate("/master/student")}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-orange-600 text-white px-8 py-2 rounded font-bold hover:bg-orange-700 flex items-center gap-2 shadow opacity-90 hover:opacity-100 transition"
              >
                <Save size={18} />{" "}
                {isLoading ? "Updating..." : "Update Student Details"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <style>{`
                .label { display:block; font-size:0.75rem; font-weight:700; color:#4b5563; text-transform:uppercase; margin-bottom:0.3rem; letter-spacing:0.02em; }
                .input { width:100%; border:1px solid #d1d5db; padding:0.5rem; border-radius:0.375rem; outline:none; transition: all 0.2s; font-size:0.9rem; }
                .input:focus { border-color:#d97706; box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1); } /* Orange focus for update */
                .btn-secondary { background:white; color:#374151; border:1px solid #d1d5db; padding:0.5rem 1.25rem; border-radius:0.375rem; font-weight:500; transition: background 0.2s; }
                .btn-secondary:hover { background:#f3f4f6; }
                @keyframes fadeInUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
                .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
            `}</style>
    </div>
  );
};

export default StudentUpdate;
