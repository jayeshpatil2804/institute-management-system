import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Target, Lightbulb, CheckCircle, ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import studentStanding from '../../assets/studentWithbooks.webp';
import Reveal from '../../components/Reveal';

const AboutUsPage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">

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
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About <span className="text-accent">Smart Institute</span></h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Empowering the future through knowledge and innovation.
            </p>
          </motion.div>
        </div>
      </div>

      {/* 1. About Smart Institute Section */}
      <div id="smart" className="py-20 bg-white scroll-mt-20">
        <div className="container mx-auto px-4">
          <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">About <span className="text-primary">Smart Institute</span></h2>
              <div className="space-y-4 text-gray-800 leading-relaxed text-lg">
                <p>
                  An autonomous institute is registered under Government of India NCT New Delhi. The institute provides a wide variety of career, professional, short term and certification courses, designed by our expert academicians after careful market study and research. All the courses are taught by experienced and certified faculty.
                </p>
                <p>
                  Our trainers constantly update their technical skills to maintain their expertise. Smart Institute has alliances with leading computer technology companies like Tally.Erp9 to offer courses that are globally recognized. Provide Central Government Program Digital India (NDLM) course.
                </p>
                <p>
                  These global certifications help professionals enjoy better salaries and career prospects.
                </p>
                <p>
                  The institute organizes various events like Techno Minds, placement workshops, job fairs, and seminars to encourage student interaction and prepare them for job interviews and make them industry-ready. In a nutshell, Smart Institute creates skilled IT professionals through a variety of courses delivered using the latest teaching methodology.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
               initial={{ opacity: 0, rotate: 0 }}
               whileInView={{ opacity: 1, rotate: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
               className="relative flex justify-center"
            >
               {/* Adjusted image styling for vertical layout support */}
              <div className="relative w-full max-w-md">
                  <img 
                    src={studentStanding} 
                    alt="Students at Smart Institute" 
                    className="rounded-2xl shadow-xl w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-500" 
                    style={{ maxHeight: '80vh' }}
                  />
                  <div className="absolute -bottom-6 -right-6 bg-accent text-white p-6 rounded-xl shadow-lg hidden md:block">
                    <div className="text-lg font-bold">Empowering Young Minds</div>
                  </div>
              </div>
            </motion.div>
          </div>
          </Reveal>
        </div>
      </div>

      {/* 2. Mission Section */}
      <div id="mission" className="py-20 bg-gray-50 scroll-mt-20">
        <div className="container mx-auto px-4">
          <Reveal>
          <div className="flex flex-col md:flex-row gap-12 items-center">
             <div className="md:w-1/3 flex justify-center">
                <div className="w-48 h-48 bg-blue-100 rounded-full flex items-center justify-center text-primary">
                    <Target size={100} />
                </div>
             </div>
             <div className="md:w-2/3">
                <h2 className="text-4xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    Our <span className="text-accent">Mission</span>
                </h2>
                <div className="bg-white p-8 rounded-2xl shadow-md border-l-8 border-accent">
                    <ul className="space-y-6">
                        <li className="flex items-start gap-4">
                            <div className="mt-1 bg-primary/10 p-2 rounded-full text-primary shrink-0">
                                <CheckCircle size={24} />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">To provide adequate knowledge of computer</h4>
                                <p className="text-gray-800">The main focus of this program is to provide deep and adequate knowledge of computers to the student.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="mt-1 bg-primary/10 p-2 rounded-full text-primary shrink-0">
                                <CheckCircle size={24} />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">Personality Development of the student</h4>
                                <p className="text-gray-800">This program not only focus on the syllabus but also pull out the hidden abilities and inner power of the student. Basically it tries to bring out and built the personality of the student.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="mt-1 bg-primary/10 p-2 rounded-full text-primary shrink-0">
                                <CheckCircle size={24} />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">To change life-style by New Technologies</h4>
                                <p className="text-gray-800">Providing awareness to upcoming technologies and changing environment.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="mt-1 bg-primary/10 p-2 rounded-full text-primary shrink-0">
                                <CheckCircle size={24} />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">Computer course at the nominal fee</h4>
                                <p className="text-gray-800">Providing computer course at very nominal and affordable fees.</p>
                            </div>
                        </li>
                    </ul>
                </div>
             </div>
          </div>
          </Reveal>
        </div>
      </div>

      {/* 3. Vision Section */}
      <div id="vision" className="py-20 bg-white scroll-mt-20">
        <div className="container mx-auto px-4">
           <Reveal>
           <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center text-accent mx-auto mb-6">
                        <Lightbulb size={48} />
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Our <span className="text-primary">Vision</span></h2>
                </div>
                
                <div className="space-y-6 text-lg text-gray-800 leading-relaxed text-justify relative">
                    <div className="absolute -left-12 -top-12 text-9xl text-gray-100 font-serif -z-10">"</div>
                    <p>
                        Information Technology has become a fastest growing Industry in today's scenario which is providing thousands of job to well trained professionals. India has achieved a terrific growth in this field and is being considered as a Super Power in the world. Information Technology is providing the upcoming future that will change every face of Human existence. In order to produce Information Technology Professionals, IT education requires a good infrastructure and high quality competence.
                    </p>
                    <p>
                        The interference of the computer enter in our life. Computer education is beneficial when any course of computer is done by the recognized institution or university. Indian Government also gives the slogan "Information Technology for all ". For Development and extension of this programme 20 Lac Information Technology Experts requires within six years. Other then I.T. field Ancillary Units and Industries requires demand of more then 10 Lac employee. but it come in force in India before few years. Now by the help of internet whole world is in our computer screen. Due to which we can take any of information within few seconds through computer. It is learning institute and is always willing to invent, innovate and renovate itself with the changing times. In continuation of it's education service to the nation, the SMART INSTITUTE has become a pioneer in providing the best IT education & training in collaboration with state and Govt. of India. Our the prime goal of providing quality IT education to its Students and the meeting the need for skilled IT Professionals in the country.
                    </p>
                    <p>
                         Our Institution has been decided to provide the Computer Education by the help of State & Indian Government planning & Programmes announces time to time in nominal charge for every person of our lower and middle class of society. I wish and try to success the dream of computer education in all India..
                    </p>
                    <p>
                        SMART INSTITUTE is an autonomous institution. The main objective behind the establishment of this institution is to spread the computer literacy to all over the country. By this computer literacy program, we ensure that student may learn more and more and can become self motivated. Our beefy infrastructure and dedicated officers urge students to move forward to get greater Professional Competence. They have also been exposed to the training and real world projects. I am sure that our student can get enough knowledge to face any demand and challenges that an employer may have on them. I wish for their great success and bright future and hope for thier better tomorrow.
                    </p>
                </div>

                <div className="mt-16 flex flex-col items-center md:items-end">
                    <div className="text-center md:text-right bg-white p-8 rounded-2xl border border-gray-200 shadow-lg relative overflow-hidden transition-all hover:shadow-xl">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-bl-full"></div>
                        <p className="text-xl font-bold text-gray-900 mb-4 font-serif italic">With best regards,</p>
                        <div className="h-1 w-20 bg-accent ml-auto mr-auto md:mr-0 mb-6"></div>
                        
                        <h3 className="text-3xl font-extrabold text-primary mb-2">Mr. Chandan Chaubey</h3>
                        <p className="text-base font-bold text-gray-700 uppercase tracking-wide mb-1">Managing Director "Smart Institute"</p>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Chairman "All India Skill Development Council-AISDC"</p>
                    </div>
                </div>
           </div>
           </Reveal>
        </div>
      </div>

    </div>
  );
};

export default AboutUsPage;
