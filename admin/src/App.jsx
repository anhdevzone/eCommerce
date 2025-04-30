import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
export const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideBar from "./components/SideBar";
import { Routes, Route } from "react-router-dom";
import AddSeller from "./pages/Admin/AddSeller";
import Dashboard from "./pages/Admin/Dashboard";
const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );
  // Function to get the role from localStorage
  const getRole = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user).role : null; // Parse and return the role
  };

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  const role = getRole();

  return (
    <div className="px-4 sm:px-[5vw] md:px-[2vw] lg:px[9vw]">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Zoom}
      />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-1 h-screen py-4">
            <SideBar />
          </div>
          <div className="col-span-5 py-4">
            <Navbar setToken={setToken} />
            <Routes>
              {role === "admin" && (
                <>
                  <Route path="/admin/add-seller" element={<AddSeller />} />
                  <Route path="/admin/dashboard" element={<Dashboard />} />
                </>
              )}
            </Routes>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
