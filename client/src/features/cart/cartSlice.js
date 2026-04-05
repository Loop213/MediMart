import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "@/services/api";
import { logout } from "@/features/auth/authSlice";

export const fetchCart = createAsyncThunk("cart/fetch", async () => {
  const { data } = await api.get("/cart/get");
  return data;
});

export const addCartItem = createAsyncThunk("cart/add", async (payload) => {
  const { data } = await api.post("/cart/add", payload);
  return data;
});

export const removeCartItem = createAsyncThunk("cart/remove", async (medicineId) => {
  const { data } = await api.post("/cart/remove", { medicineId });
  return data;
});

export const updateCartItem = createAsyncThunk("cart/update", async (payload) => {
  const { data } = await api.post("/cart/update", payload);
  return data;
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logout, (state) => {
        state.items = [];
        state.loading = false;
      })
      .addMatcher(
        (action) => ["cart/fetch/pending", "cart/add/pending", "cart/remove/pending", "cart/update/pending"].includes(action.type),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) =>
          ["cart/fetch/fulfilled", "cart/add/fulfilled", "cart/remove/fulfilled", "cart/update/fulfilled"].includes(
            action.type
          ),
        (state, action) => {
          state.loading = false;
          state.items = action.payload;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("cart/") && action.type.endsWith("/rejected"),
        (state) => {
          state.loading = false;
        }
      );
  },
});

export default cartSlice.reducer;
