import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, 
  ArrowRight, Building, Users, Award, Globe, TrendingUp, Target,
  ChevronDown, Search, PhoneCall, MailIcon, MapPinIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

// Import logo from assets
import logoImage from '../../assets/logo2.png';
import Reveal from '../../components/Reveal';

import axios from 'axios';

const FranchisePage = () => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showFranchise, setShowFranchise] = useState(false);
  const [branches, setBranches] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState({});

  useEffect(() => {
      const fetchBranches = async () => {
          try {
              const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/branches/public`);
              // Actually, use relative path if proxy is set. The user mentioned proxy in vite config.
              // Let's us '/api/branches/public' assuming proxy works.
              // But wait, the user's vite config had proxy.
              
              setBranches(data);

              // Extract unique states
              const uniqueStates = [...new Set(data.map(b => b.state).filter(Boolean))];
              setStates(uniqueStates);

              // Map cities by state
              const cityMap = {};
              data.forEach(b => {
                  if (b.state && b.city) {
                      if (!cityMap[b.state]) cityMap[b.state] = [];
                      if (!cityMap[b.state].includes(b.city)) cityMap[b.state].push(b.city);
                  }
              });
              setCities(cityMap);

          } catch (error) {
              console.error("Failed to fetch branches:", error);
          }
      };
      fetchBranches();
  }, []);

  const benefits = [
    {
      icon: <Award className="text-accent" size={32} />,
      title: 'Established Brand',
      description: 'Partner with a trusted name in education with over 10 years of excellence'
    },
    {
      icon: <Users className="text-accent" size={32} />,
      title: 'Training & Support',
      description: 'Comprehensive training programs and ongoing operational support'
    },
    {
      icon: <Globe className="text-accent" size={32} />,
      title: 'Marketing Support',
      description: 'Professional marketing materials and national advertising campaigns'
    },
    {
      icon: <Target className="text-accent" size={32} />,
      title: 'Proven Business Model',
      description: 'Tested and successful business model with high ROI potential'
    },
    {
      icon: <TrendingUp className="text-accent" size={32} />,
      title: 'Growth Potential',
      description: 'Be part of the rapidly growing education sector in India'
    },
    {
      icon: <Building className="text-accent" size={32} />,
      title: 'Infrastructure Support',
      description: 'Guidance for setting up world-class educational infrastructure'
    }
  ];

  const requirements = [
    'Minimum 1000 sq. ft. commercial space',
    'Investment capacity of ₹10-15 Lakhs',
    'Passion for education and student development',
    'Basic business management skills',
    'Team of 3-5 dedicated staff members',
    'Willingness to follow Smart Institute standards'
  ];

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedCity('');
    setShowFranchise(false);
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    if (selectedState && e.target.value) {
      setShowFranchise(true);
    }
  };

  const filteredFranchises = branches.filter(
    franchise => franchise.state === selectedState && franchise.city === selectedCity
  );

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
              <Building size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Franchise <span className="text-accent">Opportunities</span></h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Join hands with Smart Institute and be part of our success story
            </p>
          </motion.div>
        </div>
      </div>

      {/* 5. Franchise Locator */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Find Our <span className="text-primary">Franchise Centers</span></h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Select your state and city to locate nearby Smart Institute centers</p>
            </div>
            
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select State</label>
                  <div className="relative">
                    <select 
                      value={selectedState}
                      onChange={handleStateChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none appearance-none bg-white"
                    >
                      <option value="">Choose State</option>
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-4 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select City</label>
                  <div className="relative">
                    <select 
                      value={selectedCity}
                      onChange={handleCityChange}
                      disabled={!selectedState}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none appearance-none bg-white disabled:bg-gray-100"
                    >
                      <option value="">Choose City</option>
                      {selectedState && cities[selectedState]?.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-4 text-gray-400 pointer-events-none" size={20} />
                  </div>
                </div>
              </div>

              {showFranchise && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {filteredFranchises.length > 0 ? (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Franchise Centers in {selectedCity}, {selectedState}</h3>
                      {filteredFranchises.map((franchise, index) => (
                        <div key={index} className="bg-gradient-to-r from-primary/5 to-blue-800/5 border border-primary/20 rounded-xl p-6">
                          <h4 className="text-lg font-bold text-primary mb-3">{franchise.name}</h4>
                          <div className="space-y-2 text-gray-600">
                            <div className="flex items-start gap-3">
                              <MapPinIcon size={18} className="text-accent shrink-0 mt-1" />
                              <span className="text-sm">{franchise.address}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 md:gap-6">
                              <div className="flex items-center gap-2">
                                <Phone size={16} className="text-accent" />
                                <span className="text-sm">Ph: {franchise.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <PhoneCall size={16} className="text-accent" />
                                <span className="text-sm">Mobile: {franchise.mobile}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Building size={48} className="text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No franchise centers found in {selectedCity}, {selectedState}</p>
                      <p className="text-gray-400 text-sm mt-2">Be the first to open a Smart Institute franchise in this area!</p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </Reveal>
        </div>
      </div>

      {/* 6. Franchise Benefits */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Franchise <span className="text-primary">Benefits</span></h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Why partner with Smart Institute</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition-shadow"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* 7. Requirements */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Franchise <span className="text-primary">Requirements</span></h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  To become a Smart Institute franchise partner, you need to meet certain criteria that ensure the quality and standards of our brand.
                </p>
                <div className="space-y-4">
                  {requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span className="text-gray-700">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <img src="https://placehold.co/600x400/png?text=Franchise+Opportunity" alt="Franchise Opportunity" className="rounded-2xl shadow-xl" />
                <div className="absolute -bottom-6 -right-4 bg-accent text-white p-6 rounded-xl shadow-lg">
                  <div className="text-3xl font-bold">50+</div>
                  <div className="text-sm">Franchise Centers</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* 8. Investment Details */}
      <div className="py-20 bg-gradient-to-br from-primary to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Investment <span className="text-accent">Details</span></h2>
              <p className="text-blue-100 max-w-2xl mx-auto">Transparent investment structure with high returns</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl text-center">
                <div className="text-4xl font-bold text-accent mb-4">₹10-15 Lakhs</div>
                <div className="text-xl font-semibold mb-2">Total Investment</div>
                <p className="text-blue-100">One-time investment including setup and operational costs</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl text-center">
                <div className="text-4xl font-bold text-accent mb-4">18-24 Months</div>
                <div className="text-xl font-semibold mb-2">Break-even Period</div>
                <p className="text-blue-100">Expected time to recover your initial investment</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl text-center">
                <div className="text-4xl font-bold text-accent mb-4">25-30%</div>
                <div className="text-xl font-semibold mb-2">ROI Potential</div>
                <p className="text-blue-100">Annual return on investment with proper operations</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* 9. CTA Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="bg-gradient-to-r from-primary to-blue-800 rounded-2xl p-12 text-center text-white">
              <h2 className="text-4xl font-bold mb-4">Ready to Start Your <span className="text-accent">Franchise Journey?</span></h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Take the first step towards becoming a Smart Institute franchise partner
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-accent hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full transition-all shadow-lg transform hover:-translate-y-1 flex items-center gap-2">
                  Apply Now <ArrowRight size={20} />
                </button>
                <button className="bg-white text-primary hover:bg-gray-100 font-bold py-4 px-8 rounded-full transition-all shadow-lg transform hover:-translate-y-1 flex items-center gap-2">
                  <PhoneCall size={20} /> Call Us
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
};

export default FranchisePage;
