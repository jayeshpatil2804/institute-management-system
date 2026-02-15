import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Quote, Calendar, Clock, User, Briefcase } from 'lucide-react';

const EmployeeDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const quotes = [
        "Success is not the key to happiness. Happiness is the key to success.",
        "The only way to do great work is to love what you do.",
        "Quality means doing it right when no one is looking.",
        "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort."
    ];
    // Simple random quote based on day
    const todayQuote = quotes[new Date().getDate() % quotes.length];

    return (
        <div className="container mx-auto p-4 md:p-8 animate-fadeIn">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-2xl p-8 mb-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                            {user?.role || 'Staff Member'}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-2">
                            {getGreeting()}, <span className="text-accent">{user?.name?.split(' ')[0]}</span>
                        </h1>
                        <p className="text-blue-200 text-lg">Welcome to Smart Institute Portal</p>
                    </div>
                    
                    <div className="flex flex-col items-end text-right bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 w-full md:w-auto">
                        <div className="text-3xl font-mono font-bold tracking-widest">
                            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-blue-200 text-sm font-medium uppercase tracking-wide flex items-center gap-2">
                            <Calendar size={14} />
                            {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Summary Card */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <User className="text-primary" size={20} /> My Profile
                    </h3>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-400 border-2 border-primary/20">
                            {user?.name?.charAt(0)}
                        </div>
                        <div>
                            <div className="font-bold text-gray-900">{user?.name}</div>
                            <div className="text-sm text-gray-500">{user?.email}</div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                            <span className="text-gray-500">Department</span>
                            <span className="font-medium text-gray-800">{user?.role === 'Faculty' ? 'Academic' : 'Administration'}</span>
                        </div>
                        <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                            <span className="text-gray-500">Branch</span>
                            <span className="font-medium text-gray-800">{user?.branchName || 'Main Branch'}</span>
                        </div>
                    </div>
                </div>

                {/* Motivational Quote Card */}
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-accent lg:col-span-2 flex flex-col justify-center">
                    <div className="mb-4 text-accent/20">
                        <Quote size={48} />
                    </div>
                    <blockquote className="text-xl md:text-2xl font-medium text-gray-700 leading-relaxed italic mb-4">
                        "{todayQuote}"
                    </blockquote>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest self-end">- Daily Inspiration</p>
                </div>
            </div>

            {/* Quick Actions Hint */}
            <div className="mt-8 text-center text-gray-500 text-sm">
                <p>Use the sidebar menu to access your assigned modules.</p>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
