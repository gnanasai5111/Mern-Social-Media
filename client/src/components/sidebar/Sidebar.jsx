import React, { useEffect } from "react";
import "./sidebar.less";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CiHome, CiLogout } from "react-icons/ci";
import { GiEgyptianProfile } from "react-icons/gi";
import { FaUserFriends } from "react-icons/fa";
import { CiChat2 } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { authLogout } from "../../redux/auth/authSlice";
import { getChats } from "../../redux/chat/chatSlice";
function Sidebar() {
  const path = useLocation();

  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      dispatch(getChats({ data, mode }));
    }
  }, [data]);

  const getChatsReducer = useSelector((state) => state.chat.getChats);

  const paths = [
    { name: "Home", path: "/", icon: <CiHome /> },
    {
      name: "Profile",
      path: `/profile/${data?._id}`,
      icon: <GiEgyptianProfile />,
    },
    { name: "friends", path: "/friends", icon: <FaUserFriends /> },
    {
      name: "Chats",
      path:
        getChatsReducer?.data?.data?.length > 0
          ? `/chats/${getChatsReducer?.data?.data[0]?._id}`
          : "/my-chats",
      icon: <CiChat2 />,
    },
  ];

  const logoutHandler = () => {
    localStorage.removeItem("userData");
    dispatch(authLogout());
    navigate("/");
  };
  return (
    <div className="side-bar-profile">
      {paths.map((item, index) => {
        return (
          <div
            className={
              path.pathname === item.path ? "each-item active" : "each-item"
            }
            key={index}
          >
            <Link to={item.path}>
              {item.icon}
              {item.name}
            </Link>
          </div>
        );
      })}
      <div className="logout-item" onClick={() => logoutHandler()}>
        <CiLogout /> Logout
      </div>
    </div>
  );
}

export default Sidebar;
