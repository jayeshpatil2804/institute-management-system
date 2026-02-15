import React from 'react';
import { motion } from 'framer-motion';
import Reveal from '../../components/Reveal';

const FacilitiesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary to-blue-800 py-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Placement <span className="text-accent">Assistance</span>
          </motion.h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Helping students build successful careers
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-12">
          
          {/* Section 1 */}
          <Reveal>
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-8 bg-primary rounded-full"></span>
                Placement assistance for students
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Apart from technical training in various software & hands-on project work, Smart Institute Education helps you get a foothold in the booming IT & ITeS industry.
            </p>
          </motion.div>
          </Reveal>

          {/* Section 2 */}
          <Reveal delay={0.2}>
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-8 bg-accent rounded-full"></span>
                Recruitment Assistance for Companies
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Smart Institute's Placements Team helps companies find talented candidates for their IT & software requirements. The team is in touch with graduating students in all centres.
            </p>
          </motion.div>
          </Reveal>

          {/* Section 3 */}
          <Reveal delay={0.4}>
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-8 bg-green-500 rounded-full"></span>
                JOB FAIRS/CAMPUS PLACEMENTS
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              The Institute conducts periodic job fairs/campus placements where companies gather to hire skilled students for their job requirements. Last year (2011), Smart Institute conducted 5 job fairs in which around 115 students participated.
            </p>
          </motion.div>
          </Reveal>

        </div>
      </div>
    </div>
  );
};

export default FacilitiesPage;
