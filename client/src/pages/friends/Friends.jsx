import React from "react";
import "./friends.less";
import Sidebar from "../../components/sidebar/Sidebar";
import MyFriends from "../../components/myFriends/MyFriends";

function Friends() {
  return (
    <div className="friends-wrapper">
      <Sidebar />
      <MyFriends isDetailed={true} />
    </div>
  );
}

export default Friends;
