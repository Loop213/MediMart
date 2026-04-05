import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "@/services/api";

const storedToken = () => localStorage.getItem("medimart-token");

export const loadStoredAuth = () => storedToken();

const normalizeUser = (payload) => {
  if (payload.token) {
    localStorage.setItem("medimart-token", payload.token);
  }
  return payload;
};

export const registerUser = createAsyncThunk("auth/register", async (values) => {
  const { data } = await api.post("/auth/register", values);
  return normalizeUser(data);
});

export const loginUser = createAsyncThunk("auth/login", async (values) => {
  const { data } = await api.post("/auth/login", values);
  return normalizeUser(data);
});

export const fetchMe = createAsyncThunk("auth/me", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/auth/me", { skipToast: true });
    return data;
  } catch (error) {
    localStorage.removeItem("medimart-token");
    return rejectWithValue(error.response?.data?.message);
  }
});

export const updateProfile = createAsyncThunk("auth/updateProfile", async (values) => {
  const { data } = await api.put("/auth/profile", values);
  return normalizeUser(data);
});

export const changePassword = createAsyncThunk("auth/changePassword", async (values) => {
  const { data } = await api.put("/auth/change-password", values);
  return data.message;
});

export const fetchAddresses = createAsyncThunk("auth/fetchAddresses", async () => {
  const { data } = await api.get("/address");
  return data;
});

export const addAddress = createAsyncThunk("auth/addAddress", async (values) => {
  const { data } = await api.post("/address/add", values);
  return data;
});

export const updateAddress = createAsyncThunk("auth/updateAddress", async ({ id, values }) => {
  const { data } = await api.put(`/address/update/${id}`, values);
  return data;
});

export const deleteAddress = createAsyncThunk("auth/deleteAddress", async (id) => {
  const { data } = await api.delete(`/address/delete/${id}`);
  return data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: storedToken(),
    loading: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("medimart-token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        if (state.user) {
          state.user.addresses = action.payload;
        }
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        if (state.user) {
          state.user.addresses = action.payload;
        }
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        if (state.user) {
          state.user.addresses = action.payload;
        }
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        if (state.user) {
          state.user.addresses = action.payload;
        }
      })
      .addMatcher(
        (action) =>
          ["auth/register/fulfilled", "auth/login/fulfilled", "auth/updateProfile/fulfilled"].includes(
            action.type
          ),
        (state, action) => {
          state.loading = false;
          state.user = action.payload;
          state.token = action.payload.token || state.token;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("auth/") && action.type.endsWith("/rejected"),
        (state) => {
          state.loading = false;
        }
      );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
