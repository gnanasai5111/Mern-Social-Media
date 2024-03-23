import React, { useEffect, useState } from "react";
import "../myChats/group-chat-modal.less";
import { MdCancel } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../redux/user/userSlice";
import { showToast } from "../../utilities/toast";
import {
  addToGroup,
  removeFromGroup,
  renameGroup,
} from "../../redux/chat/chatSlice";

function UpdateGroupChatModal({ setShowModal, chatData }) {
  const [chatName, setChatName] = useState();

  const [selectedUsers, setSelectedUsers] = useState([]);

  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);
  const { data } = useSelector((state) => state.auth);

  useEffect(() => {
    setChatName(chatData?.chatName);
    setSelectedUsers(chatData?.users?.filter((i) => data?._id !== i._id));
  }, [chatData]);

  useEffect(() => {
    if (data) {
      dispatch(getAllUsers({ data, mode }));
    }
  }, [data]);

  const userReducer = useSelector((state) => state.user.allUsers);

  const addHandler = (value) => {
    const form = JSON.stringify({
      userId: value,
      chatId: chatData._id,
    });

    dispatch(addToGroup({ form, mode, data, dispatch }));
    setShowModal(false);
  };

  const renameHandler = () => {
    if (!chatName) {
      showToast("Enter chat name", mode, "warning");
    } else {
      const form = JSON.stringify({
        chatName,
        chatId: chatData._id,
      });
      dispatch(renameGroup({ form, mode, data, dispatch }));
      setShowModal(false);
    }
  };

  const removeFromGroupHandler = (id) => {
    const form = JSON.stringify({
      userId: id,
      chatId: chatData._id,
    });

    dispatch(removeFromGroup({ form, mode, data, dispatch }));
    setShowModal(false);
  };

  return (
    <div className="group-chat-modal group-chat-modal">
      <div className="group-chat-header">
        <h6>Update Group Chat</h6>
        <MdCancel onClick={() => setShowModal(false)} />
      </div>
      <div className="form">
        <div
          className="selected-users"
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            margin: "10px 0",
          }}
        >
          {selectedUsers?.map((i) => {
            return (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: 5,
                  backgroundColor: "#3d87f1",
                  margin: "0 10px",
                  borderRadius: 5,
                }}
              >
                {i.username}{" "}
                <MdCancel
                  style={{ marginLeft: 10 }}
                  onClick={() => removeFromGroupHandler(i._id)}
                />
              </div>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <input
            type="text"
            placeholder="Chat Name"
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
            style={{ width: "60%" }}
          />
          <button
            onClick={() => renameHandler()}
            style={{ width: "40%", padding: "10px 0", borderRadius: "4px" }}
          >
            Update
          </button>
        </div>
        <h6>Add New Users</h6>
        {userReducer.data?.users
          ?.filter((i) => data?._id !== i._id)
          ?.filter((i) => !selectedUsers.find((user) => user._id === i._id))
          ?.length === 0 && (
          <div
            style={{
              height: "20vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              color: "rgb(0, 149, 246)",
            }}
          >
            No users
          </div>
        )}
        <select
          onChange={(e) => addHandler(e.target.value)}
          multiple
          placeholder="Select Users"
        >
          {userReducer.data?.users
            ?.filter((i) => data?._id !== i._id)
            ?.filter((i) => !selectedUsers.find((user) => user._id === i._id))
            .map((i) => {
              return <option value={i._id}>{i.username}</option>;
            })}
        </select>
        <button
          onClick={() => removeFromGroupHandler(data?._id)}
          style={{ padding: "10px 0", borderRadius: "4px" }}
        >
          Leave Group
        </button>
      </div>
    </div>
  );
}

export default UpdateGroupChatModal;
