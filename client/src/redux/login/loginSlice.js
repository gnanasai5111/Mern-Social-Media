import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { showToast } from "../../utilities/toast";
import { authSuccess } from "../auth/authSlice";

const initialState = {
  loading: false,
  data: null,
  error: null,
};

export const loginUser = createAsyncThunk("login", (payload) => {
  const { data, theme, navigate, dispatch } = payload;
  return axios
    .post(`${process.env.REACT_APP_API_URL}auth/login`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      localStorage.setItem("userData", JSON.stringify(res.data));
      dispatch(authSuccess(res.data));
      navigate("/");
      return res.data;
    })
    .catch((error) => {
      showToast(error.response.data.message, theme.mode, "error");
      throw error.response.data.message; // Throw the error message for rejection
    });
});

const loginSlice = createSlice({
  name: "login",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.data = null;
      state.error = action.payload;
    });
  },
});

export default loginSlice.reducer;
