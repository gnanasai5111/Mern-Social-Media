import axios from "axios";
import { jwtDecode } from "jwt-decode";

let user = localStorage.getItem("userData")
  ? JSON.parse(localStorage.getItem("userData"))
  : null;

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

const useAxiosInstance = () => {
  const getTokens = async (data) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}refresh`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    } catch (err) {
      return err;
    }
  };

  axiosInstance.interceptors.request.use(
    async (config) => {
      let currentUserData = localStorage.getItem("userData")
        ? JSON.parse(localStorage.getItem("userData"))
        : null;

      const accessTokenExpiryDate = jwtDecode(currentUserData?.accessToken);

      if (accessTokenExpiryDate.exp * 1000 < new Date().getTime()) {
        const { accessToken, refreshToken } = await getTokens(
          JSON.stringify({ token: currentUserData.refreshToken })
        );

        currentUserData = {
          ...currentUserData,
          accessToken,
          refreshToken,
        };

        localStorage.setItem("userData", JSON.stringify(currentUserData));
        config.headers["Authorization"] = "Bearer " + accessToken;
      } else {
        config.headers["Authorization"] =
          "Bearer " + currentUserData.accessToken;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return user;
};

export default useAxiosInstance;
