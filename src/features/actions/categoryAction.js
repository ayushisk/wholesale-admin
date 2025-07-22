import { createAsyncThunk } from "@reduxjs/toolkit";
// import { adminApiClient } from "../../lib/api.js";
import { toast } from "react-toastify";
import { adminApiClient } from "../lib/api";

export const getAllCategories = createAsyncThunk(
  "get/categories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApiClient.getCategories();
      return response;
    } catch (error) {
      toast.error(error.message || "Failed to load categories");
      return rejectWithValue(error.message);
    }
  }
);

export const getCategoryTree = createAsyncThunk(
  "get/categoryTree",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApiClient.getCategoryTree();
      return response;
    } catch (error) {
      toast.error(error.message || "Failed to load category tree");
      return rejectWithValue(error.message);
    }
  }
);

export const getParentCategories = createAsyncThunk(
  "get/parentCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApiClient.getParentCategories();
      return response;
    } catch (error) {
      toast.error(error.message || "Failed to load parent categories");
      return rejectWithValue(error.message);
    }
  }
);

export const addCategory = createAsyncThunk(
  "category/add",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await adminApiClient.createCategory(categoryData);
      toast.success("Category created successfully");
      return response;
    } catch (error) {
      toast.error(error.message || "Failed to add category");
      return rejectWithValue(error.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "category/update",
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const response = await adminApiClient.updateCategory(id, categoryData);
      toast.success("Category updated successfully");
      return response;
    } catch (error) {
      toast.error(error.message || "Failed to update category");
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "category/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await adminApiClient.deleteCategory(id);
      toast.success("Category deleted successfully");
      return { id, data: response };
    } catch (error) {
      toast.error(error.message || "Failed to delete category");
      return rejectWithValue(error.message);
    }
  }
);
