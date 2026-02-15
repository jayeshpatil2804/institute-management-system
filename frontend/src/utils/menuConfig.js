export const MENU_CONFIG = [
  {
    title: 'Home',
    path: '/home',
    type: 'single', // For sidebar
    subItems: [{ title: 'Admin Home', path: '/admin-dashboard' }] // Added for User Rights mapping (see getMenuSections)
  },
  {
    title: 'Master',
    path: '/master',
    type: 'dropdown',
    subItems: [
      { title: 'Student', path: '/master/student' },
      { title: 'Employee', path: '/master/employee' },
      { title: 'Batch', path: '/master/batch' },
      { title: 'Course', path: '/master/course' },
      { title: 'Subject', path: '/master/subject' },
      { title: 'Exam Request List', path: '/master/exam-request-list' },
      { title: 'Exam Schedule', path: '/master/exam-schedule' },
      { title: 'Exam Result', path: '/master/exam-result' },
      { title: 'Manage News', path: '/master/manage-news' },
      { title: 'Manage Terms', path: '/master/manage-terms' },
      { title: 'User Rights', path: '/master/user-rights' },
      { title: 'Branch', path: '/master/branch', restricted: true } // Super Admin only
    ]
  },
  {
    title: 'Transaction',
    path: '/transaction',
    type: 'dropdown',
    isCustom: true, // For special handling if needed, but we try to standardize
    subItems: [
      {
        title: 'Inquiry',
        type: 'nested', // Indicates submenu
        subItems: [
          { title: 'Online', path: '/transaction/inquiry/online' },
          { title: 'Offline', path: '/transaction/inquiry/offline' },
          { title: 'DSR', path: '/transaction/inquiry/dsr' }
        ]
      },
      {
        title: 'Visitors',
        type: 'nested',
        subItems: [
          { title: 'Todays Visitors List', path: '/transaction/visitors/todays-list' },
          { title: 'Todays Visited Report', path: '/transaction/visitors/todays-report' },
          { title: 'Visitors', path: '/transaction/visitors' }
        ]
      },
      { title: 'Admission', path: '/master/student/new' },
      { title: 'Pending Admission Fees', path: '/transaction/pending-admission-fees' },
      { title: 'Pending Student Registration', path: '/transaction/pending-registration' },
      { title: 'Student Cancellation', path: '/transaction/student-cancellation' },
      { title: 'Fees Receipt', path: '/transaction/fees-receipt' },
      {
        title: 'Attendance',
        type: 'nested',
        subItems: [
          { title: 'Student', path: '/transaction/attendance/student' },
          { title: 'Employee', path: '/transaction/attendance/employee' }
        ]
      }
    ]
  },
  {
    title: 'Reports',
    path: '/reports',
    type: 'dropdown',
    subItems: [
      { title: 'Ledger', path: '/reports/ledger' },
      { title: 'Monthly Report', path: '/reports/monthly-report' },
      { title: 'Admission Form', path: '/reports/admission-form' }
    ]
  },
  {
    title: 'Blog',
    path: '/blog',
    type: 'dropdown',
    subItems: [
      { title: 'Manage Blogs', path: '/blog/manage-blogs' },
      { title: 'Comments', path: '/blog/comments' }
    ]
  },
  {
    title: 'Connect',
    path: '/connect',
    type: 'dropdown',
    subItems: [
      { title: 'Video Call', path: '/connect/video-call' },
      { title: 'Inquiry List', path: '/connect/inquiry-list' }
    ]
  },
  {
    title: 'Utility',
    path: '/utility',
    type: 'dropdown',
    subItems: [
      { title: 'Downloads', path: '/utility/downloads' },
      { title: 'Free Learning', path: '/utility/free-learning' }
    ]
  }
];

// Helper to flatten menu for User Rights table
// Returns object: { 'Master': ['Student', 'Employee'...], 'Transaction': ['Inquiry - Online', 'Inquiry - Offline'...] }
export const getMenuSections = () => {
    const sections = {};
    
    MENU_CONFIG.forEach(item => {
        // Handle "Home" or other single types that might have subItems for rights purposes
        if ((item.type === 'dropdown' || item.type === 'single') && item.subItems) {
            const pageNames = [];
            
            item.subItems.forEach(sub => {
                if (sub.restricted) return; // Skip restricted items

                if (sub.type === 'nested' && sub.subItems) {
                    // Flatten nested items: "Inquiry - Online"
                    sub.subItems.forEach(nestedSub => {
                        if (nestedSub.restricted) return;
                        pageNames.push(`${sub.title} - ${nestedSub.title}`);
                    });
                } else {
                    pageNames.push(sub.title);
                    
                    // Specific Handling for Admin Home Granular Rights
                    if (sub.title === 'Admin Home') {
                        pageNames.push('Admin Home - Inquiry List');
                        pageNames.push('Admin Home - Online Admissions');
                        pageNames.push('Admin Home - Exam Pending List');
                    }
                }
            });
            
            if (pageNames.length > 0) {
                // If it's Home, we might want to group it separately or just add to sections
                sections[item.title] = pageNames;
            }
        }
    });
    
    return sections;
};

// Helper to get flatten permissions list for default state
export const getAllPermissionPages = () => {
    const sections = getMenuSections();
    return Object.values(sections).flat();
};
