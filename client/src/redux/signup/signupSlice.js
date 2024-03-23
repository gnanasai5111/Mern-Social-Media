import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { authSuccess } from "../auth/authSlice";
import { showToast } from "../../utilities/toast";

const initialState = {
  loading: false,
  data: null,
  error: null,
};

export const signupUser = createAsyncThunk("signup", (payload) => {
  const { formData, theme, navigate, dispatch } = payload;
  return axios
    .post(`${process.env.REACT_APP_API_URL}auth/register`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
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
      throw error.response.data.message;
    });
});

const signupSlice = createSlice({
  name: "signup",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(signupUser.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(signupUser.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(signupUser.rejected, (state, action) => {
      state.loading = false;
      state.data = null;
      state.error = action.payload;
    });
  },
});

export default signupSlice.reducer;
