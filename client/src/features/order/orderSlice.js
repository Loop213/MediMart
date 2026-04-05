import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "@/services/api";
import { logout } from "@/features/auth/authSlice";

export const placeOrder = createAsyncThunk("order/place", async (formData) => {
  const { data } = await api.post("/order/place", formData);
  return data;
});

export const fetchUserOrders = createAsyncThunk("order/userOrders", async () => {
  const { data } = await api.get("/order/user");
  return data;
});

export const uploadOrderPrescription = createAsyncThunk("order/uploadPrescription", async ({ id, formData }) => {
  const { data } = await api.post(`/order/upload-prescription/${id}`, formData);
  return data;
});

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    loading: false,
    lastPlacedOrder: null,
  },
  reducers: {
    clearPlacedOrder: (state) => {
      state.lastPlacedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.lastPlacedOrder = action.payload;
        state.orders.unshift(action.payload);
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(uploadOrderPrescription.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.map((order) => (order._id === action.payload._id ? action.payload : order));
      })
      .addCase(logout, (state) => {
        state.orders = [];
        state.loading = false;
        state.lastPlacedOrder = null;
      })
      .addMatcher(
        (action) =>
          ["order/place/pending", "order/userOrders/pending", "order/uploadPrescription/pending"].includes(action.type),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("order/") && action.type.endsWith("/rejected"),
        (state) => {
          state.loading = false;
        }
      );
  },
});

export const { clearPlacedOrder } = orderSlice.actions;
export default orderSlice.reducer;
