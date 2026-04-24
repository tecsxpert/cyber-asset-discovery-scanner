import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", form);

      console.log("Login response:", res.data);

      // Works for different backend response names
      const token = res.data.token || res.data.jwt || res.data.accessToken;

      if (!token) {
        alert("Login success, but token not found in response");
        return;
      }

      loginUser(token);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Cyber Scanner Login
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={form.username}
          className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;