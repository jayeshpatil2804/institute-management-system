import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, 
  ArrowRight, Calendar, Clock, User, Heart, MessageCircle, Share2,
  Search, Filter, TrendingUp, BookOpen, Award, Users, Camera
} from 'lucide-react';
import { motion } from 'framer-motion';

// Import logo from assets
import logoImage from '../../assets/logo2.png';
import Reveal from '../../components/Reveal';

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const categories = ['all', 'education', 'technology', 'career', 'campus-life', 'success-stories'];
  
  const blogPosts = [
    {
      id: 1,
      title: 'Top 10 Programming Languages to Learn in 2024',
      excerpt: 'Discover the most in-demand programming languages that will boost your career prospects in the tech industry...',
      category: 'technology',
      author: 'Rajesh Kumar',
      date: '2024-01-15',
      readTime: '5 min read',
      image: 'https://placehold.co/800x400/png?text=Programming+Languages+2024',
      likes: 245,
      comments: 32,
      featured: true
    },
    {
      id: 2,
      title: 'How to Choose the Right Career Path After 12th',
      excerpt: 'A comprehensive guide to help students make informed decisions about their career choices after completing school...',
      category: 'career',
      author: 'Priya Sharma',
      date: '2024-01-12',
      readTime: '8 min read',
      image: 'https://placehold.co/800x400/png?text=Career+Guidance',
      likes: 189,
      comments: 28,
      featured: true
    },
    {
      id: 3,
      title: 'Digital Marketing Trends That Will Dominate 2024',
      excerpt: 'Explore the latest digital marketing trends and strategies that businesses are adopting to stay competitive...',
      category: 'technology',
      author: 'Amit Patel',
      date: '2024-01-10',
      readTime: '6 min read',
      image: 'https://placehold.co/800x400/png?text=Digital+Marketing+2024',
      likes: 156,
      comments: 19,
      featured: false
    },
    {
      id: 4,
      title: 'Smart Institute Annual Tech Fest 2024 - A Grand Success',
      excerpt: 'Relive the amazing moments from our annual tech fest that showcased innovation and creativity...',
      category: 'campus-life',
      author: 'Neha Singh',
      date: '2024-01-08',
      readTime: '4 min read',
      image: 'https://placehold.co/800x400/png?text=Tech+Fest+2024',
      likes: 298,
      comments: 41,
      featured: true
    },
    {
      id: 5,
      title: 'From Student to CEO: Success Story of Our Alumni',
      excerpt: 'Inspiring journey of our former student who is now leading a successful tech startup in Silicon Valley...',
      category: 'success-stories',
      author: 'Vikram Desai',
      date: '2024-01-05',
      readTime: '10 min read',
      image: 'https://placehold.co/800x400/png?text=Success+Story',
      likes: 412,
      comments: 67,
      featured: true
    },
    {
      id: 6,
      title: 'The Importance of Soft Skills in Today\'s Job Market',
      excerpt: 'Why soft skills are becoming as important as technical skills for career success in the modern workplace...',
      category: 'education',
      author: 'Sanjay Mehta',
      date: '2024-01-03',
      readTime: '7 min read',
      image: 'https://placehold.co/800x400/png?text=Soft+Skills',
      likes: 134,
      comments: 22,
      featured: false
    },
    {
      id: 7,
      title: 'Web Development Roadmap for Beginners',
      excerpt: 'A step-by-step guide for aspiring web developers to start their journey in the world of web development...',
      category: 'education',
      author: 'Rajesh Kumar',
      date: '2024-01-01',
      readTime: '12 min read',
      image: 'https://placehold.co/800x400/png?text=Web+Development',
      likes: 278,
      comments: 35,
      featured: false
    },
    {
      id: 8,
      title: 'Campus Placement Drive 2024 - Record Breaking Results',
      excerpt: 'Our students achieved remarkable success in the recent campus placement drive with top companies...',
      category: 'campus-life',
      author: 'Priya Sharma',
      date: '2023-12-28',
      readTime: '5 min read',
      image: 'https://placehold.co/800x400/png?text=Placement+Drive',
      likes: 367,
      comments: 48,
      featured: false
    },
    {
      id: 9,
      title: 'Data Science vs Machine Learning: What\'s the Difference?',
      excerpt: 'Understanding the key differences between data science and machine learning to choose the right career path...',
      category: 'technology',
      author: 'Dr. Anita Sharma',
      date: '2023-12-25',
      readTime: '9 min read',
      image: 'https://placehold.co/800x400/png?text=Data+Science+vs+ML',
      likes: 198,
      comments: 31,
      featured: false
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

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
              <BookOpen size={40} />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Our <span className="text-accent">Blog</span></h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Insights, stories, and updates from the world of education and technology
            </p>
          </motion.div>
        </div>
      </div>

      {/* 5. Featured Posts */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured <span className="text-primary">Articles</span></h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Hand-picked stories that matter to our community</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.slice(0, 2).map((post, index) => (
                <motion.div 
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-bold">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-accent font-semibold text-sm">{post.category}</span>
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Clock size={14} />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                          <img src={`https://placehold.co/40x40/png?text=${post.author.charAt(0)}`} alt={post.author} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{post.author}</p>
                          <p className="text-xs text-gray-500">{new Date(post.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <button className="text-primary font-semibold hover:text-blue-700 flex items-center gap-2">
                        Read More <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* 6. Search and Filter */}
      <div className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* 7. All Blog Posts */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Latest <span className="text-primary">Articles</span></h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Stay updated with our latest insights and stories</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.div 
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    {post.featured && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-accent text-white px-2 py-1 rounded-full text-xs font-bold">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-accent font-semibold text-xs uppercase">{post.category}</span>
                      <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <Clock size={12} />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-3">{post.excerpt}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                          <img src={`https://placehold.co/32x32/png?text=${post.author.charAt(0)}`} alt={post.author} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-900">{post.author}</p>
                          <p className="text-xs text-gray-500">{new Date(post.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-gray-500">
                        <div className="flex items-center gap-1">
                          <Heart size={14} />
                          <span className="text-xs">{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle size={14} />
                          <span className="text-xs">{post.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No articles found matching your criteria</p>
              </div>
            )}
          </Reveal>
        </div>
      </div>

      {/* 8. Newsletter */}
      <div className="py-20 bg-gradient-to-br from-primary to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Subscribe to Our <span className="text-accent">Newsletter</span></h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Get the latest articles and updates delivered straight to your inbox
              </p>
              <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 outline-none w-full"
                />
                <button className="bg-accent hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg transition-colors w-full sm:w-auto">
                  Subscribe
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* 9. Blog Stats */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Blog <span className="text-primary">Statistics</span></h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Numbers that show our reach and impact</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">150+</div>
                <div className="text-gray-600">Articles Published</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">50K+</div>
                <div className="text-gray-600">Monthly Readers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">25+</div>
                <div className="text-gray-600">Expert Writers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">10K+</div>
                <div className="text-gray-600">Subscribers</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
