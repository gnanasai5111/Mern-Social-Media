import React, { useEffect } from "react";
import "./comments.less";
import { useDispatch, useSelector } from "react-redux";
import { deleteComment, getComments } from "../../redux/comment/commentSlice";
import { RotatingSquare } from "react-loader-spinner";
import { CgProfile } from "react-icons/cg";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function Comments({ postId, data, mode, postUserId }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getComments({ postId, data, mode }));
  }, [postId]);

  const getCommentsReducer = useSelector((state) => state.comment.getComments);
  const navigate = useNavigate();

  const deleteHandler = (commentId) => {
    dispatch(deleteComment({ commentId, postId, mode, data, dispatch }));
  };

  return (
    <div>
      {" "}
      {getCommentsReducer.loading ? (
        <RotatingSquare
          visible={true}
          height="100"
          width="100"
          color="#4fa94d"
          ariaLabel="rotating-square-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      ) : getCommentsReducer.data?.comments?.length === 0 ? (
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
          No Comments
        </div>
      ) : (
        getCommentsReducer.data?.comments?.map((item) => {
          return (
            <div className="comment-item">
              <div>
                {item.profilePicture ? (
                  <img
                    src={
                      process.env.REACT_APP_IMAGE_URL +
                      "images/" +
                      item.profilePicture
                    }
                    alt="user"
                    className="comment-photo"
                  />
                ) : (
                  <CgProfile size={20} />
                )}

                <h4
                  className="comment-username"
                  onClick={() => navigate(`/profile/${item.userId}`)}
                >
                  {item.username}
                </h4>
                <h4 className="comment-desc">{item.content}</h4>
              </div>
              {(postUserId === data?._id || data?._id === item.userId) && (
                <MdDelete
                  color="red"
                  size={20}
                  onClick={() => deleteHandler(item._id)}
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default Comments;
