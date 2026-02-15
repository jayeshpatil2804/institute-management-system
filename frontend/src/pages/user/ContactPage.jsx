import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, 
  ArrowRight, Send, Clock, MessageSquare, Youtube, Headphones,
  Building, Users, Award, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

// Import logo from assets
import logoImage from '../../assets/logo2.png';
import Reveal from '../../components/Reveal';

const ContactPage = () => {
  const [activeMap, setActiveMap] = useState('head'); // 'head' or 'branch'
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    state: '',
    city: '',
    branch: '',
    subject: '',
    message: '',
    securityCode: ''
  });

  const [generatedCode, setGeneratedCode] = useState(Math.floor(1000 + Math.random() * 9000).toString());

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.securityCode !== generatedCode) {
      alert('Invalid Security Code! Please try again.');
      setGeneratedCode(Math.floor(1000 + Math.random() * 9000).toString());
      setFormData({...formData, securityCode: ''});
      return;
    }

    const { name, email, phone, state, city, branch, subject, message } = formData;
    
    // Construct mailto link
    const mailtoLink = `mailto:bhestanbranch@smartinstitute.co.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nState: ${state}\nCity: ${city}\nBranch: ${branch}\n\nMessage:\n${message}`
    )}`;
    
    window.location.href = mailtoLink;
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      state: '',
      city: '',
      branch: '',
      subject: '',
      message: '',
      securityCode: ''
    });
    setGeneratedCode(Math.floor(1000 + Math.random() * 9000).toString());
  };

  const contactInfo = [
    {
      icon: <MapPin className="text-accent" size={24} />,
      title: 'Head Office',
      details: [
        '1st & 2nd Floor, 50-kubernagar,',
        'Opp. Baba Baijnath Mandir,',
        'Nilgiri Road, Ass-Pass Circle,',
        'Godadra Surat - 395010',
        'Gujarat, India'
      ]
    },
    {
      icon: <Phone className="text-accent" size={24} />,
      title: 'Phone Numbers',
      details: [
        '+91-96017-49300',
        '+91-98988-30409',
        '+91-96017-49300 (Franchise)'
      ]
    },
    {
      icon: <Mail className="text-accent" size={24} />,
      title: 'Email Addresses',
      details: [
        'info@smartinstitute.co.in',
        'admission@smartinstitute.co.in',
        'franchise@smartinstitute.co.in'
      ]
    },
    {
      icon: <Youtube className="text-accent" size={24} />,
      title: 'Website',
      details: [
        'www.smartinstituteonline.com',
        'www.smartcampus.in'
      ]
    }
  ];

  const departments = [
    {
      name: 'Admissions',
      email: 'admission@smartinstitute.co.in',
      phone: '+91-96017-49300',
      timing: '9:00 AM - 6:00 PM'
    },
    {
      name: 'Franchise',
      email: 'franchise@smartinstitute.co.in',
      phone: '+91-96017-49300',
      timing: '10:00 AM - 7:00 PM'
    },
    {
      name: 'Technical Support',
      email: 'support@smartinstitute.co.in',
      phone: '+91-98988-30409',
      timing: '24/7 Available'
    },
    {
      name: 'Student Services',
      email: 'students@smartinstitute.co.in',
      phone: '+91-96017-49300',
      timing: '9:00 AM - 8:00 PM'
    }
  ];

  const faqs = [
    {
      question: 'What courses do you offer?',
      answer: 'We offer a wide range of courses including Web Development, Data Science, Digital Marketing, UI/UX Design, Business Analytics, and Mobile App Development.'
    },
    {
      question: 'How can I enroll in a course?',
      answer: 'You can enroll by visiting our campus, calling our admission team, or filling out the online inquiry form on our website.'
    },
    {
      question: 'Do you provide placement assistance?',
      answer: 'Yes, we provide 100% placement assistance to all our students through our dedicated placement cell and industry partnerships.'
    },
    {
      question: 'What are the admission requirements?',
      answer: 'Admission requirements vary by course. Generally, you need to be 10+2 passed for diploma courses and a graduate for degree programs.'
    },
    {
      question: 'Do you offer online classes?',
      answer: 'Yes, we offer both classroom and online learning options for most of our courses to suit different learning preferences.'
    },
    {
      question: 'What is the fee structure?',
      answer: 'Fee structure varies by course duration and type. Please contact our admission team for detailed fee information.'
    }
  ];

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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Contact <span className="text-accent">Us</span></h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Get In Touch With Us
            </p>
          </motion.div>
        </div>
      </div>

      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
           {/* Social Media Navigation */}
           <Reveal>
             <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-16">
                <a href="https://www.facebook.com/smartinstituteindia" target="_blank" rel="noreferrer" className="p-4 bg-white rounded-full shadow-md hover:shadow-lg hover:text-blue-600 transition-all text-gray-600">
                  <Facebook size={24} className="md:w-8 md:h-8" />
                </a>
                 <a href="#" className="p-4 bg-white rounded-full shadow-md hover:shadow-lg hover:text-sky-500 transition-all text-gray-600 font-bold text-xl w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
                  X
                </a>
                <a href="#" className="p-4 bg-white rounded-full shadow-md hover:shadow-lg hover:text-pink-600 transition-all text-gray-600">
                  <Instagram size={24} className="md:w-8 md:h-8" />
                </a>
                <a href="https://www.youtube.com/channel/UCFfLzGu6VS4gOTZkJRtmfkg" target="_blank" rel="noreferrer" className="p-4 bg-white rounded-full shadow-md hover:shadow-lg hover:text-red-600 transition-all text-gray-600">
                   {/* Lucide doesn't index Youtube easily in all versions, using Text fallback if icon unavailable or generic Globe */}
                   <Youtube size={24} className="md:w-8 md:h-8" /> 
                </a>
             </div>
           </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Details Section */}
            <div className="space-y-8">
               <Reveal>
               {/* Head Office */}
               <motion.div 
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border-l-4 border-primary"
               >
                 <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                   <Building className="text-primary" /> Head Office
                 </h2>
                 <div className="space-y-4 text-gray-600 text-sm md:text-base">
                   <div className="flex items-start gap-3">
                     <MapPin className="text-accent mt-1 shrink-0" />
                     <p>
                       1st & 2nd Floor, 50-Kuber Nagar,<br/>
                       Opp.Baba Baijnath nath Mandir,<br/>
                       Nilgir Road, Ass-Pass Circle,<br/>
                       Godadra, Surat-395010
                     </p>
                   </div>
                   <div className="flex items-center gap-3">
                     <Phone className="text-accent shrink-0" />
                     <div className="flex flex-col">
                       <a href="tel:+919898830409" className="hover:text-primary transition-colors">+91-98988-30409</a>
                       <a href="tel:+919601749300" className="hover:text-primary transition-colors">+91-96017-49300</a>
                     </div>
                   </div>
                   <div className="flex items-center gap-3">
                     <Mail className="text-accent shrink-0" />
                     <a href="mailto:headoffice@smartinstitute.co.in" className="hover:text-primary transition-colors break-all">headoffice@smartinstitute.co.in</a>
                   </div>
                 </div>
               </motion.div>
               </Reveal>

               <Reveal delay={0.2}>
               {/* Branch Office */}
               <motion.div 
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.2 }}
                 className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border-l-4 border-accent"
               >
                 <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                   <Building className="text-accent" /> Branch Office
                 </h2>
                 <div className="space-y-4 text-gray-600 text-sm md:text-base">
                   <div className="flex items-start gap-3">
                     <MapPin className="text-accent mt-1 shrink-0" />
                     <p>
                       309-A, 309-B, 3rd Floor, Sai Square Building,<br/>
                       Bhestan Circle, Bhestan,<br/>
                       Surat-395023
                     </p>
                   </div>
                   <div className="flex items-center gap-3">
                     <Phone className="text-accent shrink-0" />
                     <div className="flex flex-col">
                       <a href="tel:+919898830409" className="hover:text-primary transition-colors">+91-98988-30409</a>
                       <a href="tel:+919601749300" className="hover:text-primary transition-colors">+91-96017-49300</a>
                     </div>
                   </div>
                   <div className="flex items-center gap-3">
                     <Mail className="text-accent shrink-0" />
                     <a href="mailto:bhestanbranch@smartinstitute.co.in" className="hover:text-primary transition-colors break-all">bhestanbranch@smartinstitute.co.in</a>
                   </div>
                 </div>
               </motion.div>
               </Reveal>
            </div>

            {/* Contact Form */}
            <Reveal delay={0.3}>
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl">
               <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Send us a <span className="text-primary">Message</span></h2>
               <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter Your Name..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Enter Your Email Here..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Phone Number" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                    <select name="state" value={formData.state} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none">
                        <option value="">Select State</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Maharashtra">Maharashtra</option>
                    </select>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select name="city" value={formData.city} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none">
                        <option value="">Select City</option>
                        <option value="Surat">Surat</option>
                        <option value="Ahmedabad">Ahmedabad</option>
                    </select>
                    <select name="branch" value={formData.branch} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none">
                        <option value="">Select Branch</option>
                        <option value="Godadara">Godadara Head Office</option>
                        <option value="Bhestan">Bhestan Branch</option>
                    </select>
                 </div>

                 <input type="text" name="subject" value={formData.subject} onChange={handleChange} required placeholder="Subject" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />

                 <textarea name="message" value={formData.message} onChange={handleChange} required rows="4" placeholder="Message" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"></textarea>

                 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <div className="bg-gray-200 px-4 py-3 rounded-lg font-mono text-xl font-bold tracking-widest select-none text-gray-700 text-center">
                        {generatedCode}
                    </div>
                    <input type="text" name="securityCode" value={formData.securityCode} onChange={handleChange} required placeholder="Enter Security Code" className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                 </div>

                 <button type="submit" className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                   <Send size={20} /> Submit Message
                 </button>
               </form>
            </div>
            </Reveal>

          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Find <span className="text-primary">Our Locations</span></h2>
            
            <Reveal>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 max-w-5xl mx-auto">
              {/* Map Tabs */}
              <div className="flex border-b border-gray-100">
                <button 
                  onClick={() => setActiveMap('head')}
                  className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${activeMap === 'head' ? 'bg-primary text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                >
                  <Building size={16} /> Head Office
                </button>
                <button 
                  onClick={() => setActiveMap('branch')}
                  className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${activeMap === 'branch' ? 'bg-accent text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                >
                  <Building size={16} /> Branch Office
                </button>
              </div>

              {/* Map Iframe */}
              <div className="h-96 relative bg-gray-200">
                <iframe 
                  title="Location Map"
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  scrolling="no" 
                  marginHeight="0" 
                  marginWidth="0" 
                  src={activeMap === 'head' 
                    ? "https://maps.google.com/maps?q=50+Kuber+Nagar+Opp+Baba+Baijnath+Mandir+Godadra+Surat&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    : "https://maps.google.com/maps?q=21.17752898474314,72.85686492919922&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  }
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>
              
              <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
                  <p className="font-semibold text-gray-800 flex items-center justify-center gap-2">
                    <MapPin size={16} className="text-primary" />
                    {activeMap === 'head' ? 'Godadra, Surat' : 'Bhestan, Surat'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {activeMap === 'head' ? '1st & 2nd Floor, 50-Kuber Nagar' : 'Sai Square Building, Bhestan Circle'}
                  </p>
              </div>
            </div>
            </Reveal>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
