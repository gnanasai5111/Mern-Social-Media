import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utilities/useAxiosInstance";
import { showToast } from "../../utilities/toast";

const initialState = {
  sendMessage: {
    loading: false,
    data: null,
    error: false,
  },
  getMessages: {
    loading: false,
    data: null,
    error: false,
  },
};

export const getMessages = createAsyncThunk(
  "message/getMessages",

  (payload) => {
    const { chatId, data, mode } = payload;
    return axiosInstance
      .get(`/message/${chatId}`, {
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

export const sendMessage = createAsyncThunk(
  "message/sendMessage",
  (payload) => {
    const { form, data, mode, socket, dispatch, chatId } = payload;
    return axiosInstance
      .post("/message", form, {
        headers: {
          Authorization: "Bearer " + data.accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        socket.emit("send-message", res.data?.message, res.data?.notification);
        showToast("Message sent successfully", mode, "success");
        dispatch(getMessages({ data, mode, chatId }));
        return res.data;
      })
      .catch((error) => {
        showToast(error.response.data.message, mode, "error");
        throw error.response.data.message;
      });
  }
);

const messageSlice = createSlice({
  name: "message",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getMessages.pending, (state, action) => {
      state.getMessages.loading = true;
    });
    builder.addCase(getMessages.fulfilled, (state, action) => {
      state.getMessages.loading = false;
      state.getMessages.data = action.payload;
    });
    builder.addCase(getMessages.rejected, (state, action) => {
      state.getMessages.data = null;
      state.getMessages.error = true;
    });
    builder.addCase(sendMessage.pending, (state, action) => {
      state.sendMessage.loading = true;
    });
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      state.sendMessage.loading = false;
      state.sendMessage.data = action.payload;
    });
    builder.addCase(sendMessage.rejected, (state, action) => {
      state.sendMessage.data = null;
      state.sendMessage.error = true;
    });
  },
});

export default messageSlice.reducer;
