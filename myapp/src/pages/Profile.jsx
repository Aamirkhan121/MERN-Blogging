import { useState, useEffect } from "react";
import axios from "../utils/instance";
import { toast } from "react-toastify";
import { FaPencilAlt } from "react-icons/fa";

export default function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(storedUser);

  const [form, setForm] = useState({
    username: storedUser.username,
    email: storedUser.email,
  });

  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(storedUser.profilePic || "/default-profile.png");

  useEffect(() => {
    setPreview(user?.profilePic || "/default-profile.png");
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const res = await axios.put(`/users/profile/${user.username}`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
    setLoading(false);
  };

  const uploadProfilePic = async () => {
    if (!photo) return toast.error("Please select a photo");

    const formData = new FormData();
    formData.append("photo", photo);

    setLoading(true);
    try {
      const res = await axios.put(
        `/users/profile/upload-pic/${user.username}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Profile picture updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-2xl rounded-2xl mt-10 mb-20">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center"> <FaPencilAlt className="inline mr-2" /> Edit Profile</h1>

      {/* Profile Picture */}
      <div className="flex flex-col items-center gap-4 mb-6">
        <div className="relative group">
          <img
            src={preview}
            alt="Profile"
            className="w-36 h-36 rounded-full object-cover border-4 border-green-500 shadow-xl transition-transform transform group-hover:scale-105"
          />
          <button
            onClick={() => document.getElementById("fileInput").click()}
            className="absolute bottom-2 right-2 bg-white border shadow p-3 rounded-full hover:bg-gray-100 transition"
          >
            📷
          </button>
        </div>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="hidden"
        />
        <button
          onClick={uploadProfilePic}
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white font-semibold shadow-lg transition-all duration-300 ${
            loading ? "bg-green-400" : "bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800"
          }`}
        >
          {loading ? "Uploading..." : "Upload Picture"}
        </button>
      </div>

      {/* Username */}
      <label className="font-semibold text-gray-700">Username</label>
      <input
        name="username"
        value={form.username}
        onChange={handleChange}
        className="w-full p-4 border rounded-xl mb-4 focus:ring-2 focus:ring-green-500 outline-none transition"
      />

      {/* Email */}
      <label className="font-semibold text-gray-700">Email</label>
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        className="w-full p-4 border rounded-xl mb-6 focus:ring-2 focus:ring-green-500 outline-none transition"
      />

      {/* Update Button */}
      <button
        onClick={updateProfile}
        disabled={loading}
        className={`w-full py-3 rounded-xl text-white font-semibold shadow-lg transition-all duration-300 ${
          loading ? "bg-blue-400" : "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
        }`}
      >
        {loading ? "Saving..." : "Update Profile"}
      </button>
    </div>
  );
}
