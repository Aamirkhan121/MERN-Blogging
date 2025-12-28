import { useState } from "react";
import axios from "../utils/instance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", caption: "" });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFile = (e) => setFile(e.target.files[0]);

  const handleSubmit = async () => {
    if (!form.title || !form.caption || !file) {
      toast.error("Title, caption, and image are required");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("caption", form.caption);
      data.append("image", file);

      await axios.post("/posts/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Post created!");
      navigate("/");
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-2xl rounded-2xl mt-10 mb-20">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create a New Post</h1>

      {/* Title Input */}
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        className="w-full p-4 border rounded-xl mb-4 focus:ring-2 focus:ring-green-500 outline-none transition"
      />

      {/* Caption Input */}
      <textarea
        name="caption"
        value={form.caption}
        onChange={handleChange}
        placeholder="Write a caption..."
        className="w-full p-4 border rounded-xl mb-4 focus:ring-2 focus:ring-green-500 outline-none transition"
        rows={5}
      />

      {/* File Input */}
      <input
        type="file"
        onChange={handleFile}
        className="mb-4"
        accept="image/*"
      />

      {/* Image Preview */}
      {file && (
        <img
          src={URL.createObjectURL(file)}
          alt="Preview"
          className="mb-4 max-h-64 w-full object-cover rounded-xl shadow-lg"
        />
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading || !file}
        className={`w-full py-3 rounded-xl text-white font-semibold shadow-lg transition-all duration-300 ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800"
        }`}
      >
        {loading ? "Posting..." : "Create Post"}
      </button>
    </div>
  );
}
