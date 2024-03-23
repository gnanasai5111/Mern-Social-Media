import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./header.less";
import { toggleMode } from "../../redux/theme/themeSlice";
import Search from "../search/Search";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../redux/user/userSlice";
import { IoIosNotifications } from "react-icons/io";
import Notifications from "../notifications/Notifications";
import { NotificationContext } from "../../App";
import { axiosInstance } from "../../utilities/useAxiosInstance";
import { io } from "socket.io-client";
import { CiMenuBurger } from "react-icons/ci";
import Drawer from "../drawer/Drawer";

export let socket = io(process.env.REACT_APP_IMAGE_URL);
function Header() {
  const { mode } = useSelector((state) => state.theme);
  const { data } = useSelector((state) => state.auth);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const dispatch = useDispatch();

  const { notifications, setNotifications, handleNotifications } =
    useContext(NotificationContext);

  useEffect(() => {
    if (data) {
      dispatch(getAllUsers({ data, mode }));
    }
  }, [data]);

  const getNotifications = () => {
    axiosInstance
      .get(`/notifications/${data._id}`, {
        headers: {
          Authorization: "Bearer " + data.accessToken,
        },
      })
      .then((res) => setNotifications(res.data?.notifications))
      .catch((error) => {
        throw error.response.data.message;
      });
  };

  useEffect(() => {
    getNotifications();
  }, [showNotifications]);

  useEffect(() => {
    socket.on("connect", () => {});
    socket.emit("setup", data._id);
    socket.on("receive-message", (data, notification) => {
      handleNotifications(notification);
    });
  }, [socket]);

  const userReducer = useSelector((state) => state.user.allUsers);

  useEffect(() => {
    if (userReducer.data?.users?.length > 0) {
      if (search?.length === 0) {
        setShowUsers(false);
      } else {
        setUsers(
          userReducer.data?.users.filter((i) =>
            i.username?.toLowerCase().includes(search?.toLowerCase())
          )
        );
      }
    }
  }, [userReducer.data?.users, search]);

  const handleSearch = (value) => {
    if (value?.toString()?.length > 2) {
      setShowUsers(true);
    } else {
      setShowUsers(false);
    }
    setSearch(value);
  };

  return (
    <>
      <div className="header-wrapper">
        <div className="container">
          <h3 className="heading-logo" onClick={() => navigate("/")}>
            FriendSphere
          </h3>
          <div className="search-wrapper">
            <Search
              handleSearch={handleSearch}
              search={search}
              setSearch={setSearch}
              placeholder="Search"
              showIcon
            />
            {showUsers && (
              <div
                className="search-dropdown"
                style={
                  mode === "dark"
                    ? { backgroundColor: "rgb(38,38,38)" }
                    : {
                        backgroundColor: "#fff",
                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                      }
                }
              >
                {users.length === 0 ? (
                  <div className="no-users">
                    <p>No Users Found</p>
                  </div>
                ) : (
                  <div>
                    {users.map((user) => {
                      return (
                        <>
                          <div
                            key={user._id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: 10,
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              navigate(`/profile/${user._id}`);
                              setShowUsers(false);
                            }}
                          >
                            <div className="user-item">
                              {user.profilePicture ? (
                                <img
                                  src={
                                    process.env.REACT_APP_IMAGE_URL +
                                    "images/" +
                                    user?.profilePicture
                                  }
                                  alt="user"
                                  style={{
                                    height: 20,
                                    width: 20,
                                    borderRadius: "50%",

                                    cursor: "pointer",
                                  }}
                                />
                              ) : (
                                <CgProfile size={20} />
                              )}
                              <h1>{user.username}</h1>
                            </div>
                            {data?._id === user._id && <p>My Profile</p>}
                          </div>
                        </>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="right-part">
            <label className="switch">
              <input
                type="checkbox"
                onChange={() => dispatch(toggleMode())}
                checked={mode === "dark" ? true : false}
              />
              <span className="slider round"></span>
            </label>
            <div
              className="icons"
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              {data?.profilePicture ? (
                <img
                  src={
                    process.env.REACT_APP_IMAGE_URL +
                    "images/" +
                    data?.profilePicture
                  }
                  alt="user"
                  style={{
                    height: 25,
                    width: 25,
                    borderRadius: "50%",
                    marginLeft: "20px",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/profile/${data?._id}`)}
                />
              ) : (
                <CgProfile
                  size={25}
                  onClick={() => navigate(`/profile/${data?._id}`)}
                />
              )}
              <div style={{ position: "relative" }}>
                <IoIosNotifications
                  size={25}
                  onClick={() => setShowNotifications(!showNotifications)}
                />
                {notifications?.length > 0 && (
                  <p
                    style={{
                      position: "absolute",
                      top: "-9px",
                      right: "0px",
                      content: "",
                      backgroundColor: "red",
                      borderRadius: "50%",
                      padding: "2px",
                      height: "15px",
                      width: "15px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                    }}
                  >
                    {notifications?.length}
                  </p>
                )}
              </div>
              <CiMenuBurger
                size={25}
                onClick={() => {
                  document.body.style.overflow = "hidden";
                  setShowDrawer(true);
                }}
              />
              {showNotifications && (
                <Notifications setShowNotifications={setShowNotifications} />
              )}
            </div>
          </div>
        </div>
      </div>
      {showDrawer && <Drawer setShowDrawer={setShowDrawer} />}
    </>
  );
}

export default Header;
