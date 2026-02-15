import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, 
  ArrowRight, Calendar, Users, Award, Camera, Download, Maximize2,
  Heart, Share2, Eye, Upload, X
} from 'lucide-react';
import { motion } from 'framer-motion';

// Import logo from assets
import logoImage from '../../assets/logo2.png';
import Reveal from '../../components/Reveal';

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  
  const categories = ['all', 'events', 'campus', 'students', 'faculty', 'activities'];
  
  const galleryImages = {
    events: [
      { id: 1, src: 'https://placehold.co/400x300/png?text=Annual+Function+2023', title: 'Annual Function 2023', date: '2023-12-15', views: 1250, likes: 89 },
      { id: 2, src: 'https://placehold.co/400x300/png?text=Tech+Fest+2023', title: 'Tech Fest 2023', date: '2023-10-20', views: 980, likes: 67 },
      { id: 3, src: 'https://placehold.co/400x300/png?text=Graduation+Ceremony', title: 'Graduation Ceremony', date: '2023-06-30', views: 2100, likes: 156 },
      { id: 4, src: 'https://placehold.co/400x300/png?text=Sports+Meet', title: 'Annual Sports Meet', date: '2023-03-15', views: 1450, likes: 98 },
      { id: 5, src: 'https://placehold.co/400x300/png?text=Cultural+Night', title: 'Cultural Night', date: '2023-02-14', views: 890, likes: 72 },
      { id: 6, src: 'https://placehold.co/400x300/png?text=Workshop+2023', title: 'Technical Workshop', date: '2023-01-20', views: 650, likes: 45 }
    ],
    campus: [
      { id: 7, src: 'https://placehold.co/400x300/png?text=Main+Building', title: 'Main Building', date: '2023-11-10', views: 1800, likes: 120 },
      { id: 8, src: 'https://placehold.co/400x300/png?text=Computer+Lab', title: 'Computer Lab', date: '2023-11-10', views: 980, likes: 78 },
      { id: 9, src: 'https://placehold.co/400x300/png?text=Library', title: 'Digital Library', date: '2023-11-10', views: 750, likes: 56 },
      { id: 10, src: 'https://placehold.co/400x300/png?text=Classroom', title: 'Smart Classroom', date: '2023-11-10', views: 620, likes: 43 },
      { id: 11, src: 'https://placehold.co/400x300/png?text=Cafeteria', title: 'Campus Cafeteria', date: '2023-11-10', views: 890, likes: 67 },
      { id: 12, src: 'https://placehold.co/400x300/png?text=Garden', title: 'Campus Garden', date: '2023-11-10', views: 540, likes: 38 }
    ],
    students: [
      { id: 13, src: 'https://placehold.co/400x300/png?text=Students+Study', title: 'Study Session', date: '2023-09-15', views: 1200, likes: 89 },
      { id: 14, src: 'https://placehold.co/400x300/png?text=Project+Work', title: 'Project Work', date: '2023-09-15', views: 980, likes: 72 },
      { id: 15, src: 'https://placehold.co/400x300/png?text=Group+Discussion', title: 'Group Discussion', date: '2023-09-15', views: 760, likes: 54 },
      { id: 16, src: 'https://placehold.co/400x300/png?text=Lab+Session', title: 'Lab Session', date: '2023-09-15', views: 890, likes: 63 },
      { id: 17, src: 'https://placehold.co/400x300/png?text=Presentation', title: 'Student Presentation', date: '2023-09-15', views: 650, likes: 48 },
      { id: 18, src: 'https://placehold.co/400x300/png?text=Team+Work', title: 'Team Work', date: '2023-09-15', views: 780, likes: 56 }
    ],
    faculty: [
      { id: 19, src: 'https://placehold.co/400x300/png?text=Faculty+Meeting', title: 'Faculty Meeting', date: '2023-08-20', views: 540, likes: 34 },
      { id: 20, src: 'https://placehold.co/400x300/png?text=Teaching+Session', title: 'Teaching Session', date: '2023-08-20', views: 890, likes: 67 },
      { id: 21, src: 'https://placehold.co/400x300/png?text=Workshop', title: 'Faculty Workshop', date: '2023-08-20', views: 420, likes: 28 },
      { id: 22, src: 'https://placehold.co/400x300/png?text=Training', title: 'Faculty Training', date: '2023-08-20', views: 380, likes: 25 }
    ],
    activities: [
      { id: 23, src: 'https://placehold.co/400x300/png?text=Sports+Day', title: 'Sports Day', date: '2023-07-15', views: 1560, likes: 112 },
      { id: 24, src: 'https://placehold.co/400x300/png?text=Dance+Competition', title: 'Dance Competition', date: '2023-07-15', views: 980, likes: 78 },
      { id: 25, src: 'https://placehold.co/400x300/png?text=Music+Event', title: 'Music Event', date: '2023-07-15', views: 750, likes: 56 },
      { id: 26, src: 'https://placehold.co/400x300/png?text=Art+Exhibition', title: 'Art Exhibition', date: '2023-07-15', views: 620, likes: 43 },
      { id: 27, src: 'https://placehold.co/400x300/png?text=Debate+Competition', title: 'Debate Competition', date: '2023-07-15', views: 480, likes: 32 },
      { id: 28, src: 'https://placehold.co/400x300/png?text=Quiz+Competition', title: 'Quiz Competition', date: '2023-07-15', views: 390, likes: 28 }
    ]
  };

  const allImages = Object.values(galleryImages).flat();
  const filteredImages = selectedCategory === 'all' 
    ? allImages 
    : galleryImages[selectedCategory] || [];

  const featuredImages = allImages.slice(0, 6);

  const openImageModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

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
              <Camera size={40} />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our <span className="text-accent">Gallery</span></h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Capturing memorable moments and showcasing our vibrant campus life
            </p>
          </motion.div>
        </div>
      </div>

      {/* 5. Featured Gallery */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured <span className="text-primary">Moments</span></h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Highlighting our best memories and achievements</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredImages.map((image, index) => (
                <motion.div 
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => openImageModal(image)}
                >
                  <div className="aspect-w-16 aspect-h-12">
                    <img src={image.src} alt={image.title} className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-lg font-bold mb-1">{image.title}</h3>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Eye size={14} /> {image.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart size={14} /> {image.likes}
                          </span>
                        </div>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} /> {new Date(image.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Maximize2 size={20} className="text-white" />
                  </div>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* 6. Category Filter */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Browse by <span className="text-primary">Category</span></h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Explore our collection by different categories</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredImages.map((image, index) => (
                <motion.div 
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => openImageModal(image)}
                >
                  <div className="aspect-w-16 aspect-h-12">
                    <img src={image.src} alt={image.title} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                      <h3 className="text-sm font-semibold mb-1 truncate">{image.title}</h3>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Eye size={12} /> {image.views}
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart size={12} /> {image.likes}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredImages.length === 0 && (
              <div className="text-center py-12">
                <Camera size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No images found in this category</p>
              </div>
            )}
          </Reveal>
        </div>
      </div>

      {/* 7. Gallery Stats */}
      <div className="py-20 bg-gradient-to-br from-primary to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Gallery <span className="text-accent">Statistics</span></h2>
              <p className="text-blue-100 max-w-2xl mx-auto">Numbers that tell our story</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">500+</div>
                <div className="text-blue-100">Total Photos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">50+</div>
                <div className="text-blue-100">Events Covered</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">10K+</div>
                <div className="text-blue-100">Total Views</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">5</div>
                <div className="text-blue-100">Categories</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* 8. CTA Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="bg-gradient-to-r from-primary to-blue-800 rounded-2xl p-12 text-center text-white">
              <h2 className="text-4xl font-bold mb-4">Share Your <span className="text-accent">Memories</span></h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Have photos from campus events? Share them with us and be featured in our gallery
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-accent hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full transition-all shadow-lg transform hover:-translate-y-1 flex items-center gap-2">
                  <Upload size={20} /> Upload Photos
                </button>
                <button className="bg-white text-primary hover:bg-gray-100 font-bold py-4 px-8 rounded-full transition-all shadow-lg transform hover:-translate-y-1 flex items-center gap-2">
                  <Download size={20} /> Download Brochure
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* 9. Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="relative max-w-4xl w-full">
            <button 
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-accent transition-colors"
            >
              <X size={32} />
            </button>
            <img 
              src={selectedImage.src} 
              alt={selectedImage.title} 
              className="w-full h-auto rounded-lg"
            />
            <div className="mt-4 text-white text-center">
              <h3 className="text-xl font-bold mb-2">{selectedImage.title}</h3>
              <div className="flex items-center justify-center gap-6 text-sm">
                <span className="flex items-center gap-2">
                  <Eye size={16} /> {selectedImage.views} views
                </span>
                <span className="flex items-center gap-2">
                  <Heart size={16} /> {selectedImage.likes} likes
                </span>
                <span className="flex items-center gap-2">
                  <Calendar size={16} /> {new Date(selectedImage.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
  );
};

export default GalleryPage;
