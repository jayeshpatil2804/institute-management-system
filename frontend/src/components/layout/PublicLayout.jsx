import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourses } from '../../features/master/masterSlice';
import { 
  Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Youtube,
  LogIn, UserPlus, ArrowRight, Menu, X, MapPin, ChevronDown, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImage from '../../assets/logo2.png';

const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // For Mobile
  const [hoverDropdown, setHoverDropdown] = useState(null); // For Desktop
  const location = useLocation();
  const dispatch = useDispatch();

  // Fetch courses for dynamic dropdown
  const { courses, isLoading } = useSelector((state) => state.master);

  useEffect(() => {
    if (courses.length === 0 && !isLoading) {
      dispatch(fetchCourses());
    }
  }, [dispatch, courses.length, isLoading]);
  
  // Extract unique Course Types and group courses
  const courseGroups = courses.reduce((acc, course) => {
    const type = course.courseType || 'Other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(course);
    return acc;
  }, {});
  
  const courseTypes = Object.keys(courseGroups);

  const menuItems = [
    { name: 'Home', path: '/' },
    { 
      name: 'About Us', 
      isDropdown: true,
      subItems: [
        { name: 'About Smart', path: '/about-us#smart' },
        { name: 'Mission', path: '/about-us#mission' },
        { name: 'Vision', path: '/about-us#vision' },
      ]
    },
    { name: 'Why Smart', path: '/why-smart' },
    { 
      name: 'Course', 
      isDropdown: true, 
      isMegaMenu: true, // Marker for Mega Menu
    },
    { name: 'Facilities', path: '/facilities' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Franchise', path: '/franchise' },
    { name: 'Contact', path: '/contact' },
    { name: 'Blog', path: '/blog' },
    { name: 'Feedback', path: '/feedback' }
  ];

  // Helper to determine if a path is active
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path.split('?')[0]);
  };

  const isDropdownActive = (subItems) => {
      if(!subItems) return false;
    return subItems.some(sub => {
       const cleanPath = sub.path.split('#')[0].split('?')[0];
       return location.pathname === cleanPath || (cleanPath !== '/' && location.pathname.startsWith(cleanPath));
    });
  };

  return (
    <nav className="bg-blue-900 text-white shadow-sm sticky top-0 z-50 font-sans border-b border-blue-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between md:justify-center items-center h-20 relative">
           
           {/* Mobile Logo (Visible only on mobile since main logo is in header) */}
           <div className="md:hidden flex-shrink-0 bg-white/95 backdrop-blur-sm p-1.5 rounded-lg shadow-lg shadow-black/10 border border-white/20 transform hover:scale-105 transition-all">
               <img src={logoImage} alt="Logo" className="h-9 w-auto object-contain" />
           </div>

           {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-white hover:bg-blue-800 rounded-lg transition-colors absolute right-0" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Desktop Menu - Centered */}
          <div className="hidden md:flex items-center justify-center gap-1">
            {menuItems.map((item, index) => (
              <div key={index} className="relative group"
                   onMouseEnter={() => setHoverDropdown(index)}
                   onMouseLeave={() => setHoverDropdown(null)}
              >
                  {item.isDropdown ? (
                      <div>
                          <button className={`flex items-center gap-1 px-4 py-3 text-sm font-bold uppercase tracking-wider hover:text-yellow-300 transition-colors border-b-2 border-transparent hover:border-yellow-300 ${ (item.subItems && isDropdownActive(item.subItems)) || (item.isMegaMenu && location.pathname.includes('/course')) ? 'text-yellow-300 border-yellow-300' : 'text-white'}`}>
                              {item.name} <ChevronDown size={14} className={`transform transition-transform duration-200 ${hoverDropdown === index ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {/* Dropdown Content */}
                          <AnimatePresence>
                              {hoverDropdown === index && (
                                  <motion.div
                                      initial={{ opacity: 0, y: 15 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: 15 }}
                                      transition={{ duration: 0.2 }}
                                      className={`absolute left-1/2 -translate-x-1/2 mt-0 bg-white text-gray-800 shadow-2xl rounded-xl overflow-hidden border border-gray-100 z-50 ${item.isMegaMenu ? 'w-[800px]' : 'w-56'}`}
                                      // Note: Using absolute positioning relative to the parent nav item
                                      style={item.isMegaMenu ? { width: '900px', maxWidth: '90vw' } : {}}
                                  >
                                      {item.isMegaMenu ? (
                                        // MEGA MENU CONTENT
                                        <div className="p-8 grid grid-cols-4 gap-8 bg-white">
                                            {courseTypes.length > 0 ? courseTypes.map((type, idx) => (
                                                <div key={idx} className="space-y-4">
                                                    <h4 className="font-black text-primary uppercase text-sm border-b-2 border-primary/10 pb-2 tracking-widest">{type}</h4>
                                                    <ul className="space-y-2">
                                                        {courseGroups[type].map(course => (
                                                            <li key={course._id}>
                                                                <Link 
                                                                    to={`/course/${course._id}`} 
                                                                    className="block text-sm text-gray-600 hover:text-accent hover:translate-x-1 transition-all font-medium"
                                                                >
                                                                    {course.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )) : (
                                                <div className="col-span-4 text-center py-10 text-gray-400">Loading courses...</div>
                                            )}
                                        </div>
                                      ) : (
                                        // STANDARD DROPDOWN
                                        <div className="py-2">
                                            {item.subItems.map((sub, subIdx) => (
                                              <Link 
                                                key={subIdx} 
                                                to={sub.path} 
                                                className={`block px-6 py-3 text-sm font-semibold hover:bg-blue-50 hover:text-primary transition-colors ${location.pathname === sub.path.split('#')[0].split('?')[0] ? 'text-primary bg-blue-50' : 'text-gray-600'}`}
                                              >
                                                  {sub.name}
                                              </Link>
                                            ))}
                                        </div>
                                      )}
                                  </motion.div>
                              )}
                          </AnimatePresence>
                      </div>
                  ) : (
                      <Link to={item.path}
                          className={`flex items-center gap-1 px-4 py-3 text-sm font-bold uppercase tracking-wider hover:text-yellow-300 transition-colors border-b-2 border-transparent hover:border-yellow-300 ${isActive(item.path) ? 'text-yellow-300 border-yellow-300' : 'text-white'}`}
                      >
                          {item.name}
                      </Link>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden fixed inset-0 z-50 bg-white"
          >
            <div className="p-4 flex justify-between items-center border-b border-gray-100">
                <img src={logoImage} alt="Logo" className="h-10 w-auto" />
                <button onClick={() => setIsOpen(false)} className="p-2 bg-gray-100 rounded-full">
                    <X size={24} />
                </button>
            </div>
            
            <div className="flex flex-col p-4 space-y-2 overflow-y-auto h-[calc(100vh-80px)]">
              {menuItems.map((item, index) => (
                <div key={index}>
                    {item.isDropdown ? (
                        <div>
                            <button 
                                onClick={() => setActiveDropdown(activeDropdown === index ? null : index)}
                                className={`w-full flex items-center justify-between px-4 py-4 text-base font-bold border-b border-gray-100 ${(item.subItems && isDropdownActive(item.subItems)) || (item.isMegaMenu && location.pathname.includes('/course')) ? 'text-primary bg-blue-50/50' : 'text-gray-800'}`}
                            >
                                {item.name}
                                <ChevronDown size={16} className={`transition-transform duration-300 ${activeDropdown === index ? 'rotate-180' : ''}`}/>
                            </button>
                            <AnimatePresence>
                                {activeDropdown === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="bg-gray-50 px-4 py-2"
                                    >
                                        {item.isMegaMenu ? (
                                            <div className="space-y-4 py-2">
                                                 {courseTypes.map((type, idx) => (
                                                    <div key={idx}>
                                                        <h5 className="font-bold text-xs uppercase text-gray-500 mb-2">{type}</h5>
                                                        <ul className="space-y-2 pl-2 border-l-2 border-primary/20">
                                                            {courseGroups[type].map(course => (
                                                                <li key={course._id}>
                                                                    <Link to={`/course/${course._id}`} className="block text-sm text-gray-700 py-1" onClick={() => setIsOpen(false)}>{course.name}</Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                 ))}
                                            </div>
                                        ) : (
                                            item.subItems.map((sub, subIdx) => (
                                                <Link 
                                                    key={subIdx} 
                                                    to={sub.path} 
                                                    className="block py-3 text-sm font-medium text-gray-600 border-b border-gray-100 last:border-0"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    {sub.name}
                                                </Link>
                                            ))
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link 
                           to={item.path} 
                           className={`block px-4 py-4 text-base font-bold border-b border-gray-100 ${isActive(item.path) ? 'text-primary bg-blue-50/50' : 'text-gray-800'}`} 
                           onClick={() => setIsOpen(false)}
                        >
                            {item.name}
                        </Link>
                    )}
                </div>
              ))}
              
              <div className="pt-6 grid grid-cols-1 gap-3">
                  <Link to="/login" className="flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-bold" onClick={() => setIsOpen(false)}>
                      <LogIn size={18} /> Login Portal
                  </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const PublicLayout = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* 1. Slim Top Header */}
      <div className="bg-gray-100 text-black py-2.5 text-xs font-medium tracking-wide">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
          {/* Contact Info */}
          <div className="flex items-center justify-center w-full md:w-auto gap-6 uppercase tracking-wider text-[11px]">
            <a href="tel:+919601749300" className="flex items-center gap-2 hover:text-accent transition-colors"><Phone size={12} className="text-accent" /> Call Us</a>
            <span className="hidden sm:inline text-gray-400">|</span>
            <a href="mailto:info@smartinstitute.co.in" className="flex items-center gap-2 hover:text-accent transition-colors"><Mail size={12} className="text-accent" /> Email Us</a>
          </div>

          {/* Social & Auth */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex gap-4 pr-6 border-r border-gray-700">
              <a href="https://www.facebook.com/smartinstituteindia" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-transform hover:-translate-y-0.5"><Facebook size={14} /></a>
              <a href="#" className="hover:text-pink-500 transition-transform hover:-translate-y-0.5"><Instagram size={14} /></a>
              <a href="https://www.youtube.com/channel/UCFfLzGu6VS4gOTZkJRtmfkg" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-transform hover:-translate-y-0.5"><Youtube size={14} /></a>
            </div>
            
            <div className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-4">
                 <Link to="/contact" className="hover:text-accent transition-colors">Support</Link>
                 <span className="text-gray-600">/</span>
                {user ? (
                    <Link to="/home" className="flex items-center gap-2 text-accent hover:text-white transition-colors">
                        DASHBOARD <ArrowRight size={12} />
                    </Link>
                ) : (
                    <Link to="/login" className="hover:text-accent transition-colors flex items-center gap-1">
                        <LogIn size={12} /> Login
                    </Link>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Logo & Branding Area */}
      <div className="bg-white py-2">
        <div className="container mx-auto px-4">
           <div className="flex flex-col md:flex-row items-center justify-between gap-6">
             {/* Logo */}
             <div className="flex-shrink-0 hidden md:block">
                <Link to="/">
                    <img src={logoImage} alt="Smart Institute Logo" className="h-20 md:h-24 w-auto object-contain" />
                </Link>
             </div>
             
             {/* Slogan */}
             <div className="flex-grow flex flex-col items-center justify-center text-center space-y-1">
                  <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                    <span className="text-gray-800">सपने जो</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 text-3xl md:text-5xl font-extrabold mx-1 font-sans">SMART</span> <span className="text-gray-800">बना दे</span>
                  </h3>
             </div>

             {/* Right Side Visual/CTA (Optional) */}
             <div className="hidden md:flex items-center gap-3">
                 <div className="text-right hidden lg:block">
                     <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Admissions Open</p>
                     <p className="text-lg font-bold text-gray-900">2025-2026 Batch</p>
                 </div>
                 <Link to="/online-admission" className="bg-primary text-white px-6 py-3.5 rounded-xl font-bold uppercase tracking-wider shadow-lg hover:shadow-primary/30 hover:-translate-y-1 transition-all flex items-center gap-2 text-sm animate-pulse-subtle">
                      <UserPlus size={18} /> Enroll Now
                  </Link>
             </div>
           </div>
        </div>
      </div>

      {/* 3. Public Navbar (Centered & Light Theme) */}
      <PublicNavbar />

      {/* 4. Main Page Content */}
      <div className="flex-grow">
        <Outlet />
      </div>

      {/* 5. Footer */}
      <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t-4 border-accent mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <img src={logoImage} alt="Smart Institute Logo" className="h-10 w-auto object-contain bg-white rounded-lg p-1" />
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Disclaimer Smart Institute © 2026 Developed by Smart Institute Team All Logos / Characters are the Property of their Respective Organisation.
              </p>
              <div className="flex gap-4">
                 <a href="https://www.facebook.com/smartinstituteindia" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-primary transition-colors"><Facebook size={18} /></a>
                 <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-sky-400 transition-colors flex items-center justify-center font-bold text-white w-[34px] h-[34px]">X</a>
                 <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-pink-500 transition-colors"><Instagram size={18} /></a>
                 <a href="https://www.youtube.com/channel/UCFfLzGu6VS4gOTZkJRtmfkg" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-lg hover:bg-red-600 transition-colors"><Youtube size={18} /></a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-6 border-l-4 border-accent pl-3">Navigation</h3>
              <ul className="space-y-3 text-sm">
                <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
                <li><Link to="/about-us" className="hover:text-accent transition-colors">About Us</Link></li>
                <li><Link to="/course" className="hover:text-accent transition-colors">Courses</Link></li>
                <li><Link to="/gallery" className="hover:text-accent transition-colors">Gallery</Link></li>
                <li><Link to="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
              </ul>
            </div>

             <div>
              <h3 className="text-white font-bold text-lg mb-6 border-l-4 border-accent pl-3">Why SMART?</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-accent transition-colors">Expert Faculty</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Digital Classrooms</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">100% Placement</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Practical Learning</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-6 border-l-4 border-accent pl-3">Contact Us</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin size={20} className="text-accent shrink-0" />
                  <span>1st & 2nd Floor, 50-kubernagar, Opp. Baba Baijnath Mandir, Nilgiri Road, Ass-Pass Circle, Godadra Surat - 395010</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-accent shrink-0" />
                  <a href="tel:+919601749300" className="hover:text-accent transition-colors">+91-96017-49300</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-accent shrink-0" />
                  <a href="mailto:info@smartinstitute.co.in" className="hover:text-accent transition-colors">info@smartinstitute.co.in</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
             Copyright © 2013 - 2026 Smart Institute. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;