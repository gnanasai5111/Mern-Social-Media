import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { showToast } from "../../utilities/toast";
import { authLogout, authSuccess } from "../auth/authSlice";
import { axiosInstance } from "../../utilities/useAxiosInstance";

const initialState = {
  update: { loading: false, data: null, error: null },
  get: { loading: false, data: null, error: null },
  delete: { loading: false, data: null, error: null },
  allUsers: { loading: false, data: null, error: null },
  toggleFriend: { loading: false, data: null, error: null },
};

export const getUser = createAsyncThunk("user/getUser", (payload) => {
  const { data, mode } = payload;
  return axiosInstance
    .get(`/user/${data?._id}`, {
      headers: {
        Authorization: "Bearer " + data.accessToken,
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      showToast(error.response.data.message, mode, "error");
      throw error.response.data.message;
    });
});

export const getAllUsers = createAsyncThunk("user/allUsers", (payload) => {
  const { data, mode } = payload;
  return axiosInstance
    .get(`/user/all/users`, {
      headers: {
        Authorization: "Bearer " + data.accessToken,
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      showToast(error.response.data.message, mode, "error");
      throw error.response.data.message;
    });
});

export const deleteUser = createAsyncThunk("user/deleteUser", (payload) => {
  const { data, navigate, mode, dispatch } = payload;

  return axiosInstance
    .delete(`/user/${data._id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.accessToken,
      },
    })
    .then((res) => {
      showToast("Deleted Successfully!", mode, "success");
      dispatch(authLogout());
      localStorage.removeItem("userData");
      navigate("/");
    })
    .catch((err) => {
      showToast(err?.response?.data?.message, mode, "error");
      throw err.response.data.message;
    });
});

export const editUser = createAsyncThunk("user/editUser", (payload) => {
  const { form, data, mode, dispatch } = payload;
  let userData = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData"))
    : null;
  return axiosInstance
    .put(`/user/${data._id}`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + data.accessToken,
      },
    })
    .then((res) => {
      let newUserData = { ...userData, ...res.data.user };
      localStorage.setItem("userData", JSON.stringify(newUserData));
      dispatch(authSuccess(newUserData));
      dispatch(getUser({ data, mode }));
      showToast("Updated Successfully!", mode, "success");
    })
    .catch((err) => {
      showToast(err?.response?.data?.message, mode, "error");
      throw err.response.data.message;
    });
});

export const toggleFriend = createAsyncThunk("user/toggleFriend", (payload) => {
  const { id, data, mode, dispatch } = payload;

  return axiosInstance
    .put(`/user/friendship/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.accessToken,
      },
    })
    .then((res) => {
      dispatch(getUser({ data, mode }));
    })
    .catch((err) => {
      showToast(err?.response?.data?.message, mode, "error");
      throw err.response.data.message;
    });
});

const userSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getUser.pending, (state, action) => {
      state.get.loading = true;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.get.loading = false;
      state.get.data = action.payload;
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.get.loading = false;
      state.get.error = action.payload;
    });
    builder.addCase(editUser.pending, (state, action) => {
      state.update.loading = true;
    });
    builder.addCase(editUser.fulfilled, (state, action) => {
      state.update.loading = false;
      state.update.data = action.payload;
    });
    builder.addCase(editUser.rejected, (state, action) => {
      state.update.loading = false;
      state.update.error = action.payload;
    });
    builder.addCase(deleteUser.pending, (state, action) => {
      state.delete.loading = true;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.delete.loading = false;
      state.delete.data = action.payload;
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.delete.loading = false;
      state.delete.error = action.payload;
    });
    builder.addCase(getAllUsers.pending, (state, action) => {
      state.allUsers.loading = true;
    });
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.allUsers.loading = false;
      state.allUsers.data = action.payload;
    });
    builder.addCase(getAllUsers.rejected, (state, action) => {
      state.allUsers.loading = false;
      state.allUsers.error = action.payload;
    });
  },
});

export default userSlice.reducer;
