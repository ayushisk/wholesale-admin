import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { adminApiClient } from "../lib/api";
// import { adminApiClient } from "../../lib/api.js";

export const loginAdmin = createAsyncThunk(
  "admin/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await adminApiClient.login(userData);
      toast.success("Admin logged in successfully", { position: "top-right" });
      return response;
    } catch (error) {
      toast.error(error.message || "Login failed", { position: "top-right" });
      return rejectWithValue(error.message);
    }
  }
);

export const adminLogout = createAsyncThunk(
  "admin/logout",
  async (_, { rejectWithValue }) => {
    try {
      await adminApiClient.logout();
      toast.success("Admin logged out successfully", { position: "top-right" });
      return { success: true };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  "admin/checkAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApiClient.checkAuth();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
