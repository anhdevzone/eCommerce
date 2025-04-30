import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
const Login = ({ setToken }) => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (state === "Admin") {
        const { data } = await axios.post(
          `${backendUrl}/api/auth/admin-login`,
          {
            email,
            password,
          }
        );
        if (data.success) {
          setToken(data.token);
          toast.success(data.message);
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("email", email);
        } else {
          toast.error(data.error);
        }
      } else {
        const { data } = await axios.post(
          `${backendUrl}/api/auth/seller-login`,
          { email, password }
        );
        if (data.success) {
          setToken(data.token);
          toast.success(data.message);
          localStorage.setItem("email", email);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          toast.error(data.error);
        }
      }
    } catch (error) {
      toast.error(data.error);
    }
  };
  return (
    <div className="h-screen overflow-hidden flex items-center justify-center w-full">
      <div className="w-xl p-6 bg-white rounded-lg shadow-lg max-w-md">
        <h1 className="text-2xl font-bold mb-4">
          {state === "Admin" ? "Admin Login" : "Seller Login"}
        </h1>
        <form onSubmit={handleLogin}>
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              type="email"
              placeholder="your@gmail.com"
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
            />
          </div>
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">Mật khẩu</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              type="password"
              placeholder="Password"
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
            />
          </div>
          <button
            className="mt-2 w-full py-2 px-4 rounded-md text-white bg-black cursor-pointer hover:bg-gray-800 transition-all duration-300"
            type="submit"
          >
            {state === "Admin" ? "Đăng nhập Admin" : "Đăng nhập Seller"}
          </button>
        </form>
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">Bạn là ai?</p>
          <button
            onClick={() => setState(state === "Admin" ? "Seller" : "Admin")}
            className="text-sm text-blue-500 hover:underline cursor-pointer"
          >
            {state === "Admin" ? "Đăng nhập Seller" : "Đăng nhập Admin"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
