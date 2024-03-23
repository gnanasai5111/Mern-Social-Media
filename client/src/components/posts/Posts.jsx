import React, { useEffect, useState } from "react";
import "./posts.less";
import Search from "../search/Search";
import { useDispatch, useSelector } from "react-redux";
import { MdPhotoLibrary} from "react-icons/md";
import PostItem from "./PostItem";
import { addPost, getTimelinePosts } from "../../redux/post/postSlice";
import { RotatingSquare } from "react-loader-spinner";
import { showToast } from "../../utilities/toast";

function Posts() {
  const [search, setSearch] = useState("");
  const [file, setFile] = useState();
  const { data } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const [showComments, setShowComments] = useState("");
  useEffect(() => {
    dispatch(getTimelinePosts({ data, mode }));
  }, []);

  const getTimelinePostsReducer = useSelector(
    (state) => state.post.getTimelinePosts
  );

  const handleSearch = (value) => {
    setSearch(value);
  };

  const createPostHandler = () => {
    if (!search) {
      showToast("Enter Description", mode, "error");
    } else if (!file) {
      showToast("Select a File", mode, "error");
    } else {
      const form = new FormData();
      form.append("desc", search);
      form.append("image", file);
      dispatch(addPost({ form, data, mode, dispatch }));
      setFile();
      setSearch("");
    }
  };
  return (
    <div className="posts-wrapper">
      <div className="create-post background">
        <Search
          handleSearch={handleSearch}
          search={search}
          setSearch={setSearch}
          placeholder={`Whats on your mind, ${data.username}?`}
        />
        <div className="icon-container">
          <div style={{ position: "relative" }}>
            <MdPhotoLibrary /> {file ? file?.name : "Photo/Video"}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              style={{
                position: "absolute",
                height: "100%",
                width: "100%",
                opacity: 0,
                content: "",
                top: 0,
                left: 0,
              }}
            />
          </div>

          <button onClick={() => createPostHandler()}>Create Post</button>
        </div>
      </div>
      <div className="all-posts">
        {getTimelinePosts.loading ? (
          <RotatingSquare
            visible={true}
            height="100"
            width="100"
            color="#4fa94d"
            ariaLabel="rotating-square-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        ) : getTimelinePostsReducer.data?.posts.length === 0 ? (
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
          getTimelinePostsReducer.data?.posts?.map((item) => {
            return (
              <PostItem
                key={item._id}
                image={item.image}
                desc={item.desc}
                user={item.user}
                likes={item.likes}
                postId={item._id}
                showComments={showComments}
                setShowComments={setShowComments}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

export default Posts;
