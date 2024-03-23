import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: localStorage.getItem("theme") ? localStorage.getItem("theme") : "dark",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleMode: (state) => {
      localStorage.setItem("theme", state.mode === "dark" ? "light" : "dark");
      state.mode = state.mode === "dark" ? "light" : "dark";
    },
  },
});
export const { toggleMode } = themeSlice.actions;

export default themeSlice.reducer;
