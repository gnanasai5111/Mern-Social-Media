import { useDispatch, useSelector } from "react-redux";
import "./app.less";
import Header from "./components/header/Header";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createContext, useEffect } from "react";
import { authSuccess } from "./redux/auth/authSlice";
import AppRoute from "./routes/AppRoute";
import useAxiosInstance from "./utilities/useAxiosInstance";
import { useState } from "react";

export const NotificationContext = createContext();
function App() {
  const theme = useSelector((state) => state.theme);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const userData = useAxiosInstance();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    dispatch(authSuccess(userData));
  }, [userData, dispatch]);

  const handleNotifications = (data) => {
    setNotifications([data, ...notifications]);
  };


  return (
    <BrowserRouter>
      <div
        className={theme.mode === "dark" ? "dark-mode app" : "light-mode app"}
      >
        <NotificationContext.Provider
          value={{
            notifications: notifications,
            handleNotifications: handleNotifications,
            setNotifications:setNotifications
          }}
        >
          {auth?.data && <Header />}
          <ToastContainer />
          <AppRoute />
        </NotificationContext.Provider>
      </div>
    </BrowserRouter>
  );
}

export default App;
