import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utilities/useAxiosInstance";
import { showToast } from "../../utilities/toast";

const initialState = {
  getComments: {
    loading: false,
    data: null,
    error: false,
  },
  deleteComment: {
    loading: false,
    data: null,
    error: false,
  },
  addComment: {
    loading: false,
    data: null,
    error: false,
  },
};

export const addComment = createAsyncThunk(
  "comment/addComment",

  (payload) => {
    const { form, data, mode, dispatch, postId } = payload;
    return axiosInstance
      .post("/comments/add", form, {
        headers: {
          Authorization: "Bearer " + data.accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        dispatch(getComments({ postId, data, mode }));
        showToast("Comment added Successfully!", mode, "success");
        return res.data;
      })
      .catch((error) => {
        showToast(error.response.data.message, mode, "error");
        throw error.response.data.message;
      });
  }
);
export const getComments = createAsyncThunk(
  "comment/getComments",

  (payload) => {
    const { postId, data, mode } = payload;
    return axiosInstance
      .get(`/comments/${postId}`, {
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

export const deleteComment = createAsyncThunk(
  "comment/deleteComment",

  (payload) => {
    const { commentId, postId, mode, data, dispatch } = payload;
    return axiosInstance
      .delete(`/comments/${commentId}/${postId}`, {
        headers: {
          Authorization: "Bearer " + data.accessToken,
        },
      })
      .then((res) => {
        dispatch(getComments({ postId, data, mode }));
        showToast("Post Deleted Successfully", mode, "success");
        return res.data;
      })
      .catch((error) => {
        showToast(error.response.data.message, mode, "error");
        throw error.response.data.message;
      });
  }
);

const commentSlice = createSlice({
  name: "comment",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(addComment.pending, (state, action) => {
      state.addComment.loading = true;
    });
    builder.addCase(addComment.fulfilled, (state, action) => {
      state.addComment.loading = false;
      state.addComment.data = action.payload;
    });
    builder.addCase(addComment.rejected, (state, action) => {
      state.addComment.data = null;
      state.addComment.error = true;
    });
    builder.addCase(getComments.pending, (state, action) => {
      state.getComments.loading = true;
    });
    builder.addCase(getComments.fulfilled, (state, action) => {
      state.getComments.loading = false;
      state.getComments.data = action.payload;
    });
    builder.addCase(getComments.rejected, (state, action) => {
      state.getComments.data = null;
      state.getComments.error = true;
    });
    builder.addCase(deleteComment.pending, (state, action) => {
      state.deleteComment.loading = true;
    });
    builder.addCase(deleteComment.fulfilled, (state, action) => {
      state.deleteComment.loading = false;
      state.deleteComment.data = action.payload;
    });
    builder.addCase(deleteComment.rejected, (state, action) => {
      state.deleteComment.data = null;
      state.deleteComment.error = true;
    });
  },
});

export default commentSlice.reducer;
