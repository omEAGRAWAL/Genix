import { useState, useEffect, useRef } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebaseConfig";
import Header from "../component_home/Nav_bar";
function AuctionList() {
  const filePickerRef = useRef();
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
  });

  useEffect(() => {
    if (imageFile) uploadImage();
  }, [imageFile]);

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
          setForm({ ...form, image: downloadURL });
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
      console.log("Token:", token);
      //Token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmExMTY2MDI0NTQxYjgwNzliNWQzOWUiLCJpYXQiOjE3MjE4ODA4ODV9.55ZjB3T-4JrgGisv0VaRFE4uWmBfSgdg4aR0ebcL6to"

      const response = await fetch("/api/auctions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include token if needed for authentication
          Authorization: token,
        },
        body: JSON.stringify({
          title: form.name,
          description: form.description,
          startingBid: form.price,
          endDate: form.endDate,
          image: form.image, // Add the image URL to the request body
        }),
      });

      if (response.ok) {
        alert("Auction item created successfully");
        setForm({
          name: "",
          description: "",
          price: "",
          endDate: "",
        });
        setImageFile(null);
        setImageUrl(null);
      } else {
        const error = await response.text();
        alert(`Error: ${error}`);
      }
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  return (
    <div>
      <Header />
      <form
        onSubmit={handleSubmit}
        className="form flex flex-col justify-center items-center"
      >
        <input
          className="border-4"
          type="file"
          ref={filePickerRef}
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />
        <img
          src={
            imageUrl ||
            "https://media-d.global.abb/is/image/abbc/DYK%20YuMi%202:16x9?wid=768&hei=432"
          }
          alt="Upload Image"
          className="rounded-full w-32 h-32"
          onClick={() => filePickerRef.current.click()}
        />
        {uploading && <p>Upload progress: {uploadPercentage}%</p>}
        {uploadFail && <p>Upload failed. Please try again.</p>}
        <label>Name</label>
        <input
          className="border-4"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <label>Description</label>
        <input
          className="border-4"
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <label>Starting Price</label>
        <input
          className="border-4"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <label>End Date</label>
        <input
          className="border-4"
          type="datetime-local"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AuctionList;
