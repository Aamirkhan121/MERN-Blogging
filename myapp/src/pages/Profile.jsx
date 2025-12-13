import { useState, useEffect } from "react";
import axios from "../utils/instance";
import { toast } from "react-toastify";

export default function Profile() {
  // Stored user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(storedUser);

  const [form, setForm] = useState({
    username: storedUser.username,
    email: storedUser.email,
  });

  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(storedUser.profilePic || "/default-profile.png");

  // Update preview if user.profilePic changes
  useEffect(() => {
    setPreview(user?.profilePic || "/default-profile.png");
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  // Update username/email
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

  // Upload profile picture
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
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>

      {/* Profile Picture */}
      <div className="flex flex-col items-center gap-4 mb-6">
        <div className="relative">
          <img
            src={preview}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 shadow-lg"
          />
          <button
            onClick={() => document.getElementById("fileInput").click()}
            className="absolute bottom-2 right-2 bg-white border shadow p-2 rounded-full hover:bg-gray-100 transition"
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
          className={`w-full py-3 rounded-xl text-white font-medium shadow ${
            loading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
          } transition-all`}
        >
          {loading ? "Uploading..." : "Upload Picture"}
        </button>
      </div>

      {/* Username */}
      <label className="font-medium">Username</label>
      <input
        name="username"
        value={form.username}
        onChange={handleChange}
        className="w-full p-3 border rounded mb-4"
      />

      {/* Email */}
      <label className="font-medium">Email</label>
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        className="w-full p-3 border rounded mb-4"
      />

      {/* Update Button */}
      <button
        onClick={updateProfile}
        disabled={loading}
        className={`w-full py-3 rounded-xl mb-6 text-white font-medium ${
          loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
        } transition-all shadow`}
      >
        {loading ? "Saving..." : "Update Profile"}
      </button>
    </div>
  );
}


