import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
    const [terms, setTerms] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTerms = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/master/terms`);
                setTerms(data.content || "No terms and conditions defined yet.");
            } catch (error) {
                console.error("Failed to fetch terms", error);
                setTerms("Failed to load Terms and Conditions.");
            } finally {
                setLoading(false);
            }
        };
        fetchTerms();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-primary px-6 py-4 flex items-center gap-4">
                    <Link to="/online-admission" className="text-white hover:bg-white/20 p-2 rounded-full transition-colors" aria-label="Back to Admission Form">
                        <ArrowLeft size={20} />
                    </Link>                    <h1 className="text-xl font-bold text-white">Terms and Conditions</h1>
                </div>
                
                <div className="p-8">
                    {loading ? (
                         <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {terms}
                        </div>
                    )}
                </div>
                
                <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 flex justify-end">
                     <Link to="/online-admission" className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md">
                        Back to Admission Form
                     </Link>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
