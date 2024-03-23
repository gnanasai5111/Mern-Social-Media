import React, { useEffect, useState } from "react";
import "./my-chats.less";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaRocketchat } from "react-icons/fa";
import { accessChat } from "../../redux/chat/chatSlice";
import GroupChatModal from "./GroupChatModal";

function MyChats({ chatId, activeChat }) {
  const { mode } = useSelector((state) => state.theme);
  const { data } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);

  const [myChats, setMyChats] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setShowModal(false);
  }, [chatId]);

  const getChatsReducer = useSelector((state) => state.chat.getChats);

  const currentuserReducer = useSelector((state) => state.user.get);

  useEffect(() => {
    setMyChats(getChatsReducer?.data?.data);
  }, [data, currentuserReducer, getChatsReducer?.data]);

  const accessChatHandler = (item) => {
    if (item.isGroupChat) {
      navigate(`/chats/${item?._id}`);
    } else {
      const friendUserId = item.users
        ?.filter((i) => i._id !== currentuserReducer.data?._id)
        .map((i) => i._id);

      if (friendUserId.length > 0) {
        const form = JSON.stringify({
          userId: friendUserId[0],
          chatName: item.chatName,
        });
        dispatch(accessChat({ form, data, mode, navigate }));
      }
    }
  };

  const createGroupChatHandler = () => {
    setShowModal(true);
  };

  return (
    <div
      className={
        activeChat === chatId
          ? "my-chats-wrapper"
          : "current-active-my-chats-wrapper my-chats-wrapper"
      }
    >
      <div className="group-chat">
        <h2>MyChats</h2>
        <button onClick={() => createGroupChatHandler()}>
          Create Group Chat
        </button>
        {showModal && (
          <>
            <GroupChatModal setShowModal={setShowModal} />
          </>
        )}
      </div>
      <div className="all-chats">
        {myChats?.length === 0 ? (
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
            No Chats
          </div>
        ) : (
          myChats?.map((item) => {
            return (
              <div
                key={item._id}
                className={item._id === chatId ? "active item" : "item"}
                onClick={() => accessChatHandler(item)}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <h6 style={{ fontSize: "1rem", fontWeight: "600" }}>
                    {item.isGroupChat
                      ? item.chatName
                      : item.users.filter((i) => i._id !== data._id)[0]
                          ?.username}
                  </h6>
                  {/* <h6 style={{ fontSize: "0.9rem" }}>
                    {item?.latestMessage?.content
                      ? item?.latestMessage?.content
                      : "----"}
                  </h6> */}
                </div>

                <FaRocketchat />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default MyChats;
