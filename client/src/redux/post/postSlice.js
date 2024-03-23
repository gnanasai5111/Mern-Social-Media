import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utilities/useAxiosInstance";
import { showToast } from "../../utilities/toast";

const initialState = {
  getTimelinePosts: {
    loading: false,
    data: null,
    error: false,
  },
  getUserPosts: {
    loading: false,
    data: null,
    error: false,
  },
  delete: {
    loading: false,
    data: null,
    error: false,
  },
  toggleLike: {
    loading: false,
    data: null,
    error: false,
  },
  addPost: {
    loading: false,
    data: null,
    error: false,
  },
};

export const getTimelinePosts = createAsyncThunk(
  "post/getTimelinePosts",

  (payload) => {
    const { data, mode } = payload;
    return axiosInstance
      .get("/posts/timeline/all", {
        headers: {
          Authorization: "Bearer " + data.accessToken,
        },
      })
      .then((res) => res.data)
      .catch((error) => {
        showToast(error.response.data.message, mode, "error");
        throw error.response.data.message;
      });
  }
);
export const getUserPosts = createAsyncThunk(
  "post/getUserPosts",

  (payload) => {
    const { data, mode } = payload;
    return axiosInstance
      .get(`/posts/all/${data?._id}`, {
        headers: {
          Authorization: "Bearer " + data.accessToken,
        },
      })
      .then((res) => res.data)
      .catch((error) => {
        showToast(error.response.data.message, mode, "error");
        throw error.response.data.message;
      });
  }
);

export const deletePost = createAsyncThunk(
  "post/deletePost",

  (payload) => {
    const { postId, mode, data, dispatch } = payload;
    return axiosInstance
      .delete(`/posts/${postId}`, {
        headers: {
          Authorization: "Bearer " + data.accessToken,
        },
      })
      .then((res) => {
        dispatch(getTimelinePosts({ data, mode }));
        showToast("Post Deleted Successfully", mode, "success");
        return res.data;
      })
      .catch((error) => {
        showToast(error.response.data.message, mode, "error");
        throw error.response.data.message;
      });
  }
);

export const toggleLike = createAsyncThunk(
  "post/toggleLike",

  (payload) => {
    const { postId, mode, data, dispatch } = payload;
    return axiosInstance
      .put(`/posts/toggle/likes`, JSON.stringify({ postId }), {
        headers: {
          Authorization: "Bearer " + data.accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        dispatch(getTimelinePosts({ data, mode }));
        return res.data;
      })
      .catch((error) => {
        showToast(error.response.data.message, mode, "error");
        throw error.response.data.message;
      });
  }
);

export const addPost = createAsyncThunk(
  "post/addPost",

  (payload) => {
    const { form, mode, data, dispatch } = payload;
    return axiosInstance
      .post(`/posts`, form, {
        headers: {
          Authorization: "Bearer " + data.accessToken,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        showToast("Post added successfully!", mode, "success");
        dispatch(getTimelinePosts({ data, mode }));
        return res.data;
      })
      .catch((error) => {
        showToast(error.response.data.message, mode, "error");
        throw error.response.data.message;
      });
  }
);

const postSlice = createSlice({
  name: "post",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getTimelinePosts.pending, (state, action) => {
      state.getTimelinePosts.loading = true;
    });
    builder.addCase(getTimelinePosts.fulfilled, (state, action) => {
      state.getTimelinePosts.loading = false;
      state.getTimelinePosts.data = action.payload;
    });
    builder.addCase(getTimelinePosts.rejected, (state, action) => {
      state.getTimelinePosts.data = null;
      state.getTimelinePosts.error = true;
    });
    builder.addCase(getUserPosts.pending, (state, action) => {
      state.getUserPosts.loading = true;
    });
    builder.addCase(getUserPosts.fulfilled, (state, action) => {
      state.getUserPosts.loading = false;
      state.getUserPosts.data = action.payload;
    });
    builder.addCase(getUserPosts.rejected, (state, action) => {
      state.getUserPosts.data = null;
      state.getUserPosts.error = true;
    });
    builder.addCase(deletePost.pending, (state, action) => {
      state.delete.loading = true;
    });
    builder.addCase(deletePost.fulfilled, (state, action) => {
      state.delete.loading = false;
      state.delete.data = action.payload;
    });
    builder.addCase(deletePost.rejected, (state, action) => {
      state.delete.data = null;
      state.delete.error = true;
    });
    builder.addCase(toggleLike.pending, (state, action) => {
      state.toggleLike.loading = true;
    });
    builder.addCase(toggleLike.fulfilled, (state, action) => {
      state.toggleLike.loading = false;
      state.toggleLike.data = action.payload;
    });
    builder.addCase(toggleLike.rejected, (state, action) => {
      state.toggleLike.data = null;
      state.toggleLike.error = true;
    });
    builder.addCase(addPost.pending, (state, action) => {
      state.addPost.loading = true;
    });
    builder.addCase(addPost.fulfilled, (state, action) => {
      state.addPost.loading = false;
      state.addPost.data = action.payload;
    });
    builder.addCase(addPost.rejected, (state, action) => {
      state.addPost.data = null;
      state.addPost.error = true;
    });
  },
});

export default postSlice.reducer;
