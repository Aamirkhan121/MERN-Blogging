import { useState } from "react";
import axios from "../utils/instance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = "Username is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Email is invalid";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleRegister = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/users/register", form);

      toast.success("Account created successfully!");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleRegister();
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account ✨</h2>

        {/* Username */}
        <div className="mb-4">
          <label className="text-sm font-medium">Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            className={`w-full p-3 border rounded-md mt-1 focus:ring focus:ring-blue-300 outline-none ${
              errors.username ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your username"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm font-medium">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            className={`w-full p-3 border rounded-md mt-1 focus:ring focus:ring-blue-300 outline-none ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="text-sm font-medium">Password</label>
          <div className="relative">
            <input
              name="password"
              type={showPass ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              className={`w-full p-3 border rounded-md mt-1 focus:ring focus:ring-blue-300 outline-none ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your password"
            />
            <span
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-4 cursor-pointer text-gray-500 text-sm"
            >
              {showPass ? "Hide" : "Show"}
            </span>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Register Button */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className={`w-full py-3 rounded-md text-white font-medium transition ${
            loading ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Login Link */}
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer font-medium"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
