import React, { useState } from "react";
import "./auth.less";
import { showToast } from "../../utilities/toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import { signupUser } from "../../redux/signup/signupSlice";

function Signup() {
  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [emailWarningMessage, setEmailWarningMessage] = useState();
  const [usernameWarningMessage, setUsernameWarningMessage] = useState();
  const [passwordWarningMessage, setPasswordWarningMessage] = useState();
  const [password, setPassword] = useState();
  const [file, setFile] = useState();
  const theme = useSelector((state) => state.theme);
  const signup = useSelector((state) => state.signup);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      showToast("Please Enter Email", theme.mode, "error");
      setEmailWarningMessage("Please Enter Email");
      setTimeout(() => {
        setEmailWarningMessage("");
      }, 3000);
    } else if (!username) {
      showToast("Please Enter Username", theme.mode, "error");
      setUsernameWarningMessage("Please Enter Username");
      setTimeout(() => {
        setUsernameWarningMessage("");
      }, 3000);
    } else if (!password) {
      showToast("Please Enter Password", theme.mode, "error");
      setPasswordWarningMessage("Please Enter Password");
      setTimeout(() => {
        setPasswordWarningMessage("");
      }, 3000);
    } else {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("username", username);
      formData.append("password", password);
      if (file) {
        formData.append("image", file);
      }

      dispatch(signupUser({ formData, theme, navigate, dispatch }));
    }
  };


  return (
    <div className="auth-wrapper">
      <div className="container">
        <h1>FriendSphere</h1>
        <form onSubmit={handleSubmit} className="form-wrapper">
          <div className="form-item">
            <label>Email</label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="Email"
            />
            {emailWarningMessage && (
              <p className="error">{emailWarningMessage}</p>
            )}
          </div>
          <div className="form-item">
            <label>Username</label>
            <input
              type="text"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              placeholder="Username"
            />
            {usernameWarningMessage && (
              <p className="error">{usernameWarningMessage}</p>
            )}
          </div>
          <div className="form-item">
            <label>Password</label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Password"
            />
            {passwordWarningMessage && (
              <p className="error">{passwordWarningMessage}</p>
            )}
          </div>
          <div className="form-item">
            <label>Profile Picture</label>
            <div className="input-file-container">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                placeholder="Upload Picture"
                className="input-file"
              />
              <p>{file ? file?.name : <span>Upload Picture</span>}</p>
            </div>
            {passwordWarningMessage && (
              <p className="error">{passwordWarningMessage}</p>
            )}
          </div>
          <div className="btn-wrapper">
            <button type="submit">
              <Oval
                visible={signup.loading}
                height={20}
                width={20}
                color={theme.mode === "dark" ? "#fff" : "#000"}
                secondaryColor={theme.mode === "dark" ? "#000" : "#fff"}
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
              <p style={{ marginLeft: 5 }}>Signup</p>
            </button>
          </div>
          {signup.error && <p className="error">{signup.error}</p>}
          <div>
            Already Have an account ?{" "}
            <a
              href="/"
              style={{ color: theme.mode === "dark" ? "#fff" : "#000" }}
            >
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
