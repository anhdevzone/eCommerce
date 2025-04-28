import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { TbSquareRoundedArrowUp } from "react-icons/tb";
import {
  UserOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Dropdown } from "antd";
import { AppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(AppContext);
  const items = [
    {
      label: "Tài khoản của bạn",
      key: "1",
      icon: <UserOutlined />,
    },
    {
      label: "Đơn hàng của bạn",
      key: "2",
      icon: <ShoppingCartOutlined />,
    },
    {
      label: "Đăng xuất",
      key: "3",
      onClick: () => logout(),
      icon: <LogoutOutlined />,
    },
  ];
  const menuProps = {
    items,
  };
  return (
    <div className="flex flex-col justify-center items-center border-b border-gray-300">
      <div className="flex items-center justify-between gap-4 w-full">
        <img src={assets.logo} alt="" className="h-28" />
        <div className="relative w-full max-w-2xl">
          <form className="flex items-center justify-center gap-2 w-full">
            <input
              type="text"
              className="w-full py-3 px-6 outline-none border border-gray-400 rounded-full text-sm text-gray-600 focus:border-orange-700 transition-all duration-300 ease-in-out "
              placeholder="Tìm kiếm sản phẩm ở đây ..."
            />
            <button className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 bg-gray-200 p-2.5 rounded-full cursor-pointer">
              <FaSearch />
            </button>
          </form>
        </div>
        {user ? (
          <div className="flex items-center justify-center gap-6 text-gray-500">
            <FaShoppingCart className="text-3xl" />
            <Dropdown.Button
              menu={menuProps}
              placement="bottom"
              icon={<UserOutlined />}
              className="!hover:bg-orange-500"
            >
              Hi {user.name}
            </Dropdown.Button>
          </div>
        ) : (
          <div>
            <Link to="/login" className="">
              <button className="cursor-pointer group relative bg-white hover:bg-orange-500 text-black font-semibold text-sm px-6 py-3 rounded-full transition-all duration-200 ease-in-out shadow hover:shadow-lg w-40 h-12">
                <div className="relative flex items-center justify-center gap-2">
                  <span className="relative inline-block overflow-hidden">
                    <span className="block transition-transform duration-300 group-hover:-translate-y-full">
                      Đăng nhập
                    </span>
                    <span className="absolute inset-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0 text-white">
                      Ngay
                    </span>
                  </span>

                  <TbSquareRoundedArrowUp className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90 group-hover:text-white" />
                </div>
              </button>
            </Link>
          </div>
        )}
      </div>
      <div className="text-gray-500 text-sm font-semibold py-2 ">
        <ul className="flex items-center justify-center gap-2">
          <li className="py-1 px-2 cursor-pointer hover:text-orange-600 transition-all duration-300 ease-in-out">
            Thời trang nam
          </li>
          <li className="py-1 px-2 cursor-pointer hover:text-orange-600 transition-all duration-300 ease-in-out">
            Thời trang nữ
          </li>
          <li className="py-1 px-2 cursor-pointer hover:text-orange-600 transition-all duration-300 ease-in-out">
            Điện tử
          </li>
          <li className="py-1 px-2 cursor-pointer hover:text-orange-600 transition-all duration-300 ease-in-out">
            Giày dép
          </li>
          <li className="py-1 px-2 cursor-pointer hover:text-orange-600 transition-all duration-300 ease-in-out">
            Gia dụng
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
