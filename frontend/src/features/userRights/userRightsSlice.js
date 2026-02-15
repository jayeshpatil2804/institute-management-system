import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL + '/user-rights/';
const API_URL = `${import.meta.env.VITE_API_URL}/user-rights/`;
axios.defaults.withCredentials = true;

// Fetch Rights for a specific user (Admin usage)
export const fetchUserRights = createAsyncThunk('userRights/fetch', async (userId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user?.token; // Assuming token mechanism if stored, or relying on cookies
    const response = await axios.get(API_URL + userId);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// Save Rights (Admin usage)
export const saveUserRights = createAsyncThunk('userRights/save', async (data, thunkAPI) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// Fetch Current User's Rights (For Navbar/Protection)
export const fetchMyPermissions = createAsyncThunk('userRights/fetchMy', async (_, thunkAPI) => {
  try {
    const response = await axios.get(API_URL + 'me');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// Fetch All Templates
export const fetchTemplates = createAsyncThunk('userRights/fetchTemplates', async (_, thunkAPI) => {
  try {
    const response = await axios.get(API_URL + 'templates');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// Create Template
export const createTemplate = createAsyncThunk('userRights/createTemplate', async (data, thunkAPI) => {
  try {
    const response = await axios.post(API_URL + 'templates', data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

// Delete Template
export const deleteTemplate = createAsyncThunk('userRights/deleteTemplate', async (id, thunkAPI) => {
  try {
    await axios.delete(API_URL + 'templates/' + id);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

const userRightsSlice = createSlice({
  name: 'userRights',
  initialState: {
    rights: { permissions: [] }, // The rights being edited
    myPermissions: [], // The logged-in user's permissions
    templates: [], // List of templates
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ''
  },
  reducers: {
    resetRightsState: (state) => {
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserRights.pending, (state) => { state.isLoading = true; })
      .addCase(fetchUserRights.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rights = action.payload;
      })
      .addCase(saveUserRights.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = 'Rights saved successfully';
      })
      .addCase(fetchMyPermissions.fulfilled, (state, action) => {
        state.myPermissions = action.payload;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.templates = action.payload;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.templates.push(action.payload);
        state.isSuccess = true;
        state.message = 'Template created successfully';
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.templates = state.templates.filter(t => t._id !== action.payload);
        state.isSuccess = true;
        state.message = 'Template deleted successfully';
      });
  }
});

export const { resetRightsState } = userRightsSlice.actions;
export default userRightsSlice.reducer;