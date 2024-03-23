import React, { useEffect, useState } from "react";
import "./chats.less";
import MyChats from "../../components/myChats/MyChats";
import ChatBox from "../../components/chatBox/ChatBox";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUser } from "../../redux/user/userSlice";
import { getChats } from "../../redux/chat/chatSlice";

const Chats = () => {
  const { mode } = useSelector((state) => state.theme);
  const { data } = useSelector((state) => state.auth);

  const { id } = useParams();

  const [activeChat, setActiveChat] = useState("");

  const dispatch = useDispatch();
  useEffect(() => {
    if (data) {
      dispatch(getUser({ data, mode }));
      dispatch(getChats({ data, mode }));
    }
    if (id) {
      setActiveChat(id);
    }
  }, [data, id]);



  return (
    <div className="chats-wrapper">
      <MyChats
        chatId={id}
        setActiveChat={setActiveChat}
        activeChat={activeChat}
      />
      <ChatBox
        chatId={id}
        setActiveChat={setActiveChat}
        activeChat={activeChat}
      />
    </div>
  );
};

export default Chats;
