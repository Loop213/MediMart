import { createSlice } from "@reduxjs/toolkit";

const getSystemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const applyTheme = (theme) => {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("medimart-theme", theme);
};

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: "light",
  },
  reducers: {
    initializeTheme: (state) => {
      const stored = localStorage.getItem("medimart-theme");
      state.mode = stored || getSystemTheme();
      applyTheme(state.mode);
    },
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      applyTheme(state.mode);
    },
  },
});

export const { initializeTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
