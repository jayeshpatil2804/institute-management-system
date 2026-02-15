import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Save, FileText } from 'lucide-react';

const ManageTerms = () => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchTerms();
    }, []);

    const fetchTerms = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/master/terms`, { withCredentials: true });
            setContent(data.content || '');
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load Terms");
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!content.trim()) return toast.error("Content cannot be empty");
        
        setSaving(true);
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/master/terms`, { content }, { withCredentials: true });
            toast.success("Terms and Conditions Updated!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update Terms");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="container mx-auto p-6 max-w-4xl">
             <div className="flex items-center gap-3 mb-6 border-b pb-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary">
                    <FileText size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Manage Terms & Conditions</h1>
                    <p className="text-sm text-gray-500">Update the terms and conditions displayed on the Online Admission form.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <label htmlFor="terms-content" className="block text-sm font-semibold text-gray-700 mb-2">Terms Content (Markdown Supported)</label>
                <textarea 
                    id="terms-content"
                    className="w-full h-96 border rounded-lg p-4 font-mono text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="Enter terms and conditions here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
                <div className="mt-6 flex justify-end">
                    <button 
                        onClick={handleSave} 
                        disabled={saving}
                        className="bg-primary hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-70"
                    >
                        {saving ? 'Saving...' : <><Save size={18}/> Save Changes</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageTerms;
