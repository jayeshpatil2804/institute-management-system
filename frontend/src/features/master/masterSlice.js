import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL + '/master/';
const API_URL = `${import.meta.env.VITE_API_URL}/master/`;
axios.defaults.withCredentials = true;

// --- Course Thunks ---
export const fetchCourses = createAsyncThunk('master/fetchCourses', async (params, thunkAPI) => {
    try {
        const response = await axios.get(API_URL + 'course', { params });
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

export const createCourse = createAsyncThunk('master/createCourse', async (data, thunkAPI) => {
    try {
        let payload = data;
        let headers = {};

        if (data.image instanceof File) {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (key === 'subjects') {
                    formData.append(key, JSON.stringify(data[key]));
                } else if (data[key] !== null) {
                    formData.append(key, data[key]);
                }
            });
            payload = formData;
            headers = { 'Content-Type': 'multipart/form-data' };
        }

        const response = await axios.post(API_URL + 'course', payload, { headers });
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.response.data.message); }
});

export const updateCourse = createAsyncThunk('master/updateCourse', async ({ id, data }, thunkAPI) => {
    try {
        let payload = data;
        let headers = {};

        if (data.image instanceof File) {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (key === 'subjects') {
                    formData.append(key, JSON.stringify(data[key]));
                } else if (data[key] !== null) {
                    formData.append(key, data[key]);
                }
            });
            payload = formData;
            headers = { 'Content-Type': 'multipart/form-data' };
        }

        const response = await axios.put(`${API_URL}course/${id}`, payload, { headers });
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.response.data.message); }
});

export const deleteCourse = createAsyncThunk('master/deleteCourse', async (id, thunkAPI) => {
    try {
        const response = await axios.delete(`${API_URL}course/${id}`);
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

// --- Batch Thunks ---
export const fetchBatches = createAsyncThunk('master/fetchBatches', async (params, thunkAPI) => {
    try {
        const response = await axios.get(API_URL + 'batch', { params });
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

export const createBatch = createAsyncThunk('master/createBatch', async (data, thunkAPI) => {
    try {
        const response = await axios.post(API_URL + 'batch', data);
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.response.data.message); }
});

export const updateBatch = createAsyncThunk('master/updateBatch', async ({ id, data }, thunkAPI) => {
    try {
        const response = await axios.put(`${API_URL}batch/${id}`, data);
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.response.data.message); }
});

export const deleteBatch = createAsyncThunk('master/deleteBatch', async (id, thunkAPI) => {
    try {
        const response = await axios.delete(`${API_URL}batch/${id}`);
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});


// --- Subject Thunks ---
export const fetchSubjects = createAsyncThunk('master/fetchSubjects', async (params, thunkAPI) => {
    try {
        const response = await axios.get(API_URL + 'subject', { params });
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

export const createSubject = createAsyncThunk('master/createSubject', async (data, thunkAPI) => {
    try {
        const response = await axios.post(API_URL + 'subject', data);
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.response.data.message); }
});

export const updateSubject = createAsyncThunk('master/updateSubject', async ({ id, data }, thunkAPI) => {
    try {
        const response = await axios.put(`${API_URL}subject/${id}`, data);
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.response.data.message); }
});

export const deleteSubject = createAsyncThunk('master/deleteSubject', async (id, thunkAPI) => {
    try {
        const response = await axios.delete(`${API_URL}subject/${id}`);
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

export const fetchEmployees = createAsyncThunk('master/fetchEmployees', async (_, thunkAPI) => {
    try {
        const response = await axios.get(API_URL + 'employee');
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

export const fetchExamRequests = createAsyncThunk('master/fetchExamRequests', async (params, thunkAPI) => {
    try {
        const response = await axios.get(API_URL + 'exam-request', { params });
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

export const cancelExamRequest = createAsyncThunk('master/cancelExamRequest', async (id, thunkAPI) => {
    try {
        await axios.put(`${API_URL}exam-request/${id}/cancel`);
        return id;
    } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

export const fetchExamSchedules = createAsyncThunk('master/fetchExamSchedules', async (params, thunkAPI) => {
    try {
        const response = await axios.get(API_URL + 'exam-schedule', { params });
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

export const createExamSchedule = createAsyncThunk('master/createExamSchedule', async (data, thunkAPI) => {
    try {
        const response = await axios.post(API_URL + 'exam-schedule', data);
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

export const updateExamSchedule = createAsyncThunk('master/updateExamSchedule', async ({ id, data }, thunkAPI) => {
    try {
        const response = await axios.put(`${API_URL}exam-schedule/${id}`, data);
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

export const deleteExamSchedule = createAsyncThunk('master/deleteExamSchedule', async (id, thunkAPI) => {
    try {
        const response = await axios.delete(`${API_URL}exam-schedule/${id}`);
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

export const fetchExamResults = createAsyncThunk('master/fetchExamResults', async (params, thunkAPI) => {
    try {
        const response = await axios.get(API_URL + 'exam-result', { params });
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

export const fetchPendingExams = createAsyncThunk('master/fetchPendingExams', async (params, thunkAPI) => {
    try {
        const response = await axios.get(API_URL + 'exam-pending', { params });
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

export const createExamResult = createAsyncThunk('master/createExamResult', async (data, thunkAPI) => {
    try {
        const response = await axios.post(API_URL + 'exam-result', data);
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

export const updateExamResult = createAsyncThunk('master/updateExamResult', async ({ id, data }, thunkAPI) => {
    try {
        const response = await axios.put(`${API_URL}exam-result/${id}`, data);
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

// --- Reference Thunks ---
export const fetchReferences = createAsyncThunk('master/fetchReferences', async (_, thunkAPI) => {
    try {
        const response = await axios.get(API_URL + 'reference');
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

export const createReference = createAsyncThunk('master/createReference', async (data, thunkAPI) => {
    try {
        const response = await axios.post(API_URL + 'reference', data);
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

// --- Education Thunks ---
export const fetchEducations = createAsyncThunk('master/fetchEducations', async (_, thunkAPI) => {
    try {
        const response = await axios.get(API_URL + 'education');
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

// --- Branch Thunks ---
export const fetchBranches = createAsyncThunk('master/fetchBranches', async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/branches`); // Note: Not under /master/
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

export const createEducation = createAsyncThunk('master/createEducation', async (data, thunkAPI) => {
    try {
        const response = await axios.post(API_URL + 'education', data);
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.response.data.message); }
});

const masterSlice = createSlice({
    name: 'master',
    initialState: {
        courses: [],
        batches: [],
        employees: [],
        subjects: [],
        examRequests: [],
        studentsList: [],
        examSchedules: [],
        examResults: [],
        examSchedules: [],
        examResults: [],
        pendingExams: [],
        references: [],
        references: [],
        educations: [],
        branches: [],
        isLoading: false,
        isSuccess: false,
        message: ''
    },
    reducers: {
        resetMasterStatus: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            // --- Courses ---
            .addCase(fetchCourses.fulfilled, (state, action) => { state.courses = action.payload; })
            .addCase(createCourse.fulfilled, (state, action) => {
                state.courses.push(action.payload);
                state.isSuccess = true;
                state.message = 'Course Added';
            })
            .addCase(updateCourse.fulfilled, (state, action) => {
                const index = state.courses.findIndex(c => c._id === action.payload._id);
                if (index !== -1) state.courses[index] = action.payload;
                state.isSuccess = true;
                state.message = 'Course Updated Successfully';
            })
            .addCase(deleteCourse.fulfilled, (state, action) => {
                state.courses = state.courses.filter(c => c._id !== action.payload.id);
                state.isSuccess = true;
                state.message = 'Course Deleted Successfully';
            })
            
            // --- Batches ---
            .addCase(fetchBatches.fulfilled, (state, action) => { 
                state.batches = action.payload; 
            })
            .addCase(createBatch.fulfilled, (state, action) => {
                state.batches.unshift(action.payload);
                state.isSuccess = true;
                state.message = 'Batch Added';
            })
            .addCase(updateBatch.fulfilled, (state, action) => {
                const index = state.batches.findIndex(b => b._id === action.payload._id);
                if (index !== -1) state.batches[index] = action.payload;
                state.isSuccess = true;
                state.message = 'Batch Updated Successfully';
            })
            .addCase(deleteBatch.fulfilled, (state, action) => {
                state.batches = state.batches.filter(b => b._id !== action.payload.id);
                state.isSuccess = true;
                state.message = 'Batch Deleted Successfully';
            })
            
            // --- Employees ---
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.employees = action.payload;
            })
            
            // --- Subjects (Consolidated) ---
            .addCase(fetchSubjects.pending, (state) => { state.isLoading = true; })
            .addCase(fetchSubjects.fulfilled, (state, action) => {
                state.isLoading = false;
                state.subjects = action.payload;
            })
            .addCase(fetchSubjects.rejected, (state, action) => {
                state.isLoading = false;
                console.error(action.payload);
            })
            .addCase(createSubject.pending, (state) => { state.isLoading = true; })
            .addCase(createSubject.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = 'Subject Created Successfully';
                state.subjects.unshift(action.payload); 
            })
            .addCase(createSubject.rejected, (state, action) => {
                state.isLoading = false;
                state.message = action.payload;
                state.isSuccess = false; 
            })
            .addCase(updateSubject.fulfilled, (state, action) => {
                const index = state.subjects.findIndex(s => s._id === action.payload._id);
                if (index !== -1) {
                    state.subjects[index] = action.payload;
                }
                state.isSuccess = true;
                state.message = 'Subject Updated Successfully';
            })
            .addCase(deleteSubject.fulfilled, (state, action) => {
                state.subjects = state.subjects.filter(s => s._id !== action.payload.id);
                state.isSuccess = true;
                state.message = 'Subject Deleted Successfully';
            })

            // --- Exam Requests ---
            .addCase(fetchExamRequests.pending, (state) => { state.isLoading = true; })
            .addCase(fetchExamRequests.fulfilled, (state, action) => {
                state.isLoading = false;
                state.examRequests = action.payload;
            })
            .addCase(cancelExamRequest.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = 'Exam Cancelled';
                state.examRequests = state.examRequests.filter(req => req._id !== action.payload);
            })
            
            // --- Exam Schedules ---
            .addCase(fetchExamSchedules.fulfilled, (state, action) => {
                state.examSchedules = action.payload;
            })
            .addCase(createExamSchedule.fulfilled, (state, action) => {
                state.examSchedules.unshift(action.payload);
                state.isSuccess = true;
                state.message = 'Exam Schedule Created';
            })
            .addCase(updateExamSchedule.fulfilled, (state, action) => {
                const index = state.examSchedules.findIndex(s => s._id === action.payload._id);
                if (index !== -1) state.examSchedules[index] = action.payload;
                state.isSuccess = true;
                state.message = 'Exam Schedule Updated';
            })
            .addCase(deleteExamSchedule.fulfilled, (state, action) => {
                state.examSchedules = state.examSchedules.filter(s => s._id !== action.payload.id);
                state.isSuccess = true;
                state.message = 'Exam Schedule Deleted';
            })

            // --- Exam Results ---
            .addCase(fetchExamResults.fulfilled, (state, action) => {
                state.examResults = action.payload;
            })
            .addCase(createExamResult.fulfilled, (state, action) => {
                state.examResults.unshift(action.payload);
                state.isSuccess = true;
                state.message = 'Result Added Successfully';
            })
            .addCase(updateExamResult.fulfilled, (state, action) => {
                const index = state.examResults.findIndex(r => r._id === action.payload._id);
                if (index !== -1) state.examResults[index] = action.payload;
                state.isSuccess = true;
                state.message = 'Result Updated Successfully';
            })
            
            // --- Dashboard/Pending ---
            .addCase(fetchPendingExams.fulfilled, (state, action) => {
                state.pendingExams = action.payload;
            })
            
            // --- References ---
            .addCase(fetchReferences.fulfilled, (state, action) => { state.references = action.payload; })
            .addCase(createReference.fulfilled, (state, action) => {
                state.references.unshift(action.payload);
                state.isSuccess = true;
                state.message = 'Reference Added Successfully';
            })
            
            // --- Educations ---
            .addCase(fetchEducations.fulfilled, (state, action) => { state.educations = action.payload; })
            .addCase(createEducation.fulfilled, (state, action) => {
                state.educations.push(action.payload); // push to sort alphabetically usually handled by backend but good here
                state.isSuccess = true;
                state.message = 'Education Added Successfully';
            })
            
            // --- Branches ---
            .addCase(fetchBranches.fulfilled, (state, action) => { state.branches = action.payload; });
    }
});

export const { resetMasterStatus } = masterSlice.actions;
export default masterSlice.reducer;