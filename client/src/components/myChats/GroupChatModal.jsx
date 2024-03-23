import React, { useEffect, useState } from "react";
import "./group-chat-modal.less";
import { MdCancel } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../redux/user/userSlice";
import { showToast } from "../../utilities/toast";
import { createGroupChat } from "../../redux/chat/chatSlice";

function GroupChatModal({ setShowModal }) {
  const [chatName, setChatName] = useState();
  const [addedUsers, setAddedUsers] = useState([]);

  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);
  const { data } = useSelector((state) => state.auth);

  useEffect(() => {
    if (data) {
      dispatch(getAllUsers({ data, mode }));
    }
  }, [data]);



  const userReducer = useSelector((state) => state.user.allUsers);

  const addHandler = (value) => {
    if (addedUsers.includes(value)) {
      let oldValues = addedUsers;
      setAddedUsers(oldValues.filter((i) => i !== value));
    } else {
      setAddedUsers([...addedUsers, value]);
    }
  };

  const createGroupChatHandler = () => {
    if (!chatName) {
      showToast("Enter chat name", mode, "warning");
    } else if (addedUsers.length < 1) {
      showToast("Select atleast one user to make a group", mode, "warning");
    } else {
      const form = JSON.stringify({
        users: [...addedUsers, data?._id],
        chatName: chatName,
      });
      dispatch(createGroupChat({ form, mode, data, dispatch }));
      setShowModal(false);
    }
  };
  return (
    <div className="group-chat-modal">
      <div className="group-chat-header">
        <h6>Create Group Chat</h6>
        <MdCancel onClick={() => setShowModal(false)} />
      </div>
      <div className="form">
        <input
          type="text"
          placeholder="Chat Name"
          value={chatName}
          onChange={(e) => setChatName(e.target.value)}
        />
        <h6>Select Users</h6>
        <select
          value={addedUsers}
          onChange={(e) => addHandler(e.target.value)}
          multiple
          placeholder="Select Users"
        >
          {userReducer.data?.users
            ?.filter((i) => data?._id !== i._id)
            .map((i) => {
              return <option value={i._id}>{i.username}</option>;
            })}
        </select>
        <button onClick={() => createGroupChatHandler()}>Create</button>
      </div>
    </div>
  );
}

export default GroupChatModal;
