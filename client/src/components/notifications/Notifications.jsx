import React, { useContext} from "react";
import "./notifications.less";
import { axiosInstance } from "../../utilities/useAxiosInstance";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../../App";

function Notifications({ setShowNotifications }) {
  const { data } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const { notifications } = useContext(NotificationContext);

  const readAsMarked = (item) => {
    setShowNotifications(false);
    axiosInstance
      .put(`/notifications/${item._id}/${data._id}`, {
        headers: {
          Authorization: "Bearer " + data.accessToken,
        },
      })
      .then((res) => {
        navigate(`/chats/${item?.chat?._id}`);
        return res.data;
      })
      .catch((error) => {
        throw error.response.data.message;
      });
  };

  return (
    <div className="notifications-wrapper background">
      {notifications?.length === 0 ? (
        <div
          className="empty-box"
          style={{
            height: "19vh",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
            color: "rgb(0, 149, 246)",
          }}
        >
          No Notifications
        </div>
      ) : (
        notifications?.map((i) => {
          return (
            <div className="each-item" onClick={() => readAsMarked(i)}>
              {i.message}
            </div>
          );
        })
      )}
    </div>
  );
}

export default Notifications;
