import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL + '/transaction/attendance/';
const API_URL = `${import.meta.env.VITE_API_URL}/transaction/attendance/`;

axios.defaults.withCredentials = true;

// Student Thunks
export const fetchStudentsForAttendance = createAsyncThunk(
    'attendance/fetchStudents',
    async ({ batch, batchTime }, thunkAPI) => {
        try {
            const response = await axios.get(API_URL + 'student/list', { params: { batch, batchTime } });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const checkStudentAttendance = createAsyncThunk(
    'attendance/checkStudent',
    async ({ date, batch, batchTime }, thunkAPI) => {
        try {
            const response = await axios.get(API_URL + 'student/check', { params: { date, batch, batchTime } });
            return response.data; // { exists: bool, takenBy: string, record: object }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const saveStudentAttendance = createAsyncThunk(
    'attendance/saveStudent',
    async (data, thunkAPI) => {
        try {
            const response = await axios.post(API_URL + 'student/save', data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchStudentAttendanceHistory = createAsyncThunk(
    'attendance/fetchStudentHistory',
    async (params, thunkAPI) => {
        try {
            const response = await axios.get(API_URL + 'student/history', { params });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteStudentAttendance = createAsyncThunk(
    'attendance/deleteStudent',
    async (id, thunkAPI) => {
        try {
            await axios.delete(API_URL + `student/${id}`);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


// Employee Thunks
export const fetchEmployeesForAttendance = createAsyncThunk(
    'attendance/fetchEmployees',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(API_URL + 'employee/list');
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const checkEmployeeAttendance = createAsyncThunk(
    'attendance/checkEmployee',
    async ({ date }, thunkAPI) => {
        try {
            const response = await axios.get(API_URL + 'employee/check', { params: { date } });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const saveEmployeeAttendance = createAsyncThunk(
    'attendance/saveEmployee',
    async (data, thunkAPI) => {
        try {
            const response = await axios.post(API_URL + 'employee/save', data);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchEmployeeAttendanceHistory = createAsyncThunk(
    'attendance/fetchEmployeeHistory',
    async (params, thunkAPI) => {
        try {
            const response = await axios.get(API_URL + 'employee/history', { params });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteEmployeeAttendance = createAsyncThunk(
    'attendance/deleteEmployee',
    async (id, thunkAPI) => {
        try {
            await axios.delete(API_URL + `employee/${id}`);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


const attendanceSlice = createSlice({
    name: 'attendance',
    initialState: {
        attendanceList: [], // For history table
        currentAttendanceStudents: [], // For taking student attendance
        currentAttendanceEmployees: [], // For taking employee attendance
        attendanceStatus: null, // { exists, takenBy, record }
        isLoading: false,
        isSuccess: false,
        message: ''
    },
    reducers: {
        resetAttendanceState: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.message = '';
            state.attendanceStatus = null;
            state.currentAttendanceStudents = [];
            state.currentAttendanceEmployees = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Check Status
            .addCase(checkStudentAttendance.fulfilled, (state, action) => {
                state.attendanceStatus = action.payload;
            })
            .addCase(checkEmployeeAttendance.fulfilled, (state, action) => {
                state.attendanceStatus = action.payload;
            })
            
            // Lists for Taking Attendance
            .addCase(fetchStudentsForAttendance.pending, (state) => { state.isLoading = true; })
            .addCase(fetchStudentsForAttendance.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentAttendanceStudents = action.payload;
            })
            .addCase(fetchStudentsForAttendance.rejected, (state, action) => {
                state.isLoading = false;
                state.message = action.payload;
            })
            
            .addCase(fetchEmployeesForAttendance.pending, (state) => { state.isLoading = true; })
            .addCase(fetchEmployeesForAttendance.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentAttendanceEmployees = action.payload;
            })

            // Save
            .addCase(saveStudentAttendance.pending, (state) => { state.isLoading = true; })
            .addCase(saveStudentAttendance.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;
            })
            .addCase(saveStudentAttendance.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.message = action.payload;
            })
            
            .addCase(saveEmployeeAttendance.pending, (state) => { state.isLoading = true; })
            .addCase(saveEmployeeAttendance.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;
            })

            // History
            .addCase(fetchStudentAttendanceHistory.fulfilled, (state, action) => {
                state.attendanceList = action.payload;
            })
            .addCase(fetchEmployeeAttendanceHistory.fulfilled, (state, action) => {
                state.attendanceList = action.payload;
            })
            
            // Delete
            .addCase(deleteStudentAttendance.fulfilled, (state, action) => {
                state.attendanceList = state.attendanceList.filter(item => item._id !== action.payload);
                state.message = 'Deleted Successfully';
            })
            .addCase(deleteEmployeeAttendance.fulfilled, (state, action) => {
                state.attendanceList = state.attendanceList.filter(item => item._id !== action.payload);
                state.message = 'Deleted Successfully';
            });
    }
});

export const { resetAttendanceState } = attendanceSlice.actions;
export default attendanceSlice.reducer;
