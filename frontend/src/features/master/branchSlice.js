import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/branches`;

// Enable credentials for cookies
axios.defaults.withCredentials = true;
// Create new branch
export const createBranch = createAsyncThunk(
  'branches/create',
  async (branchData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token; // Assuming token is here, or managed via cookie
      // If using cookies (httpOnly), we might not need to send header if axios is configured with credentials: true
      // The server.js has cors credentials: true.
      // Let's assume axios instance or global config handles it, or send it if we have it in state.
      // But commonly with httpOnly cookies, we just make the request.
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      };
      
      const response = await axios.post(API_URL, branchData, config);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all branches
export const getBranches = createAsyncThunk(
  'branches/getAll',
  async (_, thunkAPI) => {
    try {
      const config = {
          withCredentials: true,
      };
      // Add timestamp to prevent caching (Service Worker/Browser 304 issue)
      const response = await axios.get(`${API_URL}?_t=${Date.now()}`, config);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all public active branches
export const getPublicBranches = createAsyncThunk(
  'branches/getPublic',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL + '/public');
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all active employees
export const getBranchEmployees = createAsyncThunk(
  'branches/getEmployees',
  async (_, thunkAPI) => {
    try {
      const config = {
        withCredentials: true,
      };
      // Adjusted route to fetch ALL candidates
      const response = await axios.get(`${API_URL}/employees/list`, config);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update branch
export const updateBranch = createAsyncThunk(
  'branches/update',
  async ({ id, branchData }, thunkAPI) => {
    try {
        const config = {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
        };
      const response = await axios.put(API_URL + '/' + id, branchData, config);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete branch
export const deleteBranch = createAsyncThunk(
  'branches/delete',
  async (id, thunkAPI) => {
    try {
        const config = {
            withCredentials: true,
        };
      await axios.delete(API_URL + '/' + id, config);
      return id;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const branchSlice = createSlice({
  name: 'branch',
  initialState: {
    branches: [],
    branchEmployees: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
  },
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBranch.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBranch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Only add if payload is valid
        if (action.payload && action.payload._id) {
            state.branches.unshift(action.payload); // Add to top for immediate visibility
        } else {
             console.error("Invalid branch payload received:", action.payload);
        }
      })
      .addCase(createBranch.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getBranches.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBranches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.branches = action.payload;
      })
      .addCase(getBranches.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getPublicBranches.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPublicBranches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.branches = action.payload;
      })
      .addCase(getPublicBranches.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateBranch.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBranch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.branches = state.branches.map((branch) =>
          branch._id === action.payload._id ? action.payload : branch
        );
      })
      .addCase(updateBranch.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteBranch.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.branches = state.branches.filter(
          (branch) => branch._id !== action.payload
        );
      })
      .addCase(deleteBranch.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getBranchEmployees.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBranchEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.branchEmployees = action.payload;
      })
      .addCase(getBranchEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = branchSlice.actions;
export default branchSlice.reducer;
