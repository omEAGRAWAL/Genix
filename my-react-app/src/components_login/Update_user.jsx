/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { app } from "../firebaseConfig";
import Header from "../component_home/Nav_bar";

function UserEdit() {
  const navigate = useNavigate();
  const filePickerRef = useRef();
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploadFail, setUploadFail] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    user_image: "",
    new_password: "",
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (imageFile) uploadImage();
  }, [imageFile]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/users/user", {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });
      if (response.ok) {
        const user = await response.json();
        setForm({
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.email || "",
          password: "", // Optionally leave this out or handle it differently
          user_image: user.user_image || "",
        });
        setImageUrl(user.user_image || "");
      } else {
        alert("Failed to fetch user data.");
      }
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    const storage = getStorage(app);
    const filename = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, filename);

    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploading(true);
        setUploadPercentage(progress.toFixed(0));
      },
      (error) => {
        console.error("Upload failed", error);
        setUploadFail(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
          setForm((prevForm) => ({ ...prevForm, user_image: downloadURL }));
          setUploadFail(false);
          setUploading(false);
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3000/api/users/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        alert("User data updated successfully");
        navigate("/"); // Redirect to another page after successful update
      } else {
        const error = await response.text();
        alert(`Error: ${error}`);
      }
    } catch (error) {
      console.error("Error updating user data", error);
    }
  };

  return (
    <div className="pt-16">
      <Header />
      <div className="max-w-2xl mx-auto mt-10 p-4 bg-white shadow-xl rounded-md">
        <h1 className="text-2xl font-semibold mb-4">Edit User Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center">
            <input
              className="hidden"
              type="file"
              ref={filePickerRef}
              onChange={handleImageUpload}
            />
            <img
              src={imageUrl || "https://via.placeholder.com/150"}
              alt="Upload Image"
              className="rounded-md w-44 h-34 object-cover cursor-pointer"
              onClick={() => filePickerRef.current.click()}
            />
            {uploading && (
              <p className="text-gray-500">
                Upload progress: {uploadPercentage}%
              </p>
            )}
            {uploadFail && (
              <p className="text-red-500">Upload failed. Please try again.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              placeholder="First Name"
              value={form.first_name || ""}
              onChange={(e) =>
                setForm((prevForm) => ({
                  ...prevForm,
                  first_name: e.target.value,
                }))
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Last Name"
              value={form.last_name || ""}
              onChange={(e) =>
                setForm((prevForm) => ({
                  ...prevForm,
                  last_name: e.target.value,
                }))
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              value={form.email || ""}
              onChange={(e) =>
                setForm((prevForm) => ({ ...prevForm, email: e.target.value }))
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              value={form.password || ""}
              onChange={(e) =>
                setForm((prevForm) => ({
                  ...prevForm,
                  password: e.target.value,
                }))
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              placeholder="New Password"
              // value={form.password || ""}
              onChange={(e) =>
                setForm((prevForm) => ({
                  ...prevForm,
                  new_password: e.target.value,
                }))
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserEdit;
