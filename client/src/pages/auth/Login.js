import React, { useState } from "react";
import "./auth.less";
import { showToast } from "../../utilities/toast";
import { useDispatch, useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/login/loginSlice";

function Login() {
  const [email, setEmail] = useState();
  const [emailWarningMessage, setEmailWarningMessage] = useState();
  const [passwordWarningMessage, setPasswordWarningMessage] = useState();
  const [password, setPassword] = useState();

  const theme = useSelector((state) => state.theme);

  const login = useSelector((state) => state.login);
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
    } else if (!password) {
      showToast("Please Enter Password", theme.mode, "error");
      setPasswordWarningMessage("Please Enter Password");
      setTimeout(() => {
        setPasswordWarningMessage("");
      }, 3000);
    } else {
      const data = JSON.stringify({ email, password });
      dispatch(loginUser({ data, theme, navigate, dispatch }));
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
          <div className="btn-wrapper">
            <button type="submit">
              <Oval
                visible={login.loading}
                height={20}
                width={20}
                color={theme.mode === "dark" ? "#fff" : "#000"}
                secondaryColor={theme.mode === "dark" ? "#000" : "#fff"}
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
              <p style={{ marginLeft: 5 }}>Login</p>
            </button>
          </div>
          {login.error && <p className="error">{login.error}</p>}
          <div>
            Don't Have an account ?{" "}
            <a
              href="/signup"
              style={{ color: theme.mode === "dark" ? "#fff" : "#000" }}
            >
              Signup
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
