import { createSlice } from "@reduxjs/toolkit";
import {
  getAllCategories,
  getCategoryTree,
  addCategory,
} from "../actions/categoryAction";

const initialState = {
  categoryList: [],
  categoryTree: [],
  isLoading: false,
  isError: false,
  error: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearError: (state) => {
      state.isError = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all categories
      .addCase(getAllCategories.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categoryList = action.payload.data || action.payload;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })

      // Get category tree
      .addCase(getCategoryTree.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getCategoryTree.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categoryTree = action.payload.data || action.payload;
      })
      .addCase(getCategoryTree.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })

      // Add category
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categoryList.push(action.payload.data || action.payload);
      });
  },
});

export const { clearError } = categorySlice.actions;
export default categorySlice.reducer;
