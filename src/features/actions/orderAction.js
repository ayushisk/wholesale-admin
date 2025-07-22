import { createAsyncThunk } from "@reduxjs/toolkit";
// import { adminApiClient } from "../../lib/api.js";
import { toast } from "react-toastify";
import { adminApiClient } from "../lib/api";

// GET all orders (admin only)
export const getAllOrders = createAsyncThunk(
  "order/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApiClient.getOrders();
      return response;
    } catch (error) {
      toast.error("Failed to load orders");
      return rejectWithValue(error.message);
    }
  }
);

// UPDATE order status
export const updateOrder = createAsyncThunk(
  "order/update",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await adminApiClient.updateOrderStatus(id, status);
      toast.success("Order status updated");
      return response;
    } catch (error) {
      toast.error("Failed to update order");
      return rejectWithValue(error.message);
    }
  }
);

// DELETE order (optional - if allowed in backend)
export const deleteOrder = createAsyncThunk(
  "order/delete",
  async (id, { rejectWithValue }) => {
    try {
      await adminApiClient.deleteOrder(id);
      toast.success("Order deleted");
      return id;
    } catch (error) {
      toast.error("Failed to delete order");
      return rejectWithValue(error.message);
    }
  }
);
