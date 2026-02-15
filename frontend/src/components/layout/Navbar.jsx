import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { fetchMyPermissions } from '../../features/userRights/userRightsSlice';
import { Menu, X, ChevronDown, ChevronRight, LogOut, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MENU_CONFIG } from '../../utils/menuConfig';
import ProfileSettingsModal from '../user/ProfileSettingsModal';
import logoImage from '../../assets/logo2.png';

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);
    const { myPermissions = [] } = useSelector((state) => state.userRights || {}); 
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null); // Acts as "activeMenu" for click behavior
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [expandedSubItems, setExpandedSubItems] = useState({});
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const navRef = React.useRef(null);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  const handleMenuClick = (index) => {
    setHoveredMenu(hoveredMenu === index ? null : index);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setHoveredMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleSubItem = (title) => {
    setExpandedSubItems(prev => ({ ...prev, [title]: !prev[title] }));
  };

  useEffect(() => {
    if (user) dispatch(fetchMyPermissions());
  }, [user, dispatch]);

  useEffect(() => {
    if (!user) return;

    if (user.role === 'Super Admin') {
      setFilteredMenu(MENU_CONFIG);
      return;
    }

    // Filter menu based on permissions
    const newMenu = MENU_CONFIG.map(item => {
      if (item.type === 'single') return item;
      
      const visibleSubItems = item.subItems ? item.subItems.filter(sub => {
        // Explicitly hide restricted items for non-Super Admins
        if (sub.restricted) return false;

        // Handle nested items (e.g. Transaction -> Inquiry -> Online)
        if (sub.type === 'nested') {
             // Check if ANY of the nested items are permitted. 
             // Ideally we filter the nested items themselves too.
             const visibleNested = sub.subItems.filter(nested => {
                 const pageName = `${sub.title} - ${nested.title}`;
                 const perm = myPermissions.find(p => p.page === pageName);
                 return perm && perm.view === true;
             });
             
             // If we have visible nested items, we keep this parent sub-item, 
             // BUT we should probably modify it to only contain the visible nested ones.
             // For simplicity in this map/filter structure, we'll mutate a copy if needed or just return true/false
             // A better approach is to map then filter.
             if (visibleNested.length > 0) {
                 sub.filteredSubItems = visibleNested; // Temporary property
                 return true;
             }
             return false;
        }

        const perm = myPermissions.find(p => p.page === sub.title);
        return perm && perm.view === true;
      }) : [];

      if (visibleSubItems.length > 0) return { ...item, subItems: visibleSubItems };
      return null;
    }).filter(Boolean);

    setFilteredMenu(newMenu);
  }, [user, myPermissions]);

  const TransactionDropdown = ({ isHovered, isMobile = false, item }) => {
    // Mobile View
    if (isMobile) {
      return (
        <div className="bg-gray-50 border-t border-gray-100">
          {item.subItems.map((sub, idx) => (
            <div key={idx} className="border-b border-gray-200 last:border-0 border-dashed">
              {sub.type === 'nested' ? (
                <div>
                  <button onClick={() => toggleSubItem(sub.title)} className="w-full flex items-center justify-between px-6 py-3 text-sm text-gray-700 hover:text-primary hover:bg-blue-50 transition-colors font-medium">
                    <span>{sub.title}</span>
                    <ChevronRight size={16} className={`transition-transform duration-200 ${expandedSubItems[sub.title] ? 'rotate-90' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {expandedSubItems[sub.title] && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="bg-white overflow-hidden border-t border-gray-100">
                        {/* Use filteredSubItems if available (from permission logic), else subItems */}
                        {(sub.filteredSubItems || sub.subItems).map((nested, nestedIdx) => (
                          <Link key={nestedIdx} to={nested.path} className="block px-10 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 border-l-4 border-transparent hover:border-primary transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                            {nested.title}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to={sub.path} className="block px-6 py-3 text-sm text-gray-700 hover:text-primary hover:bg-blue-50 transition-colors font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                  {sub.title}
                </Link>
              )}
            </div>
          ))}
        </div>
      );
    }
    
    // Desktop Dropdown
    return (
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 10 }} 
            transition={{ duration: 0.2 }} 
            className="absolute left-0 top-full pt-0 w-64 z-50" 
          >
            <div className="bg-white text-gray-800 shadow-xl rounded-md overflow-hidden border border-gray-200 ring-1 ring-black/5">
              <div className="h-1 bg-primary w-full"></div>
              {item.subItems.map((sub, idx) => (
                <div key={idx} className="border-b border-gray-100 last:border-0">
                  {sub.type === 'nested' ? (
                    <div className="group/item relative">
                       {/* Nested Submenu Trigger */}
                      <button 
                        onClick={() => toggleSubItem(sub.title)} 
                        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                      >
                        <span>{sub.title}</span>
                        <ChevronDown size={14}/> 
                      </button>
                      
                       {/* Nested Submenu Display */}
                        <div className="bg-gray-50 border-t border-gray-100 hidden group-hover/item:block">
                           {(sub.filteredSubItems || sub.subItems).map((nested, nestedIdx) => (
                              <Link key={nestedIdx} to={nested.path} 
                                onClick={() => setHoveredMenu(null)}
                                className="block px-6 py-2 text-xs font-semibold text-gray-600 hover:text-primary hover:bg-blue-50">
                                {nested.title}
                              </Link>
                            ))}
                        </div>
                    </div>
                  ) : (
                    <Link to={sub.path} 
                        onClick={() => setHoveredMenu(null)}
                        className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                      {sub.title}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-white shadow-md border-b border-gray-200 transition-all duration-300 h-16">
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
              {/* Logo Section */}
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/home')}>
                  <div className="flex items-center justify-center transform transition-transform hover:scale-105">
                     {/* Increased Logo Size */}
                     <img src={logoImage} alt="Smart Institute" className="h-14 w-auto object-contain" />
                  </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1 h-full" ref={navRef}>
                  {filteredMenu.map((item, index) => (
                      <div key={index} className="relative h-full flex items-center px-1">
                      {/* FIX: Safely check for subItems using optional chaining */}
                      {(item.subItems?.length > 0) || item.isCustom ? (
                          <>
                              <button 
                                  onClick={() => handleMenuClick(index)}
                                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-bold transition-all duration-200 
                                  ${hoveredMenu === index ? 'text-primary bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                              >
                                  {item.title}
                                  <ChevronDown size={14} className={`transition-transform duration-200 ${hoveredMenu === index ? 'rotate-180 text-primary' : 'text-gray-400'}`}/>
                              </button>
                              {/* Dropdowns */}
                              {item.isCustom ? <TransactionDropdown isHovered={hoveredMenu === index} item={item} /> : (
                                  <AnimatePresence>
                                  {hoveredMenu === index && (
                                      <motion.div 
                                          initial={{ opacity: 0, y: 10 }} 
                                          animate={{ opacity: 1, y: 0 }} 
                                          exit={{ opacity: 0, y: 10 }} 
                                          transition={{ duration: 0.2 }} 
                                          className="absolute left-0 top-full pt-0 w-56 z-50"
                                      >
                                      <div className="bg-white text-gray-800 shadow-xl rounded-md overflow-hidden border border-gray-200 ring-1 ring-black/5">
                                          <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                                          <div className="py-2">
                                              {item.subItems.map((sub, subIdx) => (
                                                  <Link key={subIdx} to={sub.path} 
                                                      onClick={() => setHoveredMenu(null)}
                                                      className="block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-primary transition-all border-l-4 border-transparent hover:border-primary">
                                                      {sub.title}
                                                  </Link>
                                              ))}
                                          </div>
                                      </div>
                                      </motion.div>
                                  )}
                                  </AnimatePresence>
                              )}
                          </>
                      ) : (
                          <Link 
                              to={item.path} 
                              onClick={() => setHoveredMenu(null)}
                              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-bold transition-all duration-200 
                              ${location.pathname.startsWith(item.path) ? 'text-primary bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                          >
                              {item.title}
                          </Link>
                      )}
                      </div>
                  ))}
              </nav>

              {/* Right Actions - User Profile & Logout */}
              <div className="flex items-center gap-4">
                  {/* User Profile Trigger - Desktop */}
                  <div 
                      className="hidden md:flex items-center gap-4 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors border-r border-gray-200 pr-5 mr-2"
                      onClick={() => user?.role && user.role !== 'Student' && setIsProfileModalOpen(true)}
                      title={user?.role && user.role !== 'Student' ? "Click to manage profile" : "Profile"}
                  >
                      <div className="flex flex-col items-end text-right">
                          <span className="text-sm font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors">
                              {user?.name || 'Guest'}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">({user?.role})</span>
                          <span className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">
                              {user?.branchName || 'Main Branch'}
                          </span>
                      </div>
                      {/* Increased Profile Image Size */}
                      <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm ring-2 ring-gray-100 group-hover:ring-primary/20 transition-all flex items-center justify-center">
                          {user?.photo ? (
                              <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                              <UserIcon className="text-gray-400 w-7 h-7" />
                          )}
                      </div>
                  </div>

                  <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-md transition-all duration-300 border border-red-100 font-medium text-sm" title="Logout">
                      <LogOut size={16} />
                      <span className="hidden md:inline">Logout</span>
                  </button>
                  
                  <button className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                      {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
              </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-white border-t border-gray-200 max-h-[85vh] overflow-y-auto shadow-xl absolute w-full left-0 top-16">
              <div className="py-2">
                  {filteredMenu.map((item, index) => (
                      <div key={index} className="">
                          {(item.subItems?.length > 0) || item.isCustom ? (
                              <>
                                  <div className="px-4 py-3 font-bold text-gray-800 bg-gray-50 border-y border-gray-100 flex items-center justify-between">
                                      {item.title}
                                      <ChevronDown size={14} className="text-gray-400"/>
                                  </div>
                                  {item.isCustom ? <TransactionDropdown isMobile={true} item={item} /> : (
                                      <div className="bg-white">
                                      {item.subItems.map((sub, subIdx) => (
                                          <Link key={subIdx} to={sub.path} className="block px-8 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-primary transition-colors border-b border-gray-50 last:border-0" onClick={() => setIsMobileMenuOpen(false)}>
                                          {sub.title}
                                          </Link>
                                      ))}
                                      </div>
                                  )}
                              </>
                          ) : (
                                  <Link to={item.path} className="block px-4 py-4 font-bold text-gray-800 hover:bg-gray-50 hover:text-primary transition-colors border-b border-gray-100" onClick={() => setIsMobileMenuOpen(false)}>
                                  {item.title}
                              </Link>
                          )}
                      </div>
                  ))}
              </div>
              {/* Mobile User Profile Footer */}
              <div 
                className="p-4 bg-gray-50 border-t border-gray-200 cursor-pointer"
                onClick={() => {
                  if (user?.role && user.role !== 'Student') {
                    setIsProfileModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }
                }}
              >
                  <div className="flex items-center gap-3">
                       <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-400 font-bold text-lg shadow-sm border border-gray-200 overflow-hidden">
                          {user?.photo ? (
                             <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                             <UserIcon size={24} />
                          )}
                       </div>
                       <div>
                          <div className="font-bold text-gray-900 flex items-center gap-2">
                            {user?.name}
                            <span className="text-[10px] font-normal text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded bg-white">{user?.role}</span>
                          </div>
                          <div className="text-xs font-bold text-primary uppercase mt-0.5">{user?.branchName || 'Main Branch'}</div>
                          {user?.role !== 'Student' && <div className="text-[10px] text-blue-600 font-medium mt-1">Tap to edit profile</div>}
                       </div>
                  </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      {/* Profile Settings Modal */}
      <ProfileSettingsModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </>
  );
};

export default Navbar;