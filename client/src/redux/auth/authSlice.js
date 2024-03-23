import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authSuccess: (state, action) => {
      state.data = action.payload;
    },
    authLogout: (state, action) => {
      state.data = null;
    },
  },
});

export const { authSuccess, authLogout } = authSlice.actions;

export default authSlice.reducer;
