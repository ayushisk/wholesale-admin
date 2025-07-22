import { createSlice } from "@reduxjs/toolkit";
import {
  createProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
} from "../actions/productAction";

const initialState = {
  productList: [],
  isLoading: false,
  isError: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearError: (state) => {
      state.isError = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Products
      .addCase(getAllProducts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        // Handle different response structures
        if (action.payload?.products) {
          state.productList = action.payload.products;
        } else if (action.payload?.data?.products) {
          state.productList = action.payload.data.products;
        } else if (action.payload?.data) {
          state.productList = action.payload.data;
        } else if (Array.isArray(action.payload)) {
          state.productList = action.payload;
        } else {
          console.error("Unexpected payload structure:", action.payload);
          state.productList = [];
        }
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload || "Failed to load products";
        state.productList = [];
      })

      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle different response structures for created product
        const newProduct =
          action.payload?.product ||
          action.payload?.data?.product ||
          action.payload;
        if (newProduct) {
          state.productList.unshift(newProduct);
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload || "Failed to create product";
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        // action.payload should be the deleted product ID
        const deletedId = action.payload?.id || action.payload;
        state.productList = state.productList.filter(
          (product) => product._id !== deletedId
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload || "Failed to delete product";
      })

      // Update Product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updatedProduct =
          action.payload?.product ||
          action.payload?.data?.product ||
          action.payload;
        if (updatedProduct) {
          const index = state.productList.findIndex(
            (product) => product._id === updatedProduct._id
          );
          if (index !== -1) {
            state.productList[index] = updatedProduct;
          }
        }
      });
  },
});

export const { clearError } = productSlice.actions;
export default productSlice.reducer;
