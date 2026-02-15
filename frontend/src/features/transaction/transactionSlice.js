import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL + '/transaction/';
const API_URL = `${import.meta.env.VITE_API_URL}/transaction/`;

axios.defaults.withCredentials = true;

// Fetch Inquiries with optional filters
export const fetchInquiries = createAsyncThunk(
  "transaction/fetchInquiries",
  async (filters = {}, thunkAPI) => {
    try {
      const response = await axios.get(API_URL + "inquiry", {
        params: filters,
      });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Create Public Inquiry (No Auth)
export const createPublicInquiry = createAsyncThunk(
  "transaction/createPublicInquiry",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(API_URL + "public/inquiry", data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Create Inquiry
export const createInquiry = createAsyncThunk(
  "transaction/createInquiry",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(API_URL + "inquiry", data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Update Inquiry (General update for status/follow-up)
export const updateInquiry = createAsyncThunk(
  "transaction/updateInquiry",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axios.put(`${API_URL}inquiry/${id}`, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Collect Fees
export const collectFees = createAsyncThunk(
  "transaction/collectFees",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(API_URL + "fees", data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Fetch Receipts
export const fetchFeeReceipts = createAsyncThunk(
  "transaction/fetchFeeReceipts",
  async (filters = {}, thunkAPI) => {
    try {
      const response = await axios.get(API_URL + "fees", { params: filters });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Update Receipt
export const updateFeeReceipt = createAsyncThunk(
  "transaction/updateFeeReceipt",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await axios.put(`${API_URL}fees/${id}`, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Delete Receipt
export const deleteFeeReceipt = createAsyncThunk(
  "transaction/deleteFeeReceipt",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}fees/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Fetch Ledger Data
export const fetchLedger = createAsyncThunk(
  "transaction/fetchLedger",
  async (queryParams, thunkAPI) => {
    try {
      // queryParams can be { studentId: '...' } or { regNo: '...' }
      const response = await axios.get(API_URL + "ledger", {
        params: queryParams,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    inquiries: [],
    receipts: [],
    ledgerData: null, // Store ledger data
    isLoading: false,
    isSuccess: false,
    message: "",
  },
  reducers: {
    resetTransaction: (state) => {
      state.isSuccess = false;
      state.message = "";
      state.ledgerData = null; // Reset ledger on leave
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInquiries.fulfilled, (state, action) => {
        state.inquiries = action.payload;
      })
      .addCase(createInquiry.fulfilled, (state, action) => {
        state.inquiries.unshift(action.payload);
        state.isSuccess = true;
        state.message = "Inquiry Added Successfully";
      })
      .addCase(createPublicInquiry.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.message = "Inquiry Submitted Successfully";
      })
      .addCase(updateInquiry.fulfilled, (state, action) => {
        const index = state.inquiries.findIndex(
          (i) => i._id === action.payload._id
        );
        if (index !== -1) {
          state.inquiries[index] = action.payload;
        }
        state.isSuccess = true;
        state.message = "Inquiry Updated";
      })
      .addCase(collectFees.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.message = `Fee Receipt Generated: ${action.payload.receiptNo}`;
        state.receipts.unshift(action.payload);
      })
      .addCase(fetchFeeReceipts.fulfilled, (state, action) => {
        state.receipts = action.payload;
      })
      .addCase(updateFeeReceipt.fulfilled, (state, action) => {
        const index = state.receipts.findIndex(
          (r) => r._id === action.payload._id
        );
        if (index !== -1) state.receipts[index] = action.payload;
        state.isSuccess = true;
        state.message = "Receipt Updated Successfully";
      })
      .addCase(deleteFeeReceipt.fulfilled, (state, action) => {
        state.receipts = state.receipts.filter((r) => r._id !== action.payload);
        state.isSuccess = true;
        state.message = "Receipt Deleted Successfully";
      })
      .addCase(fetchLedger.pending, (state) => {
        state.isLoading = true;
        state.ledgerData = null;
      })
      .addCase(fetchLedger.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ledgerData = action.payload;
      })
      .addCase(fetchLedger.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.payload;
      });
  },
});

export const { resetTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;
