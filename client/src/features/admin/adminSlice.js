import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "@/services/api";

export const fetchAdminStats = createAsyncThunk("admin/stats", async () => {
  const { data } = await api.get("/order/stats");
  return data;
});

export const fetchAdminOrders = createAsyncThunk("admin/orders", async (params = {}) => {
  const { data } = await api.get("/admin/orders", { params });
  return data;
});

export const updateAdminOrderStatus = createAsyncThunk("admin/updateOrder", async ({ id, orderStatus }) => {
  const { data } = await api.put(`/admin/order/status/${id}`, { orderStatus });
  return data;
});

export const verifyAdminPayment = createAsyncThunk("admin/verifyPayment", async ({ id, paymentStatus }) => {
  const { data } = await api.put(`/order/verify-payment/${id}`, { paymentStatus });
  return data;
});

export const reviewAdminPrescription = createAsyncThunk(
  "admin/reviewPrescription",
  async ({ id, prescriptionStatus }) => {
    const { data } = await api.put(`/order/review-prescription/${id}`, { prescriptionStatus });
    return data;
  }
);

export const deleteAdminOrder = createAsyncThunk("admin/deleteOrder", async (id) => {
  await api.delete(`/admin/order/${id}`);
  return id;
});

export const fetchCustomers = createAsyncThunk("admin/customers", async (params = {}) => {
  const { data } = await api.get("/admin/customers", { params });
  return data;
});

export const createCustomer = createAsyncThunk("admin/createCustomer", async (payload) => {
  const { data } = await api.post("/admin/customer", payload);
  return data;
});

export const updateCustomer = createAsyncThunk("admin/updateCustomer", async ({ id, payload }) => {
  const { data } = await api.put(`/admin/customer/${id}`, payload);
  return data;
});

export const deleteCustomer = createAsyncThunk("admin/deleteCustomer", async (id) => {
  await api.delete(`/admin/customer/${id}`);
  return id;
});

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    stats: null,
    orders: { items: [], page: 1, limit: 10, total: 0, pages: 1 },
    customers: { items: [], page: 1, limit: 10, total: 0, pages: 1 },
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers.items.unshift(action.payload);
        state.customers.total += 1;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers.items = state.customers.items.map((customer) =>
          customer._id === action.payload._id ? action.payload : customer
        );
      })
      .addCase(deleteAdminOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.items = state.orders.items.filter((order) => order._id !== action.payload);
        state.orders.total = Math.max(0, state.orders.total - 1);
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers.items = state.customers.items.filter((customer) => customer._id !== action.payload);
        state.customers.total = Math.max(0, state.customers.total - 1);
      })
      .addMatcher(
        (action) => action.type.startsWith("admin/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) =>
          ["admin/updateOrder/fulfilled", "admin/verifyPayment/fulfilled", "admin/reviewPrescription/fulfilled"].includes(
            action.type
          ),
        (state, action) => {
          state.loading = false;
          state.orders.items = state.orders.items.map((order) => (order._id === action.payload._id ? action.payload : order));
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("admin/") && action.type.endsWith("/rejected"),
        (state) => {
          state.loading = false;
        }
      );
  },
});

export default adminSlice.reducer;
