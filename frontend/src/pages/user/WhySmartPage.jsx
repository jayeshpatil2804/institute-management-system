import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Award, Users, Globe } from 'lucide-react';
import Reveal from '../../components/Reveal';

const WhySmartPage = () => {
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
            Why <span className="text-accent">Smart Institute?</span>
          </motion.h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Pioneering IT Education with Excellence and Commitment
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Main Introduction */}
          <Reveal>
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
             className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12"
          >
            <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary hidden md:block">
                    <Award size={32} />
                </div>
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Pioneer in IT Education
                    </h2>
                    <p className="text-gray-600 leading-relaxed text-lg">
                        Smart Institute is the pioneer in IT education with about 4 years of IT training experience. Smart Institute prepares students to be a part of the world educational people.
                    </p>
                </div>
            </div>
          </motion.div>
          </Reveal>

          {/* Key Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Reveal delay={0.2}>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
              >
                  <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center text-accent mb-6">
                      <Globe size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Global Alliances</h3>
                  <p className="text-gray-600">
                      We offer courses and have alliances with companies like Microsoft, Red Hat, Oracle, along with various placement assistance activities.
                  </p>
              </motion.div>
              </Reveal>

              <Reveal delay={0.3}>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
              >
                  <div className="bg-green-500/10 w-12 h-12 rounded-lg flex items-center justify-center text-green-600 mb-6">
                      <CheckCircle size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">100% Placement Support</h3>
                  <p className="text-gray-600">
                      Here we provide you after complete the study placement of any company or firm. Our main aim is to give all students world-class education with their placement in any of the place which they needed.
                  </p>
              </motion.div>
              </Reveal>
          </div>

          {/* Recruitment Section */}
          <Reveal delay={0.4}>
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.4 }}
             className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Users size={120} />
             </div>
             <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-4 text-accent">For Recruiters & Companies</h2>
                <p className="text-gray-300 leading-relaxed text-lg mb-6">
                    On receiving a recruitment request from a company, the Placements Team co-ordinates with centres and provides a list of suitable candidates to be interviewed for the job position.
                </p>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                    <p className="font-semibold text-lg">
                        Need talented candidates for IT & software programming jobs? <br/>
                        <span className="text-accent">Register your job vacancies with Smart Institute.</span>
                    </p>
                </div>
             </div>
          </motion.div>
          </Reveal>

        </div>
      </div>
    </div>
  );
};

export default WhySmartPage;
