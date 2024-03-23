import React, { useEffect } from "react";
import "./profile-content.less";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser, toggleFriend } from "../../redux/user/userSlice";
import { CgProfile } from "react-icons/cg";
import { getUserPosts } from "../../redux/post/postSlice";
import { RotatingSquare } from "react-loader-spinner";

function ProfileContent() {
  const { id } = useParams();
  const { data } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      getUserPosts({
        data: {
          _id: id,
          accessToken: data.accessToken,
        },
        mode,
      })
    );
  }, [id]);

  const getUserPostsReducer = useSelector((state) => state.post.getUserPosts);

  useEffect(() => {
    if (data) {
      dispatch(
        getUser({
          data: {
            _id: id,
            accessToken: data.accessToken,
          },
          mode,
        })
      );
    }
  }, [data,id]);

  const currentUser = useSelector((state) => state.user.get);



  return (
    <div className="profile-content-wrapper">
      <div className="profile-content-top">
        <div className="profile-side">
          {currentUser?.data?.profilePicture ? (
            <img
              src={
                process.env.REACT_APP_IMAGE_URL +
                "images/" +
                currentUser?.data?.profilePicture
              }
              alt="user"
              className="profile-image"
            />
          ) : (
            <CgProfile size={100} className="profile-image" />
          )}
        </div>
        <div className="profile-details">
          <h4 className="username"> {currentUser?.data?.username}</h4>
          <div className="user-properties-wrapper">
            <div className="user-property">
              <h5 className="property-count">
                {getUserPostsReducer.data?.posts?.length}
              </h5>
              <h6 className="property-label">Posts</h6>
            </div>
            <div className="user-property">
              <h5 className="property-count">
                {currentUser?.data?.followers?.length}
              </h5>
              <h6 className="property-label">Followers</h6>
            </div>
            <div className="user-property">
              <h5 className="property-count">
                {currentUser?.data?.followings?.length}
              </h5>
              <h6 className="property-label">Followings</h6>
            </div>
          </div>
        </div>
      </div>
      <div className="bio-data">
        <p className="bio-title">Bio</p>
        <p className="bio-description">{currentUser?.data?.desc}</p>
      </div>
      <div className="user-operations">
        {data?._id === currentUser?.data?._id ? (
          <button onClick={() => navigate("/edit-profile")}>
            Edit Profile
          </button>
        ) : (
          <div className="list-wrapper">
            <button
              onClick={() =>
                dispatch(
                  toggleFriend({
                    id: currentUser?.data?._id,
                    data: {
                      _id: currentUser?.data?._id,
                      accessToken: data?.accessToken,
                    },
                    mode,
                    dispatch,
                  })
                )
              }
            >
              {currentUser?.data?.followers.includes(data?._id)
                ? "unfollow"
                : "Follow"}
            </button>
            <button>Message</button>
          </div>
        )}
      </div>
      <div className="all-posts">
        {getUserPostsReducer.loading ? (
          <RotatingSquare
            visible={true}
            height="100"
            width="100"
            color="#4fa94d"
            ariaLabel="rotating-square-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        ) : getUserPostsReducer.data?.posts.length === 0 ? (
          <div
            className="empty-box"
            style={{
              height: "20vh",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              color: "rgb(0, 149, 246)",
            }}
          >
            No Posts
          </div>
        ) : (
          getUserPostsReducer.data?.posts?.map((item, index) => {
            return (
              <>
                <img
                  key={index}
                  src={process.env.REACT_APP_IMAGE_URL + "images/" + item.image}
                  alt="user"
                  className="image-item"
                  onClick={() => navigate(`/fullview/${id}/${index}`)}
                />
              </>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ProfileContent;
