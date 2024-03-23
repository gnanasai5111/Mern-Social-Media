import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./home.less";
import Posts from "../../components/posts/Posts";
import MyFriends from "../../components/myFriends/MyFriends";

function Home() {
  return (
    <div className="home-wrapper">
      <Sidebar />
      <Posts />
      <MyFriends />
    </div>
  );
}

export default Home;
