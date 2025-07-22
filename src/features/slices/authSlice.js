import { createSlice } from "@reduxjs/toolkit";
import {
  loginAdmin,
  adminLogout,
  checkAuthStatus,
} from "../actions/authAction.js";

const initialState = {
  user: null,
  isAdminLoggedIn: false,
  isLoading: false,
  isError: false,
  error: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.isError = false;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAdminLoggedIn = false;
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAdminLoggedIn = true;
        state.isInitialized = true;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
        state.isAdminLoggedIn = false;
        state.isInitialized = true;
      })
      // Logout
      .addCase(adminLogout.fulfilled, (state) => {
        state.user = null;
        state.isAdminLoggedIn = false;
        state.isInitialized = true;
      })
      // Check Auth Status
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.user?.role === "admin") {
          state.user = action.payload.user;
          state.isAdminLoggedIn = true;
          state.isInitialized = true;
        }
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false;
        state.isAdminLoggedIn = false;
        state.user = null;
        state.isInitialized = true;
      });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;
