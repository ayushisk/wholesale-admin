import { createAsyncThunk } from "@reduxjs/toolkit";
import { adminApiClient } from "../lib/api.js";
import { toast } from "react-toastify";

// Get All Products
export const getAllProducts = createAsyncThunk(
  "products/getAll",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching products..."); // Debug log
      const response = await adminApiClient.getProducts();
      console.log("API Response:", response); // Debug log
      return response;
    } catch (error) {
      console.error("API Error:", error); // Debug log
      const errorMessage = error.message;
      toast.error(errorMessage || "Failed to load products");
      return rejectWithValue(errorMessage);
    }
  }
);

// Create Product
export const createProduct = createAsyncThunk(
  "product/create",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await adminApiClient.createProduct(productData);
      toast.success("Product created successfully");
      return response;
    } catch (error) {
      const errorMessage = error.message;
      toast.error(errorMessage || "Failed to create product");
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete Product
export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (id, { rejectWithValue }) => {
    try {
      await adminApiClient.deleteProduct(id);
      toast.success("Product deleted successfully");
      return id; // Return the ID for filtering
    } catch (error) {
      const errorMessage = error.message;
      toast.error(errorMessage || "Failed to delete product");
      return rejectWithValue(errorMessage);
    }
  }
);

// Update Product
export const updateProduct = createAsyncThunk(
  "product/update",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await adminApiClient.updateProduct(id, updatedData);
      toast.success("Product updated successfully");
      return response;
    } catch (error) {
      const errorMessage = error.message;
      toast.error(errorMessage || "Failed to update product");
      return rejectWithValue(errorMessage);
    }
  }
);
