import { createSlice } from "@reduxjs/toolkit";
import { getAllOrders, updateOrder, deleteOrder } from "../actions/orderAction";

const initialState = {
  orderList: [],
  isLoading: false,
  isError: false,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload;
      })
      .addCase(getAllOrders.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })

      .addCase(updateOrder.fulfilled, (state, action) => {
        const updated = action.payload;
        state.orderList = state.orderList.map((order) =>
          order._id === updated._id ? updated : order
        );
      })

      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orderList = state.orderList.filter(
          (order) => order._id !== action.payload
        );
      });
  },
});

export default orderSlice.reducer;
