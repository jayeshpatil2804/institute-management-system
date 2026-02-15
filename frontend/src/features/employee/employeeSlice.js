import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/employees/`;

axios.defaults.withCredentials = true;

export const fetchEmployees = createAsyncThunk('employees/fetchAll', async (filters, thunkAPI) => {
    try {
        const response = await axios.get(API_URL, { params: filters });
        return response.data;
    } catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

export const createEmployee = createAsyncThunk('employees/create', async (data, thunkAPI) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) { 
        const message = (error.response && error.response.data && error.response.data.message) || error.message;
        return thunkAPI.rejectWithValue(message); 
    }
});

export const updateEmployee = createAsyncThunk('employees/update', async ({ id, data }, thunkAPI) => {
    try {
        const response = await axios.put(API_URL + id, data);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const deleteEmployee = createAsyncThunk('employees/delete', async (id, thunkAPI) => {
    try {
        const response = await axios.delete(API_URL + id);
        return response.data; // Expecting { id: ..., message: ... }
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const employeeSlice = createSlice({
    name: 'employees',
    initialState: {
        employees: [],
        isLoading: false,
        isSuccess: false,
        message: ''
    },
    reducers: {
        resetEmployeeStatus: (state) => {
            state.isSuccess = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.employees = action.payload;
            })
            .addCase(createEmployee.fulfilled, (state, action) => {
                state.employees.unshift(action.payload);
                state.isSuccess = true;
                state.message = 'Employee Added Successfully';
            })
            .addCase(updateEmployee.fulfilled, (state, action) => {
                const index = state.employees.findIndex(e => e._id === action.payload._id);
                if (index !== -1) {
                    state.employees[index] = action.payload;
                }
                state.isSuccess = true;
                state.message = 'Employee Updated Successfully';
            })
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                state.employees = state.employees.filter(e => e._id !== action.payload.id);
                state.isSuccess = true;
                state.message = 'Employee Deleted Successfully';
            });
    }
});

export const { resetEmployeeStatus } = employeeSlice.actions;
export default employeeSlice.reducer;