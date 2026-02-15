import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layout
import Navbar from "./components/layout/Navbar";
import PublicLayout from "./components/layout/PublicLayout";
import ScrollToTop from "./components/layout/ScrollToTop";
import Loading from "./components/Loading"; // Import Loading Component

// Pages
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const AdminHome = lazy(() => import("./pages/admin/AdminHome"));
const AboutUsPage = lazy(() => import("./pages/user/AboutUsPage"));
const WhySmartPage = lazy(() => import("./pages/user/WhySmartPage"));
const CoursePage = lazy(() => import("./pages/user/CoursePage"));
const CourseDetailPage = lazy(() => import("./pages/user/CourseDetailPage"));
const FacilitiesPage = lazy(() => import("./pages/user/FacilitiesPage"));
const GalleryPage = lazy(() => import("./pages/user/GalleryPage"));
const FranchisePage = lazy(() => import("./pages/user/FranchisePage"));
const ContactPage = lazy(() => import("./pages/user/ContactPage"));
const BlogPage = lazy(() => import("./pages/user/BlogPage"));
const FeedbackPage = lazy(() => import("./pages/user/FeedbackPage"));
const OnlineAdmission = lazy(() => import("./pages/user/OnlineAdmission"));
const TermsAndConditions = lazy(() => import("./pages/user/TermsAndConditions"));

// Master Pages
const StudentList = lazy(() => import("./pages/admin/master/StudentList"));
const StudentAdmission = lazy(() =>
  import("./pages/admin/master/StudentAdmission")
);
const StudentUpdate = lazy(() => import("./pages/admin/master/StudentUpdate"));
const StudentProfile = lazy(() =>
  import("./pages/admin/master/StudentProfile")
);
const CourseMaster = lazy(() => import("./pages/admin/master/CourseMaster"));
const BatchMaster = lazy(() => import("./pages/admin/master/BatchMaster"));
const EmployeeMaster = lazy(() =>
  import("./pages/admin/master/EmployeeMaster")
);
const SubjectMaster = lazy(() => import("./pages/admin/master/SubjectMaster"));
const UserRights = lazy(() => import("./pages/admin/master/UserRights"));
const ExamRequestList = lazy(() =>
  import("./pages/admin/master/ExamRequestList")
);
const ExamSchedule = lazy(() => import("./pages/admin/master/ExamSchedule"));
const ExamResult = lazy(() => import("./pages/admin/master/ExamResult"));
const ManageNews = lazy(() => import("./pages/admin/master/ManageNews"));
const ManageTerms = lazy(() => import("./pages/admin/master/ManageTerms"));
const BranchMaster = lazy(() => import("./pages/admin/master/BranchMaster"));

// Transaction Pages
const InquiryPage = lazy(() => import("./pages/admin/transaction/InquiryPage"));
const FeeCollection = lazy(() =>
  import("./pages/admin/transaction/FeeCollection")
);
const InquiryOnline = lazy(() =>
  import("./pages/admin/transaction/InquiryOnline")
);
const InquiryOffline = lazy(() =>
  import("./pages/admin/transaction/InquiryOffline")
);
const InquiryDSR = lazy(() => import("./pages/admin/transaction/InquiryDSR"));
const TodaysVisitorsList = lazy(() =>
  import("./pages/admin/transaction/TodaysVisitorsList")
);
const TodaysVisitedReport = lazy(() =>
  import("./pages/admin/transaction/TodaysVisitedReport")
);
const Visitors = lazy(() => import("./pages/admin/transaction/Visitors"));
const PendingAdmissionFees = lazy(() =>
  import("./pages/admin/transaction/PendingAdmissionFees")
);
const PendingAdmissionFeePayment = lazy(() =>
  import("./pages/admin/transaction/PendingAdmissionFeePayment")
);
const StudentCancellation = lazy(() =>
  import("./pages/admin/transaction/StudentCancellation")
);
const PendingStudentRegistration = lazy(() =>
  import("./pages/admin/transaction/PendingStudentRegistration")
);
const StudentRegistrationProcess = lazy(() =>
  import("./pages/admin/transaction/StudentRegistrationProcess")
);
const StudentAttendance = lazy(() => import("./pages/admin/transaction/StudentAttendance"));
const EmployeeAttendance = lazy(() => import("./pages/admin/transaction/EmployeeAttendance"));

// --- REPORTS (Ensure this import is correct) ---
const LedgerReport = lazy(() => import("./pages/admin/reports/LedgerReport"));
const AdmissionFormPrint = lazy(() => import("./pages/admin/reports/AdmissionFormPrint"));

const PrivateRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <Router>
        <ScrollToTop />
        <div
          className={`min-h-screen bg-gray-50 text-gray-900 font-sans ${
            user ? "pt-20 print:pt-0" : ""
          }`}
        >
          <div className="print:hidden">{user && <Navbar />}</div>
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* PRIVATE ADMIN ROUTES */}
              <Route
                path="/home"
                element={
                  <PrivateRoute>
                    <AdminHome />
                  </PrivateRoute>
                }
              />

              {/* MASTER ROUTES */}
              <Route
                path="/master/student"
                element={
                  <PrivateRoute>
                    <StudentList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/master/student/new"
                element={
                  <PrivateRoute>
                    <StudentAdmission />
                  </PrivateRoute>
                }
              />
              <Route
                path="/master/student/edit/:id"
                element={
                  <PrivateRoute>
                    <StudentUpdate />
                  </PrivateRoute>
                }
              />
              <Route
                path="/master/student/view/:id"
                element={
                  <PrivateRoute>
                    <StudentProfile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/master/course"
                element={
                  <PrivateRoute>
                    <CourseMaster />
                  </PrivateRoute>
                }
              />
              <Route
                path="/master/batch"
                element={
                  <PrivateRoute>
                    <BatchMaster />
                  </PrivateRoute>
                }
              />
              <Route
                path="/master/subject"
                element={
                  <PrivateRoute>
                    <SubjectMaster />
                  </PrivateRoute>
                }
              />
              <Route
                path="/master/employee"
                element={
                  <PrivateRoute>
                    <EmployeeMaster />
                  </PrivateRoute>
                }
              />
              <Route
                path="/master/user-rights"
                element={
                  <PrivateRoute>
                    <UserRights />
                  </PrivateRoute>
                }
              />
              <Route
                path="/master/exam-request-list"
                element={
                  <PrivateRoute>
                    <ExamRequestList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/master/exam-schedule"
                element={
                  <PrivateRoute>
                    <ExamSchedule />
                  </PrivateRoute>
                }
              />
              <Route
                path="/master/exam-result"
                element={
                  <PrivateRoute>
                    <ExamResult />
                  </PrivateRoute>
                }
              />
              <Route
                path="/master/manage-news"
                element={
                  <PrivateRoute>
                    <ManageNews />
                  </PrivateRoute>
                }
              />
               <Route
                path="/master/manage-terms"
                element={
                  <PrivateRoute>
                    <ManageTerms />
                  </PrivateRoute>
                }
              />
              <Route
                path="/master/branch"
                element={
                  <PrivateRoute>
                    <BranchMaster />
                  </PrivateRoute>
                }
              />

              {/* TRANSACTION ROUTES */}
              <Route
                path="/transaction/inquiry"
                element={
                  <PrivateRoute>
                    <InquiryPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/transaction/fees-receipt"
                element={
                  <PrivateRoute>
                    <FeeCollection />
                  </PrivateRoute>
                }
              />
              <Route
                path="/transaction/inquiry/online"
                element={
                  <PrivateRoute>
                    <InquiryOnline />
                  </PrivateRoute>
                }
              />
              <Route
                path="/transaction/inquiry/offline"
                element={
                  <PrivateRoute>
                    <InquiryOffline />
                  </PrivateRoute>
                }
              />
              <Route
                path="/transaction/inquiry/dsr"
                element={
                  <PrivateRoute>
                    <InquiryDSR />
                  </PrivateRoute>
                }
              />
              <Route
                path="/transaction/visitors/todays-list"
                element={
                  <PrivateRoute>
                    <TodaysVisitorsList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/transaction/visitors/todays-report"
                element={
                  <PrivateRoute>
                    <TodaysVisitedReport />
                  </PrivateRoute>
                }
              />
              <Route
                path="/transaction/visitors"
                element={
                  <PrivateRoute>
                    <Visitors />
                  </PrivateRoute>
                }
              />
              <Route
                path="/transaction/pending-admission-fees"
                element={
                  <PrivateRoute>
                    <PendingAdmissionFees />
                  </PrivateRoute>
                }
              />
              <Route
                path="/transaction/admission-payment/:id"
                element={
                  <PrivateRoute>
                    <PendingAdmissionFeePayment />
                  </PrivateRoute>
                }
              />

              <Route
                path="/transaction/student-registration"
                element={
                  <PrivateRoute>
                    <StudentAdmission />
                  </PrivateRoute>
                }
              />
              <Route
                path="/transaction/student-cancellation"
                element={
                  <PrivateRoute>
                    <StudentCancellation />
                  </PrivateRoute>
                }
              />
              <Route
                path="/transaction/pending-registration"
                element={
                  <PrivateRoute>
                    <PendingStudentRegistration />
                  </PrivateRoute>
                }
              />
              <Route
                path="/transaction/student-registration-process/:id"
                element={
                  <PrivateRoute>
                    <StudentRegistrationProcess />
                  </PrivateRoute>
                }
              />
              <Route
                path="/transaction/attendance/student"
                element={
                  <PrivateRoute>
                    <StudentAttendance />
                  </PrivateRoute>
                }
              />
               <Route
                path="/transaction/attendance/employee"
                element={
                  <PrivateRoute>
                    <EmployeeAttendance />
                  </PrivateRoute>
                }
              />

              {/* --- REPORTS ROUTE --- */}
              <Route
                path="/reports/ledger"
                element={
                  <PrivateRoute>
                    <LedgerReport />
                  </PrivateRoute>
                }
              />
              <Route
                path="/print/admission-form/:id"
                element={
                  <PrivateRoute>
                    <Suspense fallback={<Loading />}>
                        {/* Lazy load inline or import at top if preferred, using existing lazy pattern */}
                        <AdmissionFormPrint />
                    </Suspense>
                  </PrivateRoute>
                }
              />

              {/* Connect */}
              <Route
                path="/connect/inquiry-list"
                element={
                  <PrivateRoute>
                    <InquiryPage />
                  </PrivateRoute>
                }
              />

              {/* PUBLIC PAGES */}
              <Route
                path="/login"
                element={user ? <Navigate to="/home" replace /> : <LoginPage />}
              />
              <Route
                path="/register-admin-zyx"
                element={
                  user ? <Navigate to="/home" replace /> : <RegisterPage />
                }
              />

              <Route element={<PublicLayout />}>
                <Route
                  path="/"
                  element={
                    user ? <Navigate to="/home" replace /> : <HomePage />
                  }
                />
                <Route path="/about-us" element={<AboutUsPage />} />
                <Route path="/why-smart" element={<WhySmartPage />} />
                <Route path="/course" element={<CoursePage />} />
                <Route
                  path="/course/:courseId"
                  element={<CourseDetailPage />}
                />
                <Route path="/facilities" element={<FacilitiesPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/franchise" element={<FranchisePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/feedback" element={<FeedbackPage />} />
                <Route path="/online-admission" element={<OnlineAdmission />} />
                <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              </Route>
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </>
  );
}

export default App;
