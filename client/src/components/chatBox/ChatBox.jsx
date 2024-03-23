import React, { useContext, useEffect, useRef, useState } from "react";
import "./chat-box.less";
import { useDispatch, useSelector } from "react-redux";
import { IoEyeOutline } from "react-icons/io5";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import { getMessages, sendMessage } from "../../redux/message/messageSlice";
import { showToast } from "../../utilities/toast";
import { TailSpin } from "react-loader-spinner";
import { CgProfile } from "react-icons/cg";
import { IoMdArrowBack } from "react-icons/io";
import { NotificationContext } from "../../App";
import { socket } from "../header/Header";

function ChatBox({ chatId, activeChat, setActiveChat }) {
  const getChatsReducer = useSelector((state) => state.chat.getChats);
  const [showModal, setShowModal] = useState(false);
  const [chatData, setChatData] = useState();
  const [message, setMessage] = useState();
  const [messages, setMessages] = useState([]);

  const { handleNotifications } = useContext(NotificationContext);
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);
  const { data } = useSelector((state) => state.auth);
  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (getChatsReducer.data?.data?.length > 0) {
      let currentChat = getChatsReducer.data.data.filter(
        (i) => i._id === chatId
      );
      if (currentChat.length > 0) {
        setChatData(currentChat[0]);
      }
    }
  }, [getChatsReducer.data]);

  useEffect(() => {
    setShowModal(false);
  }, [chatId]);

  useEffect(() => {
    dispatch(getMessages({ dispatch, chatId, data, mode }));
  }, [chatId, data, mode]);

  const messageReducer = useSelector((state) => state.message.getMessages);

  useEffect(() => {
    socket.on("receive-message", (data, notification) => {
      if (data?.chat?._id === chatId) {
        handleNotifications(notification);
        if (messageReducer.data?.message?.length > 0) {
          setMessages([...messageReducer.data?.message, data]);
        } else {
          setMessages([data]);
        }
      } else {
        setMessages(messageReducer.data?.message);
      }
    });
  }, [socket, messageReducer.data?.message]);

  useEffect(() => {
    if (messageReducer.data?.message) {
      setMessages(messageReducer.data?.message);
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageReducer.data]);

  const sendMessageHandler = () => {
    if (!message) {
      showToast("Please write something", mode, "warning");
    } else {
      const form = JSON.stringify({
        chatId,
        content: message,
      });

      dispatch(
        sendMessage({ data, mode, form, chatId, socket, dispatch})
      );
      setMessage("");
    }
  };

  return (
    <div
      className={
        activeChat === chatId
          ? "current-active-chat-box chat-box-wrapper"
          : "chat-box-wrapper"
      }
    >
      <div className="user-details">
        <h3>
          <div className="icon-back">
            <IoMdArrowBack onClick={() => setActiveChat("")} />
          </div>

          {chatData?.isGroupChat
            ? chatData?.chatName
            : chatData?.users.filter((i) => i._id !== data._id)[0]?.username}
        </h3>
        {chatData?.isGroupChat && (
          <IoEyeOutline onClick={() => setShowModal(true)} />
        )}
        {showModal && (
          <>
            <UpdateGroupChatModal
              setShowModal={setShowModal}
              chatData={chatData}
            />
          </>
        )}
      </div>
      <div className="chat-container">
        <div className="chat-messages">
          {messageReducer.loading ? (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <TailSpin
                  visible={true}
                  height="50"
                  width="50"
                  color="#3d87f1"
                  ariaLabel="tail-spin-loading"
                  radius="1"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              </div>
            </>
          ) : (
            messageReducer.data && (
              <>
                {messages?.length === 0 ? (
                  <div
                    className="empty-box"
                    style={{
                      height: "20vh",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 600,
                      color: "rgb(0, 149, 246)",
                    }}
                  >
                    No Messages
                  </div>
                ) : (
                  messages?.map((i, index) => {
                    if (i.sender?._id === data?._id) {
                      return (
                        <div className="right" key={index}>
                          <p>{i.content}</p>
                        </div>
                      );
                    } else {
                      let prevEqualToCurrent = false;
                      if (index >= 1) {
                        prevEqualToCurrent =
                          i.sender?._id === messages[index - 1].sender?._id;
                      }

                      return (
                        <div className="left" key={index}>
                          {prevEqualToCurrent ? (
                            <p style={{ paddingLeft: "35px" }}>{i.content}</p>
                          ) : (
                            <>
                              {i.sender?.profilePicture ? (
                                <img
                                  src={
                                    process.env.REACT_APP_IMAGE_URL +
                                    "images/" +
                                    i.sender?.profilePicture
                                  }
                                  alt="user"
                                  style={{
                                    height: 30,
                                    width: 30,
                                    borderRadius: "50%",

                                    cursor: "pointer",
                                  }}
                                />
                              ) : (
                                <CgProfile size={30} />
                              )}
                              <div>
                                <h6>{i.sender?.username}</h6>
                                <p>{i.content}</p>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    }
                  })
                )}
                <div
                  style={{ float: "left", clear: "both" }}
                  ref={messagesEndRef}
                ></div>
              </>
            )
          )}
        </div>
        <div className="bottom-container">
          <input
            type="text"
            value={message}
            placeholder="Type a Message"
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessageHandler();
              }
            }}
          />
          <button onClick={() => sendMessageHandler()}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
