import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminAuthService from "./adminService";

// Get admin from local storage
const admin = JSON.parse(localStorage.getItem("admin"));

const initialState = {
  admin: admin ? admin : null,
  users: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  isUserAdded: false,
  message: "",
};

// Admin Login
export const adminLogin = createAsyncThunk(
  "auth/adminLogin",
  async (admin, thunkAPI) => {
    try {
      return await adminAuthService.adminLogin(admin);
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

// Admin Logout
export const adminLogout = createAsyncThunk("auth/logout", async () => {
  await adminAuthService.adminLogout();
});

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
      state.isUserAdded = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.admin = action.payload;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(adminLogout.fulfilled, (state, action) => {
        state.admin = null;
      });
  },
});

export const { reset } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
