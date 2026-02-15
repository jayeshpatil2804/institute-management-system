import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, X, Check } from 'lucide-react';

const StudentSearch = ({ 
    onSelect, 
    label, 
    placeholder = "Search student by name or reg no...", 
    defaultSelectedId, 
    className,
    required = false,
    error,
    additionalFilters = {} // Allow passing extra filters like { isRegistered: 'false' }
}) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [initialLoadDone, setInitialLoadDone] = useState(false);
    
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);

    // API URL - aligning with studentSlice.js
    const API_URL = `${import.meta.env.VITE_API_URL}/students/`;

    // Debounce Logic
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query && query.length >= 2) { // Start searching after 2 chars
                searchStudents();
            } else {
                setResults([]);
            }
        }, 500); // 500ms delay

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    // Handle outside click to close dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    // Fetch initial student if defaultSelectedId is provided (Edit Mode)
    useEffect(() => {
        if (defaultSelectedId && !initialLoadDone) {
            fetchInitialStudent();
        }
    }, [defaultSelectedId, initialLoadDone]);

    const fetchInitialStudent = async () => {
        try {
            const { data } = await axios.get(`${API_URL}${defaultSelectedId}`, { withCredentials: true });
            setSelectedStudent(data);
            setQuery(`${data.firstName} ${data.lastName} (${data.regNo || data.enrollmentNo || 'N/A'})`);
            setInitialLoadDone(true);
        } catch (error) {
            console.error("Failed to fetch initial student", error);
        }
    };

    // Load all students with pending payments on mount (for fee collection)
    useEffect(() => {
        if (!initialLoadDone && !defaultSelectedId) {
            loadAllStudents();
        }
    }, []);

    const loadAllStudents = async () => {
        setLoading(true);
        try {
            const params = {
                pageSize: 50, // Show more students initially
                ...additionalFilters
            };
            
            const { data } = await axios.get(API_URL, { params, withCredentials: true });
            setResults(data.students || []);
        } catch (error) {
            console.error("Failed to load students", error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const searchStudents = async () => {
        setLoading(true);
        try {
            // Merge query with additional filters
            const params = {
                studentName: query,
                pageSize: query ? 10 : 50, // Show more when no search query
                ...additionalFilters
            };
            
            const { data } = await axios.get(API_URL, { params, withCredentials: true });
            setResults(data.students || []);
            setIsOpen(true);
        } catch (error) {
            console.error("Search failed", error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (student) => {
        setSelectedStudent(student);
        setQuery(`${student.firstName} ${student.lastName} (${student.regNo || student.enrollmentNo || 'N/A'})`);
        setIsOpen(false);
        if (onSelect) {
            onSelect(student._id, student); // Pass simplified ID and full object
        }
    };

    const clearSelection = (e) => {
        e.stopPropagation();
        setSelectedStudent(null);
        setQuery('');
        setResults([]);
        if (onSelect) {
            onSelect('', null);
        }
        if(inputRef.current) inputRef.current.focus();
    };

    return (
        <div className={`relative ${className}`} ref={wrapperRef}>
            {label && (
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            
            <div className="relative group">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (!isOpen && e.target.value) setIsOpen(true);
                        if (!e.target.value) {
                             setSelectedStudent(null);
                             if (onSelect) onSelect('', null);
                        }
                    }}
                    onFocus={() => {
                        if (results.length > 0) {
                            setIsOpen(true);
                        } else {
                            loadAllStudents();
                            setIsOpen(true);
                        }
                    }}
                    placeholder={placeholder}
                    className={`w-full border rounded-lg p-2.5 pl-9 pr-8 focus:ring-2 focus:ring-blue-500 outline-none transition-all
                        ${error ? 'border-red-500 bg-red-50' : selectedStudent ? 'border-blue-300 bg-blue-50/30' : 'border-gray-300'}
                    `}
                />
                
                <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                
                {query && (
                    <button 
                        type="button"
                        onClick={clearSelection}
                        className="absolute right-2 top-2.5 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

            {/* Recommendation Panel */}
            {isOpen && (query.length >= 2 || results.length > 0) && (
                <div className="absolute z-50 w-full bg-white mt-1 border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto overflow-x-hidden animate-in fade-in zoom-in-95 duration-100 scrollbar-thin scrollbar-thumb-gray-200">
                    {loading ? (
                        <div className="p-4 text-center text-gray-400 text-sm">Searching...</div>
                    ) : results.length > 0 ? (
                        <ul>
                            {results.map((student) => (
                                <li 
                                    key={student._id}
                                    onClick={() => handleSelect(student)}
                                    className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0 flex justify-between items-center group"
                                >
                                    <div>
                                        <p className="font-medium text-gray-800 text-sm">
                                            {student.firstName} {student.lastName}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Reg: {student.regNo || 'N/A'} • {student.course?.name || 'No Course'}
                                        </p>
                                    </div>
                                    {selectedStudent && selectedStudent._id === student._id && (
                                        <Check size={16} className="text-blue-600" />
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-center text-gray-400 text-sm">
                            No students found matching "{query}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentSearch;
