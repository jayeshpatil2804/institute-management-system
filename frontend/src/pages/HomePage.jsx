import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../features/master/masterSlice';
import { getPublicBranches } from '../features/master/branchSlice';
import { createInquiry, createPublicInquiry } from '../features/transaction/transactionSlice';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import newsService from '../services/newsService';
import { ArrowRight, Trophy, Calendar, ChevronLeft, ChevronRight, Phone, Mail, MapPin, AlertCircle, Quote, Star, Users, BookOpen, ChevronDown } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import HeroCarousel from '../components/ui/HeroCarousel';
import HeroImage1 from '../assets/6.jpg'
import HeroImage2 from '../assets/5.jpg';
import HeroImage3 from '../assets/Accounting_optimized.webp';
import HeroImage4 from '../assets/textileDesign_optimized.webp';
import HeroImage5 from '../assets/GraphicDesigning_optimized.webp';
import HeroImage6 from '../assets/textileDesign_2_optimized.webp';
import Reveal from '../components/Reveal';

// Keep existing generic Carousel for Toppers/Reviews
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const Carousel = ({ items }) => {
  return (
    <div className="relative group px-2 md:px-8">
      <style>
        {`
          .swiper-button-disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        `}
      </style>
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        navigation={{
           nextEl: '.swiper-button-next-custom',
           prevEl: '.swiper-button-prev-custom',
        }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
        className="!pb-12 !pt-4 !px-2"
      >
        {items.map((item, index) => (
          <SwiperSlide key={index} className="h-auto flex items-stretch justify-center">
               <div className="flex justify-center items-center w-full">
                 <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center border-t-4 border-accent relative transform hover:scale-105 transition-transform duration-300">
                    <div className="absolute top-4 right-6 text-yellow-400 opacity-20"><Quote size={40} /></div>
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-4 border-gray-50 shadow-inner">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{item.name}</h3>
                    <p className="text-primary font-medium text-sm mb-3 uppercase tracking-wide">{item.course}</p>
                    <div className="bg-blue-50 py-2 rounded-lg mx-6">
                         <div className="text-3xl font-black text-accent">{item.percentage}%</div>
                         <div className="text-[10px] text-gray-500 font-semibold uppercase">Score Achieved</div>
                    </div>
                 </div>
               </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom Navigation Buttons */}
      <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 text-gray-800 p-3 rounded-full shadow-lg hover:bg-accent hover:text-white transition-all z-20 cursor-pointer border border-gray-100 hidden md:block group-hover:block">
        <ChevronLeft size={24} />
      </button>
      <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 text-gray-800 p-3 rounded-full shadow-lg hover:bg-accent hover:text-white transition-all z-20 cursor-pointer border border-gray-100 hidden md:block group-hover:block">
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { courses } = useSelector((state) => state.master);
    const { branches } = useSelector((state) => state.branch);
    const [captcha, setCaptcha] = useState('');
    const [userCaptcha, setUserCaptcha] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const [latestNews, setLatestNews] = useState([]); 
    const [newsLoading, setNewsLoading] = useState(true);
  
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      state: '',
      city: '',
      course: '',
      branchId: '',
      message: ''
    });
  
    const generateCaptcha = () => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let result = '';
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setCaptcha(result);
    };
  
    useEffect(() => {
      dispatch(fetchCourses());
      dispatch(getPublicBranches());
      generateCaptcha();
      fetchLatestNews();
    }, [dispatch]);

    const fetchLatestNews = async () => {
        try {
            const data = await newsService.getPublicNews();
            // Sort by release date descending
            const sortedData = [...data].sort((a,b) => new Date(b.releaseDate) - new Date(a.releaseDate));
            setLatestNews(sortedData.slice(0, 3)); // Only take top 3
        } catch (error) {
            console.error("Failed to load news", error);
        } finally {
            setNewsLoading(false);
        }
    };
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (userCaptcha !== captcha) {
        toast.error('Invalid Security Code!');
        return;
      }
  
      if (!formData.name || !formData.phone || !formData.state || !formData.city || !formData.course || !formData.branchId) {
        toast.error('Please fill all required fields (*)!');
        return;
      }
  
      setFormLoading(true);
      try {
        const payload = {
          firstName: formData.name,
          contactStudent: formData.phone,
          email: formData.email,
          state: formData.state,
          city: formData.city,
          interestedCourse: formData.course,
          branchId: formData.branchId,
          remarks: formData.message,
          source: 'QuickContact',
          status: 'Pending'
        };
        
        await dispatch(createPublicInquiry(payload)).unwrap();
        
        toast.success("Inquiry Submitted Successfully! We'll contact you soon.");
        setFormData({
          name: '',
          email: '',
          phone: '',
          state: '',
          city: '',
          course: '',
          branchId: '',
          message: ''
        });
        setUserCaptcha('');
        generateCaptcha();
  
      } catch (error) {
        toast.error(error.message || 'Failed to submit inquiry');
      } finally {
        setFormLoading(false);
      }
    };
  
    const heroImages = [
      { image: HeroImage3 },
      { image: HeroImage4},
      { image: HeroImage5},
      { image: HeroImage6}
    ];
  
    // Dummy Data for Toppers - Ideally this should also come from an API
    const toppers = [
      { name: "Priya Patel", percentage: "98.5", course: "Full Stack Development", image: "https://placehold.co/600x400/png?text=Priya+Patel" },
      { name: "Rahul Sharma", percentage: "97.2", course: "Data Science & AI", image: "https://placehold.co/600x400/png?text=Rahul+Sharma" },
      { name: "Amit Kumar", percentage: "96.8", course: "Cyber Security", image: "https://placehold.co/600x400/png?text=Amit+Kumar" },
      { name: "Sneha Gupta", percentage: "95.5", course: "UI/UX Design", image: "https://placehold.co/600x400/png?text=Sneha+Gupta" },
      { name: "Vikram Singh", percentage: "94.9", course: "Digital Marketing", image: "https://placehold.co/600x400/png?text=Vikram+Singh" },
      { name: "Anjali Mehta", percentage: "93.7", course: "Web Development", image: "https://placehold.co/600x400/png?text=Anjali+Mehta" },
    ];
  
    return (
      <div className="w-full">
        {/* 1. New Hero Carousel */}
        <HeroCarousel items={heroImages} />

        {/* 1.b Wide Hero Images Section - Zigzag Layout */}
        <div className="w-full bg-slate-50 py-16 space-y-16">
            
            {/* Row 1: Image Left, Text Right */}
            <div className="container mx-auto px-4">
              <Reveal>
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                     <div className="w-full lg:w-1/2">
                        <div className="relative group overflow-hidden rounded-2xl shadow-2xl border-4 border-white">
                            <img 
                                src={HeroImage2} 
                                alt="Student Campus Life" 
                                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                     </div>
                     <div className="w-full lg:w-1/2 space-y-6">
                        <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary font-bold text-sm uppercase tracking-wider">
                            Message For All Of You By Smart Group
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                            "Do The Time Safe, Money Safe Automatically Life Safe" <br/>
                            {/* <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Learning Environment</span> */}
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed font-rozha text-xl">
                            " बच्चो की तकनिकी शिक्षा ही आने वाले भारत का भविष्य है "
                        </p>
                        <div className="pt-4">
                            <button className="px-8 py-3 bg-white border-2 border-gray-900 text-gray-900 font-bold rounded-xl hover:bg-gray-900 hover:text-white transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                Managing Director
                            </button>
                        </div>
                     </div>
                </div>
              </Reveal>
            </div>

            {/* Row 2: Text Left, Image Right (on Desktop) */}
            <div className="container mx-auto px-4">
              <Reveal>
                <div className="flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-12">
                     <div className="w-full lg:w-1/2 space-y-6">
                        <div className="inline-block px-4 py-2 bg-accent/10 rounded-full text-accent font-bold text-sm uppercase tracking-wider">
                            Our Heritage
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                            Building Leaders <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Since 18+ Years</span>
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            With over a decade of excellence in education, we have shaped the careers of thousands of students. Our alumni are working in top companies across the globe, a testament to our quality education and industry-focused curriculum. Be a part of our legacy.
                        </p>
                         <div className="pt-4">
                            {/* <button className="px-8 py-3 bg-white border-2 border-gray-900 text-gray-900 font-bold rounded-xl hover:bg-gray-900 hover:text-white transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                                Our History
                            </button> */}
                        </div>
                     </div>
                     <div className="w-full lg:w-1/2">
                         <div className="relative group overflow-hidden rounded-2xl shadow-2xl border-4 border-white">
                            <img 
                                src={HeroImage1} 
                                alt="Institute Building" 
                                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" 
                            />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                     </div>
                </div>
              </Reveal>
            </div>

        </div>
  
        {/* 2. Welcome / About Section */}
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <Reveal>
            <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
                
                <h4 className="text-accent font-bold uppercase tracking-widest text-sm mb-4">Excellence in Education</h4>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                  Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Futures</span>, <br/>
                  Transforming <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Lives</span>.
                </h2>
                <div className="w-20 h-1.5 bg-accent rounded-full mb-8"></div>
                
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  Welcome to <span className="font-bold text-gray-800">Smart Institute</span>, where potential meets opportunity. For over a decade, we have been at the forefront of providing industry-relevant education that bridges the gap between academic learning and professional requirements.
                </p>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Our comprehensive curriculum, experienced faculty, and strong industry connects ensure that our students are not just graduates, but future leaders ready to make an impact.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                     {/* 10000+ Alumni Network - Removed */}
                    
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                            <Star size={24} />
                        </div>
                        <div>
                            <div className="font-bold text-gray-900">18+ Years</div>
                            <div className="text-xs text-gray-500">Of Excellence</div>
                        </div>
                    </div>
                </div>

                <a href="/about-us" className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary transition-colors hover:shadow-lg">
                  Learn More About Us <ArrowRight size={18} />
                </a>
            </div>
            </Reveal>

            <Reveal delay={0.4}>
            <div className="relative">
                <div className="grid grid-cols-1 gap-5"> {/* Changed to single column/simplified grid since items removed */}
                     {/* Best Institute Award & 100% Placement - Removed */}

                     <div className="space-y-4 pt-8 md:pt-0">
                        <div className="bg-white p-6 rounded-2xl shadow-xl border-b-4 border-accent transform hover:-translate-y-1 transition-transform cursor-default">
                             <BookOpen className="text-primary mb-4" size={40} />
                             <h3 className="font-bold text-xl mb-2">Industry Curriculum</h3>
                             <p className="text-sm text-gray-500">Courses designed by experts to meet current market demands.</p>
                        </div>
                        <div className="bg-gray-100 p-6 rounded-2xl shadow-inner flex flex-col justify-center items-center text-center">
                             <div className="font-black text-6xl text-gray-200">20+</div>
                             <div className="font-bold text-gray-500">Professional Courses</div>
                        </div>
                     </div>
                </div>
            </div>
            </Reveal>

          </div>
        </div>
  
        {/* 3. Quick Contact (Inquiry Form) */}
        <div className="bg-slate-50 py-20 relative overflow-hidden">
             {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-100/40 rounded-full blur-[80px] -translate-x-1/2 translate-y-1/3 pointer-events-none"></div>

          <div className="container mx-auto px-4 relative z-10">
            <Reveal>
            <div className="max-w-6xl mx-auto bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-100">
              {/* Left Info Panel */}
              <div className="lg:w-2/5 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                <div className="relative z-10">
                  <h3 className="text-3xl md:text-4xl font-black mb-6">Get In Touch</h3>
                  <p className="text-gray-300 text-lg mb-10 leading-relaxed font-light">
                    Have questions about our courses or admissions? Fill out the form and our career counselors will assist you.
                  </p>
                  
                  <div className="space-y-8">
                     <div className="flex items-start gap-4 group">
                        <div className="p-3 bg-white/10 rounded-xl group-hover:bg-accent group-hover:text-white transition-all backdrop-blur-sm shrink-0">
                          <Phone size={24} />
                        </div> 
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Call Us</p>
                            <p className="font-bold text-lg">+91-96017-49300</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-4 group">
                         <div className="p-3 bg-white/10 rounded-xl group-hover:bg-accent group-hover:text-white transition-all backdrop-blur-sm shrink-0">
                          <Mail size={24} /> 
                         </div>
                         <div>
                            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Email Us</p>
                            <p className="font-bold text-lg break-all">info@smartinstitute.co.in</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-4 group">
                        <div className="p-3 bg-white/10 rounded-xl group-hover:bg-accent group-hover:text-white transition-all backdrop-blur-sm shrink-0">
                          <MapPin size={24} /> 
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Visit Us</p>
                            <p className="font-bold text-lg leading-snug">Surat, Gujarat</p>
                        </div>
                     </div>
                  </div>
                </div>

                <div className="relative z-10 mt-12 pt-8 border-t border-white/10">
                    <p className="text-xs text-gray-400">© Smart Institute. All rights reserved.</p>
                </div>
              </div>
              
              {/* Right Form Panel */}
              <div className="lg:w-3/5 p-8 md:p-12 bg-white">
                <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Admission Inquiry</h3>
                    <p className="text-gray-500">Take the first step towards your career.</p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Full Name <span className="text-red-500">*</span></label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter Your Full Name Here..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium" required />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Mobile Number <span className="text-red-500">*</span></label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter Your Mobile Number Here..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium" required />
                    </div>
                  </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter Your Email Here..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">City <span className="text-red-500">*</span></label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Enter City" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium" required/>
                        </div>
                   </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                             <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">State <span className="text-red-500">*</span></label>
                             <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="Enter State" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium" required />
                        </div>
                         {/* Branch Selection - Dynamic */}
            <div>
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Select Branch <span className="text-red-500">*</span></label>
              <div className="relative">
                <select 
                  name="branchId"
                  value={formData.branchId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none text-gray-700 font-medium cursor-pointer hover:bg-white"
                  required
                >
                  <option value="">Choose a Branch...</option>
                  {branches && branches.map(branch => (
                      <option key={branch._id} value={branch._id}>{branch.name} ({branch.city})</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <ChevronDown size={20} />
                </div>
              </div>
            </div>
                    </div>
                  
                  <div className="space-y-1.5">
                     <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Interested Course <span className="text-red-500">*</span></label>
                     <select name="course" value={formData.course} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-700 font-medium cursor-pointer hover:bg-white transition-colors" required>
                        <option value="">Select a Course...</option>
                        {courses.map(course => (
                            <option key={course._id} value={course._id}>{course.name}</option>
                        ))}
                     </select>
                  </div>
                  
                  <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between">
                         <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Security Code <span className="text-red-500">*</span></label>
                         <button type="button" onClick={generateCaptcha} className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                             Refresh Code
                         </button>
                      </div>
                      <div className="flex gap-3 items-stretch">
                        <div className="bg-gray-100 border border-gray-300 rounded-xl px-4 flex items-center justify-center min-w-[100px] select-none">
                            <span className="text-2xl font-mono font-bold text-gray-600 tracking-widest">{captcha}</span>
                        </div>
                        <input type="text" value={userCaptcha} onChange={(e) => setUserCaptcha(e.target.value)} placeholder="Type code here" className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium uppercase placeholder:normal-case" required />
                      </div>
                  </div>

                  <button disabled={formLoading} className="w-full bg-accent text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-600/40 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed mt-6 text-lg tracking-wide">
                    {formLoading ? 'Submitting Application...' : 'Submit Inquiry Now'}
                  </button>
                </form>
              </div>
            </div>
            </Reveal>
          </div>
        </div>
  
        {/* 4. Student Success Stories (Toppers) */}
        <div className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <Reveal>
              <h4 className="text-accent font-bold uppercase tracking-widest text-sm mb-3">Hall of Fame</h4>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Student <span className="text-primary">Success Stories</span></h2>
              <p className="text-gray-500 mb-12 max-w-2xl mx-auto text-lg">Celebrating the academic excellence and outstanding achievements of our brilliant students who have made us proud.</p>
              <Carousel items={toppers} />
            </Reveal>
          </div>
        </div>
  
        {/* 5. Latest News */}
        <div className="bg-slate-50 py-20 border-t border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
               <div>
                 <h4 className="text-accent font-bold uppercase tracking-widest text-sm mb-3">Campus Updates</h4>
                 <h2 className="text-3xl md:text-4xl font-black text-gray-900">Latest <span className="text-primary">News & Events</span></h2>
               </div>
               <a href="/news" className="text-primary font-bold hover:text-blue-700 flex items-center gap-2 group transition-colors">
                 View All News <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
               </a>
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               <Reveal width="col-span-1 md:col-span-2 lg:col-span-3" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {newsLoading ? (
                  Array(3).fill(0).map((_, i) => (
                      <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse h-64">
                          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                  ))
              ) : latestNews.length === 0 ? (
                  <div className="col-span-3 text-center py-12 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
                      <div className="inline-flex justify-center items-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                          <Calendar size={24} className="text-gray-400" />
                      </div>
                      <p className="text-lg font-medium">No recent news available.</p>
                  </div>
              ) : (
                  latestNews.map((item) => (
                    <div key={item._id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col overflow-hidden border border-gray-100 group">
                      <div className="h-1.5 bg-gradient-to-r from-primary to-blue-400 relative"></div>
                      <div className="p-8 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-3 py-1 rounded-full">
                                <Calendar size={12} />
                                <span>{formatDate(item.releaseDate) || "Recent"}</span>
                            </div>
                             {item.isBreaking && (
                                 <div className="bg-red-50 text-red-600 text-[10px] font-black px-2 py-1 rounded uppercase tracking-wide flex items-center gap-1 animate-pulse">
                                    <AlertCircle size={10} /> BREAKING
                                 </div>
                             )}
                        </div>
                        
                        <h3 className="font-bold text-xl mb-3 text-gray-800 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                          {item.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                          {item.smallDetail || item.description?.substring(0, 80) + '...'}
                        </p>
                        
                        <button className="text-sm font-bold text-gray-900 flex items-center gap-2 group/btn self-start">
                            Read More <ChevronRight size={16} className="text-accent group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  ))
              )}
               </Reveal>
             </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default HomePage;
