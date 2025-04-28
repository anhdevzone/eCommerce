import { createContext, useState, useEffect } from "react";
export const AppContext = createContext();

const AppContextprovider = (props) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null; // Khởi tạo user từ localStorage
  });
  const [isShowNavbarFooter, setIsShowNavbarFooter] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token")); // Khởi tạo token từ localStorage
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("email");
    setToken(null);
    setUser(null);
  };

  // Lưu user vào localStorage khi user thay đổi
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const value = {
    user,
    setUser,
    isShowNavbarFooter,
    setIsShowNavbarFooter,
    token,
    setToken,
    logout,
    backendUrl,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextprovider;
