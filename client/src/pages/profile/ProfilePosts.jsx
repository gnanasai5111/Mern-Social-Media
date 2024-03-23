import React, { useEffect, useRef, useState } from "react";
import "./profile-posts.less";
import { useDispatch, useSelector } from "react-redux";
import { getUserPosts } from "../../redux/post/postSlice";
import { RotatingSquare } from "react-loader-spinner";
import PostItem from "../../components/posts/PostItem";
import { useParams } from "react-router-dom";
function ProfilePosts() {
  const { id, indexId } = useParams();
  const { data } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const [showComments, setShowComments] = useState("");
  const dispatch = useDispatch();
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
  const scrollToIndexRef = useRef(null);
  useEffect(() => {
    if (indexId && scrollToIndexRef.current) {
      scrollToIndexRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [indexId]);

  const getUserPostsReducer = useSelector((state) => state.post.getUserPosts);

  return (
    <div className="profile-posts-wrapper">
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
              <div
                ref={index === parseInt(indexId) ? scrollToIndexRef : null}
                key={item._id}
              >
                <PostItem
                  image={item.image}
                  desc={item.desc}
                  user={{
                    _id: data?._id,
                    username: data?.username,
                  }}
                  likes={item.likes}
                  postId={item._id}
                  showComments={showComments}
                  setShowComments={setShowComments}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ProfilePosts;
