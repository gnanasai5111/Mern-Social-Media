import React, { useEffect, useState } from "react";
import "./post-item.less";
import { MdDelete, MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { FaRegComment } from "react-icons/fa";
import { deletePost, toggleLike } from "../../redux/post/postSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utilities/toast";
import { addComment } from "../../redux/comment/commentSlice";
import Comments from "../comments/Comments";

function PostItem({ image, desc, user, likes, postId ,showComments,setShowComments}) {
  const [comment, setComment] = useState("");
  const { data } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);

  const [liked, setLiked] = useState(false);


  useEffect(() => {
    if (likes.includes(data?._id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [likes]);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const addCommentHandler = () => {
    if (!comment) {
      showToast("Please write a comment", mode, "error");
    } else {
      const form = JSON.stringify({
        postId: postId,
        content: comment,
        userId: data?._id,
        username: data?.username,
        profilePicture: data?.profilePicture,
      });
      dispatch(addComment({ form, data, mode, postId, dispatch }));
      setComment("");
    }
  };
  return (
    <div className="post-item-wrapper">
      <div className="item-header">
        <div className="left-values">
          <img
            src="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg"
            alt="post-item"
          />
          <h6
            onClick={() => {
              navigate(`/profile/${user._id}`);
            }}
          >
            {user.username}
          </h6>
        </div>
        {data?._id === user?._id && (
          <div className="right-values">
            <MdDelete
              onClick={() =>
                dispatch(deletePost({ data, postId, mode, dispatch }))
              }
            />
          </div>
        )}
      </div>
      <div className="item-body">
        <img
          src={process.env.REACT_APP_IMAGE_URL + "images/" + image}
          alt="post-item"
        />
      </div>
      <div className="item-icons">
        {liked ? (
          <MdFavorite
            color="red"
            onClick={() =>
              dispatch(toggleLike({ postId, data, mode, dispatch }))
            }
          />
        ) : (
          <MdFavoriteBorder
            onClick={() =>
              dispatch(toggleLike({ postId, data, mode, dispatch }))
            }
          />
        )}
        <FaRegComment />
      </div>
      <div className="likes-count">{likes.length} Likes</div>
      <div className="desc-container">
        <strong>{user.username} </strong> {desc}
      </div>
      <div className="comments-container">
        {showComments===postId && <Comments postId={postId} data={data} mode={mode} postUserId={user._id}/>}
        <h6 onClick={() => setShowComments(postId)}>
          {showComments===postId ? "Hide All Comments" : "View All Comments"}
        </h6>
        <div className="input-box">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a Comment"
          />
          <button onClick={() => addCommentHandler()}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default PostItem;
