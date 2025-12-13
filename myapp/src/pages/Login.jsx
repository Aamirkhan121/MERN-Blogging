import { useState } from "react";
import axios from "../utils/instance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("/users/login", form);

      // Save token
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful!");

      // Redirect to home
      setTimeout(() => navigate("/"), 1000);

    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">

        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back 👋</h2>

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm font-medium">Email</label>
          <input
            name="email"
            type="email"
            className="w-full p-3 border rounded-md mt-1 focus:ring focus:ring-blue-300 outline-none"
            placeholder="Enter your email"
            onChange={handleChange}
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="text-sm font-medium">Password</label>
          <div className="relative">
            <input
              name="password"
              type={showPass ? "text" : "password"}
              className="w-full p-3 border rounded-md mt-1 focus:ring focus:ring-blue-300 outline-none"
              placeholder="Enter your password"
              onChange={handleChange}
            />
            <span
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-4 cursor-pointer text-gray-500 text-sm"
            >
              {showPass ? "Hide" : "Show"}
            </span>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 rounded-md text-white font-medium transition ${
            loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Register Link */}
        <p className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 cursor-pointer font-medium"
          >
            Create one
          </span>
        </p>
      </div>
    </div>
  );
}

