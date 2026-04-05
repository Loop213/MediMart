import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "@/services/api";

export const fetchFooterContent = createAsyncThunk("footer/fetch", async () => {
  const { data } = await api.get("/footer");
  return data;
});

export const subscribeNewsletter = createAsyncThunk("footer/subscribe", async (email) => {
  const { data } = await api.post("/footer/newsletter", { email });
  return data.message;
});

export const updateFooterContent = createAsyncThunk("footer/update", async (payload) => {
  const { data } = await api.put("/footer", payload);
  return data;
});

export const fetchNewsletterSubscribers = createAsyncThunk("footer/subscribers", async () => {
  const { data } = await api.get("/footer/subscribers");
  return data;
});

const footerSlice = createSlice({
  name: "footer",
  initialState: {
    content: null,
    subscribers: [],
    loading: false,
    saving: false,
    newsletterLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFooterContent.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFooterContent.fulfilled, (state, action) => {
        state.loading = false;
        state.content = action.payload;
      })
      .addCase(fetchFooterContent.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateFooterContent.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateFooterContent.fulfilled, (state, action) => {
        state.saving = false;
        state.content = action.payload;
      })
      .addCase(updateFooterContent.rejected, (state) => {
        state.saving = false;
      })
      .addCase(subscribeNewsletter.pending, (state) => {
        state.newsletterLoading = true;
      })
      .addCase(subscribeNewsletter.fulfilled, (state) => {
        state.newsletterLoading = false;
      })
      .addCase(subscribeNewsletter.rejected, (state) => {
        state.newsletterLoading = false;
      })
      .addCase(fetchNewsletterSubscribers.fulfilled, (state, action) => {
        state.subscribers = action.payload;
      });
  },
});

export default footerSlice.reducer;
