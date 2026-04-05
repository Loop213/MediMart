import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "@/services/api";

export const fetchMedicines = createAsyncThunk("medicine/fetchAll", async (params = {}) => {
  const { data } = await api.get("/medicine/list", { params });
  return data;
});

export const searchMedicines = createAsyncThunk("medicine/search", async (params = {}) => {
  const { data } = await api.get("/medicine/search", { params });
  return data;
});

export const addMedicine = createAsyncThunk("medicine/add", async (formData) => {
  const { data } = await api.post("/medicine/add", formData);
  return data;
});

export const updateMedicine = createAsyncThunk("medicine/update", async ({ id, formData }) => {
  const { data } = await api.put(`/medicine/update/${id}`, formData);
  return data;
});

export const deleteMedicine = createAsyncThunk("medicine/delete", async (id) => {
  await api.delete(`/medicine/delete/${id}`);
  return id;
});

const medicineSlice = createSlice({
  name: "medicine",
  initialState: {
    items: [],
    loading: false,
    searchResults: {
      items: [],
      total: 0,
      page: 1,
      limit: 9,
      pages: 1,
      query: "",
    },
    searchLoading: false,
    filters: {
      search: "",
      category: "All",
      prescriptionRequired: "all",
      sort: "popular",
      minPrice: "",
      maxPrice: "",
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: "",
        category: "All",
        prescriptionRequired: "all",
        sort: "popular",
        minPrice: "",
        maxPrice: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicines.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMedicines.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMedicines.rejected, (state) => {
        state.loading = false;
      })
      .addCase(searchMedicines.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchMedicines.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchMedicines.rejected, (state) => {
        state.searchLoading = false;
      })
      .addCase(addMedicine.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateMedicine.fulfilled, (state, action) => {
        state.items = state.items.map((item) => (item._id === action.payload._id ? action.payload : item));
      })
      .addCase(deleteMedicine.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export const { setFilters, clearFilters } = medicineSlice.actions;
export default medicineSlice.reducer;
