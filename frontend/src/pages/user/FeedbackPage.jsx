import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, 
  ArrowRight, Send, Star, MessageSquare, CheckCircle, AlertCircle,
  ThumbsUp, ThumbsDown, User, BookOpen, Award, Users
} from 'lucide-react';
import { motion } from 'framer-motion';

// Import logo from assets
import logoImage from '../../assets/logo2.png';
import Reveal from '../../components/Reveal';

const FeedbackPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'general',
    rating: 5,
    feedback: '',
    recommendations: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(5);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    setFormData({
      ...formData,
      rating: newRating
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Feedback submitted:', formData);
    setSubmitted(true);
    // Handle form submission here
  };

  const feedbackCategories = [
    { value: 'general', label: 'General Feedback' },
    { value: 'course', label: 'Course Content' },
    { value: 'faculty', label: 'Faculty Performance' },
    { value: 'infrastructure', label: 'Infrastructure & Facilities' },
    { value: 'placement', label: 'Placement Support' },
    { value: 'administration', label: 'Administrative Services' },
    { value: 'complaint', label: 'Complaint' },
    { value: 'suggestion', label: 'Suggestion' }
  ];

  const testimonials = [
    {
      name: 'Rahul Sharma',
      course: 'Full Stack Development',
      rating: 5,
      message: 'Excellent training and placement support. The faculty is very knowledgeable and helpful.',
      date: '2024-01-10'
    },
    {
      name: 'Priya Patel',
      course: 'Digital Marketing',
      rating: 5,
      message: 'Great learning experience with practical exposure. Got placed in a top company through campus placement.',
      date: '2024-01-08'
    },
    {
      name: 'Amit Kumar',
      course: 'Data Science',
      rating: 4,
      message: 'Comprehensive curriculum and good infrastructure. Would recommend to others.',
      date: '2024-01-05'
    },
    {
      name: 'Neha Singh',
      course: 'UI/UX Design',
      rating: 5,
      message: 'Amazing faculty and state-of-the-art facilities. The practical projects really helped in building my portfolio.',
      date: '2024-01-03'
    }
  ];

  const stats = [
    { number: '4.8', label: 'Average Rating', icon: <Star className="text-accent" size={24} /> },
    { number: '2000+', label: 'Feedbacks Received', icon: <MessageSquare className="text-accent" size={24} /> },
    { number: '95%', label: 'Satisfaction Rate', icon: <ThumbsUp className="text-accent" size={24} /> },
    { number: '24h', label: 'Response Time', icon: <AlertCircle className="text-accent" size={24} /> }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-white font-sans">
        {/* Headers */}
        <div className="bg-gray-900 text-gray-300 py-1.5 text-xs">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><Phone size={12} /> +91-96017-49300</span>
              <span className="flex items-center gap-1"><Mail size={12} /> info@smartinstitute.co.in</span>
            </div>
          </div>
        </div>

        <div className="bg-white py-4 shadow-sm relative z-10">
          <div className="container mx-auto px-4 flex items-center justify-center">
             <div className="flex items-center gap-4">
               <img src={logoImage} alt="Smart Institute Logo" className="h-16 w-auto object-contain" />
               <div className="relative">
                  <center><h3 className="text-base md:text-lg text-accent font-bold tracking-wide uppercase">सपने जो SMART बना दे</h3></center>
               </div>
             </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="text-green-600" size={40} />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
              Your feedback has been submitted successfully. We appreciate your input and will use it to improve our services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/"
                className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Home
              </Link>
              <button 
                onClick={() => setSubmitted(false)}
                className="bg-accent text-white font-bold py-3 px-8 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Submit Another Feedback
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* 4. Hero Section */}
      <div className="relative bg-gradient-to-br from-primary to-blue-800 py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-accent rounded-full flex items-center justify-center">
              <MessageSquare size={40} />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Send <span className="text-accent">Feedback</span></h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Your feedback helps us improve and serve you better
            </p>
          </motion.div>
        </div>
      </div>

      {/* 5. Feedback Stats */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Feedback <span className="text-primary">Statistics</span></h2>
              <p className="text-gray-600 max-w-2xl mx-auto">See what our students and visitors say about us</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* 6. Feedback Form */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Form */}
              <Reveal>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Share Your <span className="text-primary">Experience</span></h2>
                <p className="text-gray-600 mb-8">
                  We value your feedback and strive to improve our services based on your suggestions.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        placeholder="Enter Your Name Here..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        placeholder="Enter Your Email Here..."
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      placeholder="Enter Your Phone Number Here..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Feedback Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    >
                      {feedbackCategories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating *</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingChange(star)}
                          className="transition-colors"
                        >
                          <Star 
                            size={32} 
                            className={star <= rating ? 'text-accent fill-current' : 'text-gray-300'}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-gray-600">({rating}/5)</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Feedback *</label>
                    <textarea
                      name="feedback"
                      value={formData.feedback}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
                      placeholder="Please share your detailed feedback..."
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recommendations for Improvement</label>
                    <textarea
                      name="recommendations"
                      value={formData.recommendations}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
                      placeholder="Any suggestions for improvement..."
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Send size={20} />
                    Submit Feedback
                  </button>
                </form>
              </div>
              </Reveal>
              
              {/* Recent Testimonials */}
              <Reveal delay={0.2}>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Recent <span className="text-primary">Testimonials</span></h2>
                <p className="text-gray-600 mb-8">
                  See what our students and visitors are saying about us
                </p>
                
                <div className="space-y-6">
                  {testimonials.map((testimonial, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-gray-50 p-6 rounded-xl"
                    >
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} size={16} className="text-accent fill-current" />
                        ))}
                        {[...Array(5 - testimonial.rating)].map((_, i) => (
                          <Star key={i} size={16} className="text-gray-300" />
                        ))}
                      </div>
                      <p className="text-gray-700 mb-4 italic">"{testimonial.message}"</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{testimonial.name}</p>
                          <p className="text-sm text-gray-600">{testimonial.course}</p>
                        </div>
                        <p className="text-xs text-gray-500">{new Date(testimonial.date).toLocaleDateString()}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Why Feedback Matters */}
      <div className="py-20 bg-gradient-to-br from-primary to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Why Your <span className="text-accent">Feedback Matters</span></h2>
              <p className="text-blue-100 max-w-2xl mx-auto">How your feedback helps us improve</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl text-center">
                <Award className="text-accent mb-4 mx-auto" size={32} />
                <h3 className="text-xl font-bold mb-3">Improve Quality</h3>
                <p className="text-blue-100">Your feedback helps us enhance the quality of our courses and services</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl text-center">
                <Users className="text-accent mb-4 mx-auto" size={32} />
                <h3 className="text-xl font-bold mb-3">Student Experience</h3>
                <p className="text-blue-100">We use your input to create a better learning environment</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl text-center">
                <BookOpen className="text-accent mb-4 mx-auto" size={32} />
                <h3 className="text-xl font-bold mb-3">Course Development</h3>
                <p className="text-blue-100">Your suggestions guide us in developing new and relevant courses</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
