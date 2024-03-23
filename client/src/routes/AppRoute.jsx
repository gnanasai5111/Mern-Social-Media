import React from "react";
import { Route, Routes } from "react-router-dom";
import Signup from "../pages/auth/Signup";
import Login from "../pages/auth/Login";
import { useSelector } from "react-redux";
import Home from "../pages/home/Home";
import Profile from "../pages/profile/Profile";
import Friends from "../pages/friends/Friends";
import EditProfile from "../pages/editProfile/EditProfile";
import ProfilePosts from "../pages/profile/ProfilePosts";
import Chats from "../pages/chats/Chats";

function AppRoute() {
  const auth = useSelector((state) => state.auth);



  return (
    <Routes>
      {!auth.data ? (
        <>
          <Route path="signup" element={<Signup />} />
          <Route path="/" element={<Login />} />
        </>
      ) : (
        <>
          <Route path="/" element={<Home />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="profile/:id" element={<Profile />} />
          <Route path="friends" element={<Friends />} />
          <Route path="my-chats" element={<Friends />} />
          <Route path="fullview/:id/:indexId" element={<ProfilePosts />} />
          <Route path="chats/:id" element={<Chats />} />
        </>
      )}
    </Routes>
  );
}

export default AppRoute;
