import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../../features/master/masterSlice';
import { 
  ArrowRight, Clock, Users, Star, CheckCircle,
  Play, Target, Award, TrendingUp, BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';
import Reveal from '../../components/Reveal';

const CoursePage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const filterType = searchParams.get('type'); // Get 'type' from URL

  const { courses, isLoading } = useSelector((state) => state.master);
  const [selectedCategory, setSelectedCategory] = useState(filterType || 'All');

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  useEffect(() => {
    if (filterType) {
      setSelectedCategory(filterType);
    } else {
        setSelectedCategory('All');
    }
  }, [filterType]);
  
  // Extract unique categories from actual data
  const categories = ['All', ...[...new Set(courses.map(c => c.courseType))].filter(Boolean)];

  const filteredCourses = selectedCategory === 'All' 
    ? courses 
    : courses.filter(course => course.courseType === selectedCategory);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    // Update URL without reloading
    if (category === 'All') {
        setSearchParams({});
    } else {
        setSearchParams({ type: category });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary to-blue-800 py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our <span className="text-accent">Courses</span></h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Transform your career with industry-relevant courses designed for success
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                <div className="flex items-center gap-2">
                  <BookOpen size={20} />
                  <span>{courses.length}+ Courses</span>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                <div className="flex items-center gap-2">
                  <Users size={20} />
                  <span>Join Our Community</span>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                <div className="flex items-center gap-2">
                  <Award size={20} />
                  <span>Expert Faculty</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Course Categories & List */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Browse by <span className="text-primary">Category</span></h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Choose from our wide range of course categories</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {isLoading ? (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading courses...</p>
                </div>
            ) : filteredCourses.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-xl text-gray-500 font-medium">No courses found in this category.</p>
                    <button onClick={() => handleCategoryChange('All')} className="mt-4 text-primary hover:underline">View All Courses</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCourses.map((course, index) => (
                    <motion.div 
                      key={course._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all group flex flex-col h-full"
                    >
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        {/* Placeholder Logic: Use course image if available, else a colored placeholder */}
                        <img 
                          src={course.image || `https://placehold.co/600x400/png?text=${encodeURIComponent(course.name)}`} 
                          alt={course.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                        />
                        <div className="absolute top-0 right-0 p-4">
                           <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm uppercase tracking-wider">
                              {course.courseType}
                           </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Link to={`/course/${course._id}`} className="bg-accent text-white p-3 rounded-full hover:bg-orange-600 transition-colors">
                            <Play size={20} />
                          </Link>
                        </div>
                      </div>
                      
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star size={14} className="fill-current" />
                            <Star size={14} className="fill-current" />
                            <Star size={14} className="fill-current" />
                            <Star size={14} className="fill-current" />
                            <Star size={14} className="fill-current" />
                          </div>
                          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{course.shortName}</span>
                        </div>
                        
                        <Link to={`/course/${course._id}`} className="block group-hover:text-primary transition-colors">
                            <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{course.name}</h3>
                        </Link>
                        <p className="text-gray-600 mb-4 text-sm line-clamp-3 flex-grow">{course.smallDescription || course.description || "Unlock your potential with this comprehensive course designed for career growth."}</p>
                        
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock size={16} className="text-primary"/> 
                              <span className="font-medium">Duration:</span> {course.duration} {course.durationType}
                          </div>
                           {/* We can add more specific details if available in backend schema later */}
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                          <div>
                            <div className="text-lg font-bold text-primary">₹{course.courseFees}</div>
                            <div className="text-xs text-gray-500">Total Fees</div>
                          </div>
                          <Link to={`/course/${course._id}`} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold shadow-lg shadow-blue-500/20">
                            View Details
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
            )}
          </Reveal>
        </div>
      </div>

      {/* Course Benefits */}
      <div className="py-20 bg-gradient-to-br from-primary to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Why Choose <span className="text-accent">Our Courses?</span></h2>
              <p className="text-blue-100 max-w-2xl mx-auto">Benefits that make our courses stand out</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-accent rounded-full flex items-center justify-center">
                  <Target size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Industry-Relevant</h3>
                <p className="text-blue-100">Courses designed with industry experts to meet current market demands</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-accent rounded-full flex items-center justify-center">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Expert Faculty</h3>
                <p className="text-blue-100">Learn from experienced professionals with real-world expertise</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-accent rounded-full flex items-center justify-center">
                  <Award size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Certification</h3>
                <p className="text-blue-100">Get industry-recognized certificates upon course completion</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-accent rounded-full flex items-center justify-center">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Career Support</h3>
                <p className="text-blue-100">100% placement assistance and career guidance</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
