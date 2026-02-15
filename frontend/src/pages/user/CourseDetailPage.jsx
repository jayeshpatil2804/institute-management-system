import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourses } from '../../features/master/masterSlice';
import { 
  Clock, BookOpen, CheckCircle, ArrowLeft, Calendar, 
  DollarSign, Award, Star, Users 
} from 'lucide-react';
import { motion } from 'framer-motion';
import Reveal from '../../components/Reveal';

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const { courses, isLoading } = useSelector((state) => state.master);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    if (courses.length === 0) {
      dispatch(fetchCourses());
    }
  }, [dispatch, courses.length]);

  useEffect(() => {
    if (courses.length > 0) {
      const foundCourse = courses.find(c => c._id === courseId);
      setCourse(foundCourse);
    }
  }, [courses, courseId]);

  if (isLoading || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Loading course details...</p>
        </div>
      </div>
    );
  }

  // Split description by newlines for "line by line" display
  const descriptionLines = course.description ? course.description.split('\n').filter(line => line.trim() !== '') : [];

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      {/* Hero Header */}
      <div className="relative bg-gray-900 h-96">
         <div className="absolute inset-0">
             <img 
                src={course.image || `https://placehold.co/1200x600/png?text=${encodeURIComponent(course.name)}`} 
                alt={course.name} 
                className="w-full h-full object-cover opacity-40"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
         </div>
         <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-12 relative z-10">
            <Link to="/course" className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors gap-2">
                <ArrowLeft size={20} /> Back to Courses
            </Link>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{course.name}</h1>
                <p className="text-xl text-gray-300 max-w-3xl">{course.smallDescription}</p>
            </motion.div>
         </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Content Column */}
            <div className="lg:col-span-2 space-y-8">
                <Reveal>
                {/* Overview Cards */}
                <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 flex flex-wrap gap-8 justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Clock size={28} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-semibold uppercase">Duration</p>
                            <p className="text-lg font-bold text-gray-900">{course.duration} {course.durationType}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                         <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                            <BookOpen size={28} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-semibold uppercase">Subjects</p>
                            <p className="text-lg font-bold text-gray-900">{course.subjects?.length || 0} Modules</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-4">
                         <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                            <Award size={28} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-semibold uppercase">Certificate</p>
                            <p className="text-lg font-bold text-gray-900">Valid Govt. Recognized</p>
                        </div>
                    </div>
                </div>
                </Reveal>

                {/* Course Description */}
                <Reveal delay={0.1}>
                <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="w-1 h-8 bg-accent rounded-full"></span>
                        Course Description
                    </h2>
                    <div className="space-y-4 text-gray-700 leading-relaxed text-justify">
                        {descriptionLines.length > 0 ? (
                            descriptionLines.map((line, index) => (
                                <p key={index}>{line}</p>
                            ))
                        ) : (
                            <p>No description available for this course.</p>
                        )}
                    </div>
                </div>
                </Reveal>

                {/* Subject Details */}
                <Reveal delay={0.2}>
                <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                     <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="w-1 h-8 bg-primary rounded-full"></span>
                        What You Will Learn
                    </h2>
                    {course.subjects && course.subjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {course.subjects.map((sub, index) => (
                                <div key={index} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-blue-50/50 transition-colors">
                                    <div className="bg-primary/10 text-primary p-2 rounded-full">
                                        <CheckCircle size={18} />
                                    </div>
                                    <span className="font-semibold text-gray-800">{sub.subject?.name || "Subject Name"}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-500 italic">Subject details are being updated.</div>
                    )}
                </div>
                </Reveal>

            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
                <Reveal>
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
                    <div className="mb-6">
                        <span className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Course Fee</span>
                        <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-4xl font-bold text-primary">₹{course.courseFees}</span>
                        </div>
                    </div>

                    <Link to={`/online-admission?courseId=${course._id}`} className="w-full bg-accent hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/30 transition-all transform hover:-translate-y-1 mb-4 flex items-center justify-center gap-2">
                        Enroll Now <ArrowRightIcon size={20} />
                    </Link>
                    
                </div>
                </Reveal>
            </div>

        </div>
      </div>
    </div>
  );
};

// Helper Icon for standard bullets
const ArrowRightIcon = ({ className, size }) => (
    <svg 
     xmlns="http://www.w3.org/2000/svg" 
     width={size} 
     height={size} 
     viewBox="0 0 24 24" 
     fill="none" 
     stroke="currentColor" 
     strokeWidth="2" 
     strokeLinecap="round" 
     strokeLinejoin="round" 
     className={className}
    >
        <path d="M5 12h14"></path>
        <path d="m12 5 7 7-7 7"></path>
    </svg>
);

export default CourseDetailPage;
