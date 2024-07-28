/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useParams, useNavigate } from "react-router-dom";
import { app } from "../firebaseConfig";
import Header from "../component_home/Nav_bar";

function EditAuction() {
  const { id } = useParams(); // Get the auction ID from the URL
  const navigate = useNavigate(); // For navigation after update
  const filePickerRef = useRef();
  const [auction, setAuction] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploadFail, setUploadFail] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    endDate: "",
    image: "",
  });

  useEffect(() => {
    fetchAuctionData(); // Fetch existing auction data when the component mounts
  }, [id]);

  useEffect(() => {
    if (imageFile) uploadImage();
  }, [imageFile]);

  const fetchAuctionData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/auctions/${id}`, {
        method: "GET",
      });
      if (response.ok) {
        const auction = await response.json();
        setAuction(auction);

        setForm({
          name: auction.auction.title || "",
          description: auction.auction.description || "",
          price: auction.auction.startingBid || "",
          endDate: auction.auction.endDate || "",
          image: auction.auction.image || "",
        });
        setImageUrl(auction.auction.image || "");
      } else {
        alert("Failed to fetch auction data.");
      }
    } catch (error) {
      console.error("Error fetching auction data", error);
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
          setForm((prevForm) => ({ ...prevForm, image: downloadURL }));
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

      const response = await fetch(`http://localhost:3000/api/auctions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // Ensure token is in the correct format
        },
        body: JSON.stringify({
          title: form.name,
          description: form.description,
          startingBid: form.price,
          endDate: form.endDate,
          image: form.image,
        }),
      });

      if (response.ok) {
        alert("Auction item updated successfully");
        navigate("/"); // Redirect to another page after successful update
      } else {
        const error = await response.text();
        alert(`Error: ${error}`);
      }
    } catch (error) {
      console.error("Error updating auction", error);
    }
  };

  return (
    <div className="pt-16">
      <Header />
      <div className="max-w-2xl mx-auto mt-10 p-4 bg-white shadow-xl rounded-md">
        <h1 className="text-2xl font-semibold mb-4">Edit Auction</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center">
            <input
              className="hidden"
              type="file"
              ref={filePickerRef}
              onChange={handleImageUpload}
            />
            <img
              src={form.image || "https://via.placeholder.com/150"}
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
              Name
            </label>
            <input
              type="text"
              placeholder="Name"
              value={form.name || ""}
              onChange={(e) =>
                setForm((prevForm) => ({ ...prevForm, name: e.target.value }))
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              placeholder="Description"
              value={form.description || ""}
              onChange={(e) =>
                setForm((prevForm) => ({
                  ...prevForm,
                  description: e.target.value,
                }))
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={5}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Starting Price
            </label>
            <input
              type="number"
              placeholder="Price"
              value={form.price || ""}
              onChange={(e) =>
                setForm((prevForm) => ({ ...prevForm, price: e.target.value }))
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {!auction.ended ? (
            <p className="text-red-500">This auction has ended</p>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="datetime-local"
                value={form.endDate || ""}
                onChange={(e) =>
                  setForm((prevForm) => ({
                    ...prevForm,
                    endDate: e.target.value,
                  }))
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Update Auction
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditAuction;
