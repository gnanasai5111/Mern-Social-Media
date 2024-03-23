import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utilities/useAxiosInstance";
import { showToast } from "../../utilities/toast";

const initialState = {
  getChats: {
    loading: false,
    data: null,
    error: false,
  },
  accessChat: {
    loading: false,
    data: null,
    error: false,
  },
  createGroupChat: {
    loading: false,
    data: null,
    error: false,
  },
  renameGroup: {
    loading: false,
    data: null,
    error: false,
  },
  addToGroup: {
    loading: false,
    data: null,
    error: false,
  },
  removeFromGroup: {
    loading: false,
    data: null,
    error: false,
  },
};

export const accessChat = createAsyncThunk("chat/accessChat", (payload) => {
  const { form, data, mode, navigate } = payload;
  return axiosInstance
    .post("/chat", form, {
      headers: {
        Authorization: "Bearer " + data.accessToken,
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      navigate(`/chats/${res.data?.data?._id}`);
      return res.data;
    })
    .catch((error) => {
      showToast(error.response.data.message, mode, "error");
      throw error.response.data.message;
    });
});

export const getChats = createAsyncThunk(
  "chat/getChats",

  (payload) => {
    const { data, mode } = payload;
    return axiosInstance
      .get(`/chat`, {
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

export const createGroupChat = createAsyncThunk(
  "chat/createGroupChat",
  (payload) => {
    const { form, mode, data, dispatch } = payload;
    return axiosInstance
      .post(`/chat/group`, form, {
        headers: {
          Authorization: "Bearer " + data.accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        dispatch(getChats({ data, mode }));
        showToast("Group Created Successfully", mode, "success");
        return res.data;
      })
      .catch((error) => {
        showToast(error.response.data.message, mode, "error");
        throw error.response.data.message;
      });
  }
);
export const renameGroup = createAsyncThunk("chat/renameGroup", (payload) => {
  const { form, mode, data, dispatch } = payload;
  return axiosInstance
    .put(`/chat/rename`, form, {
      headers: {
        Authorization: "Bearer " + data.accessToken,
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      dispatch(getChats({ data, mode }));
      showToast("Group Renamed Successfully", mode, "success");
      return res.data;
    })
    .catch((error) => {
      showToast(error.response.data.message, mode, "error");
      throw error.response.data.message;
    });
});

export const addToGroup = createAsyncThunk("chat/addToGroup", (payload) => {
  const { form, mode, data, dispatch } = payload;
  return axiosInstance
    .put(`/chat/addToGroup`, form, {
      headers: {
        Authorization: "Bearer " + data.accessToken,
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      dispatch(getChats({ data, mode }));
      showToast("Group member added Successfully", mode, "success");
      return res.data;
    })
    .catch((error) => {
      showToast(error.response.data.message, mode, "error");
      throw error.response.data.message;
    });
});

export const removeFromGroup = createAsyncThunk(
  "chat/removeFromGroup",
  (payload) => {
    const { form, mode, data, dispatch } = payload;
    return axiosInstance
      .put(`/chat/removeFromGroup`, form, {
        headers: {
          Authorization: "Bearer " + data.accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        dispatch(getChats({ data, mode }));
        showToast("Group member removed Successfully", mode, "success");
        return res.data;
      })
      .catch((error) => {
        showToast(error.response.data.message, mode, "error");
        throw error.response.data.message;
      });
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getChats.pending, (state, action) => {
      state.getChats.loading = true;
    });
    builder.addCase(getChats.fulfilled, (state, action) => {
      state.getChats.loading = false;
      state.getChats.data = action.payload;
    });
    builder.addCase(getChats.rejected, (state, action) => {
      state.getChats.data = null;
      state.getChats.error = true;
    });
    builder.addCase(accessChat.pending, (state, action) => {
      state.accessChat.loading = true;
    });
    builder.addCase(accessChat.fulfilled, (state, action) => {
      state.accessChat.loading = false;
      state.accessChat.data = action.payload;
    });
    builder.addCase(accessChat.rejected, (state, action) => {
      state.accessChat.data = null;
      state.accessChat.error = true;
    });
    builder.addCase(createGroupChat.pending, (state, action) => {
      state.createGroupChat.loading = true;
    });
    builder.addCase(createGroupChat.fulfilled, (state, action) => {
      state.createGroupChat.loading = false;
      state.createGroupChat.data = action.payload;
    });
    builder.addCase(createGroupChat.rejected, (state, action) => {
      state.createGroupChat.data = null;
      state.createGroupChat.error = true;
    });
    builder.addCase(renameGroup.pending, (state, action) => {
      state.renameGroup.loading = true;
    });
    builder.addCase(renameGroup.fulfilled, (state, action) => {
      state.renameGroup.loading = false;
      state.renameGroup.data = action.payload;
    });
    builder.addCase(renameGroup.rejected, (state, action) => {
      state.renameGroup.data = null;
      state.renameGroup.error = true;
    });
    builder.addCase(addToGroup.pending, (state, action) => {
      state.addToGroup.loading = true;
    });
    builder.addCase(addToGroup.fulfilled, (state, action) => {
      state.addToGroup.loading = false;
      state.addToGroup.data = action.payload;
    });
    builder.addCase(addToGroup.rejected, (state, action) => {
      state.addToGroup.data = null;
      state.addToGroup.error = true;
    });
    builder.addCase(removeFromGroup.pending, (state, action) => {
      state.removeFromGroup.loading = true;
    });
    builder.addCase(removeFromGroup.fulfilled, (state, action) => {
      state.removeFromGroup.loading = false;
      state.removeFromGroup.data = action.payload;
    });
    builder.addCase(removeFromGroup.rejected, (state, action) => {
      state.removeFromGroup.data = null;
      state.removeFromGroup.error = true;
    });
  },
});

export default chatSlice.reducer;
