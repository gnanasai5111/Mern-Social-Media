import React, { useEffect, useState } from "react";
import "./edit-profile.less";
import { useDispatch, useSelector } from "react-redux";
import { CgProfile } from "react-icons/cg";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import { authLogout } from "../../redux/auth/authSlice";
import { deleteUser, editUser, getUser } from "../../redux/user/userSlice";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    desc: "",
    profilePicture: null,
    city: "",
    relationship: "",
    gender: "",
    birthday: "",
  });
  const [password, setPassword] = useState("");
  const [file, setFile] = useState();

  const { data } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  useEffect(() => {
    if (data) {
      dispatch(getUser({ data, mode }));
    }
  }, []);
  useEffect(() => {
    if (user?.get?.data) {
      let userData = user?.get?.data;
      let obj = {};
      for (const key in formData) {
        if (userData[key] && key === "birthday") {
          let value = userData[key]?.split("-");
          let newDate = value[0] + "-" + value[1] + "-" + value[2].slice(0, 2);
          obj = {
            ...obj,
            [key]: newDate,
          };
        } else if (userData[key]) {
          obj = {
            ...obj,
            [key]: userData[key],
          };
        }
      }
      setFormData({ ...formData, ...obj });
      setFile(null);
    }
  }, [user]);



  const handleDateChange = (event) => {
    setFormData({ ...formData, birthday: event.target.value });
  };

  const logoutHandler = () => {
    localStorage.removeItem("userData");
    dispatch(authLogout());
    navigate("/");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData();
    for (const key in formData) {
      if (formData[key] && key !== "profilePicture") {
        form.append(key, formData[key]);
      }
    }
    if (password) {
      form.append("password", password);
    }
    if (file) {
      form.append("image", file);
    }

    dispatch(editUser({ form, data, mode, dispatch }));
  };

  const deleteHandler = () => {
    dispatch(deleteUser({ data, navigate, mode, dispatch }));
  };

  const handleProfilePictureChange = (event) => {
    setFormData({
      ...formData,
      profilePicture: URL.createObjectURL(event.target.files[0]),
    });

    setFile(event.target.files[0]);
  };
  return (
<div className="edit-profile-wrapper">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <h2>Profile Page</h2>
          <div className="form-item">
            <div className="img-container">
              {file ? (
                <img
                  src={formData?.profilePicture}
                  alt="user"
                  style={{
                    height: 100,
                    width: 100,
                    borderRadius: "50%",
                    marginLeft: "20px",
                    cursor: "pointer",
                  }}
                />
              ) : formData?.profilePicture ? (
                <img
                  src={
                    process.env.REACT_APP_IMAGE_URL +
                    "images/" +
                    formData?.profilePicture
                  }
                  alt="user"
                  style={{
                    height: 100,
                    width: 100,
                    borderRadius: "50%",
                    marginLeft: "20px",
                    cursor: "pointer",
                  }}
                />
              ) : (
                <CgProfile size={100} />
              )}

              <input
                type="file"
                onChange={handleProfilePictureChange}
                className="file-input"
              />
            </div>
          </div>
          <div className="form-item">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Email"
            />
          </div>
          <div className="form-item">
            <label>New Password</label>
            <input
              type="password"
              value={password}
              placeholder="Enter your new Password"
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div className="form-item">
            <label>Username</label>
            <input
              type="text"
              value={formData.username}
              placeholder="Username"
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>
          <div className="form-item">
            <label>Description</label>
            <textarea
              value={formData.desc}
              onChange={(e) =>
                setFormData({ ...formData, desc: e.target.value })
              }
              placeholder="Description"
            />
          </div>
          <div className="form-item">
            <label>City</label>
            <input
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              placeholder="City"
            />
          </div>
          <div className="form-item">
            <label>Gender</label>
            <select
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              value={formData.gender}
              placeholder="Select Gender"
            >
              <option value="">Select Gender</option>
              <option value={1}>Male</option>
              <option value={2}>Female</option>
              <option value={3}>Other</option>
            </select>
          </div>
          <div className="form-item">
            <label>Relationship</label>
            <select
              onChange={(e) =>
                setFormData({ ...formData, relationship: e.target.value })
              }
              value={formData.relationship}
              placeholder="Select Relationship"
            >
              <option value="">Select Relationship</option>
              <option value={1}>Single</option>
              <option value={2}>Married</option>
            </select>
          </div>
          <div className="form-item">
            <label>Birthday</label>
            <input
              type="date"
              value={formData.birthday}
              onChange={handleDateChange}
            />
          </div>

          <div className="btn-wrapper">
            <button type="submit">
              <Oval
                visible={user?.update?.loading}
                height={20}
                width={20}
                color={mode === "dark" ? "#fff" : "#000"}
                secondaryColor={mode === "dark" ? "#000" : "#fff"}
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
              <p style={{ marginLeft: 5 }}>Update</p>
            </button>
            <button
              type="button"
              onClick={() => deleteHandler()}
              style={{ marginLeft: 10 }}
            >
              <Oval
                visible={user?.delete?.loading}
                height={20}
                width={20}
                color={mode === "dark" ? "#fff" : "#000"}
                secondaryColor={mode === "dark" ? "#000" : "#fff"}
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
              <p style={{ marginLeft: 5, color: "red" }}>Delete</p>
            </button>
          </div>
        </form>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            type="button"
            onClick={() => logoutHandler()}
            style={{
              marginLeft: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              flexDirection: "row",
              padding: 10,
            }}
          >
            <p style={{ marginRight: 5, color: "red" }}>LogOut</p>
            <CiLogout />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
