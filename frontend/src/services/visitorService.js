import axios from 'axios';

// Assuming vite proxy is set up or base URL is defined elsewhere. 
// If not, we might need a config file, but usually axios instance is preferred.
// For now using relative path assuming proxy.

// const API_URL = 'http://localhost:5000/api/visitors';
const API_URL = `${import.meta.env.VITE_API_URL}/visitors`;

// for production use uncomment below one line
// const API_URL = '/api/visitors';


const createVisitor = async (visitorData) => {
    const response = await axios.post(`${API_URL}/create`, visitorData);
    return response.data;
};

const getAllVisitors = async (filters = {}) => {
    const { fromDate, toDate, search, limit } = filters;
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    if (search) params.append('search', search);
    if (limit) params.append('limit', limit);

    const response = await axios.get(`${API_URL}/all?${params.toString()}`);
    return response.data;
};

const getVisitorById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

const updateVisitor = async (id, visitorData) => {
    const response = await axios.put(`${API_URL}/${id}`, visitorData);
    return response.data;
};

const deleteVisitor = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

export default {
    createVisitor,
    getAllVisitors,
    getVisitorById,
    updateVisitor,
    deleteVisitor
};
