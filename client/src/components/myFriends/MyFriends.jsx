import React, { useEffect, useState } from "react";
import "./my-friends.less";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllUsers, getUser, toggleFriend } from "../../redux/user/userSlice";
import { FaRocketchat } from "react-icons/fa";
import { accessChat } from "../../redux/chat/chatSlice";

function MyFriends({ isDetailed }) {
  const { mode } = useSelector((state) => state.theme);
  const { data } = useSelector((state) => state.auth);

  const [myFriends, setMyFriends] = useState([]);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  useEffect(() => {
    if (data) {
      dispatch(getAllUsers({ data, mode }));
      dispatch(getUser({ data, mode }));
    }
  }, [data]);

  const userReducer = useSelector((state) => state.user.allUsers);

  const currentuserReducer = useSelector((state) => state.user.get);

  useEffect(() => {
    setMyFriends(
      userReducer?.data?.users
        ?.filter((item) => item._id !== data._id)
        .filter((item) =>
          currentuserReducer?.data?.followings.includes(item._id)
        )
    );
  }, [data, currentuserReducer, userReducer]);

  const toggleFriendship = (id) => {
    dispatch(
      toggleFriend({
        id: id,
        data,
        mode,
        dispatch,
      })
    );
  };

  const accessChatHandler = (friend) => {
    const form = JSON.stringify({
      userId: friend._id,
      chatName: friend.username,
    });
    dispatch(accessChat({ form, data, mode, navigate }));
  };

  const getBirthday = (date) => {
    let value = date?.split("-");
    let newDate = value[1] + "-" + value[2].slice(0, 2) + "-" + value[0];
    return newDate;
  };
  return (
    <div className="my-friends-wrapper">
      <h2>MyFriends</h2>
      <div className="all-friends">
        {myFriends?.length === 0 ? (
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
            No Friends
          </div>
        ) : (
          myFriends?.map((friend) => {
      
            return (
              <div
                style={{
                  border: "1px solid",
                  marginBottom: "10px",
                  borderRadius: "8px",
                  padding: "10px",
                }}
              >
                <div key={friend._id} className="top-part">
                  <span
                    onClick={() => {
                      navigate(`/profile/${friend._id}`);
                    }}
                  >
                    {friend.username}
                  </span>
                  <div className="icons-group">
                    <FaRocketchat onClick={() => accessChatHandler(friend)} />

                    <button
                      onClick={() => toggleFriendship(friend._id)}
                      style={{ padding: "4px 8px", borderRadius: "6px" }}
                    >
                      {currentuserReducer?.data?.followings.includes(friend._id)
                        ? "Unfollow"
                        : "Follow"}
                    </button>
                  </div>
                </div>
                {isDetailed && (
                  <div className="details">
                    <div>
                      <h1>Birthday</h1>
                      <p>
                        {friend.birthday ? getBirthday(friend.birthday) : "NA"}
                      </p>
                    </div>
                    <div>
                      <h1>city</h1>
                      <p>{friend?.city || "NA"}</p>
                    </div>
                    <div>
                      <h1>Gender</h1>
                      <p>
                        {" "}
                        {friend?.gender === 1
                          ? "Male"
                          : friend?.gender === 2
                          ? "Female"
                          : friend?.gender === 3
                          ? "Other"
                          : "NA"}
                      </p>
                    </div>
                    <div>
                      <h1>Relatioship</h1>
                      <p>
                        {friend?.relationship === 1
                          ? "Single"
                          : friend?.relationship === 2
                          ? "Married"
                          : "NA"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default MyFriends;
