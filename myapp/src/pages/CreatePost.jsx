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
      data.append("image", file); // send actual file

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
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>

      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        className="w-full p-3 border rounded mb-4 outline-none"
      />

      <textarea
        name="caption"
        value={form.caption}
        onChange={handleChange}
        placeholder="Caption"
        className="w-full p-3 border rounded mb-4 outline-none"
        rows={5}
      />

      <input type="file" onChange={handleFile} className="mb-4" />

      {file && <img src={URL.createObjectURL(file)} alt="preview" className="mb-4 max-h-60 rounded" />}

      <button
        onClick={handleSubmit}
        disabled={loading || !file}
        className={`w-full py-3 rounded text-white ${loading ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"}`}
      >
        {loading ? "Posting..." : "Create Post"}
      </button>
    </div>
  );
}
