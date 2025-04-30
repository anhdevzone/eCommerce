import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AppstoreOutlined } from "@ant-design/icons";
import { Menu } from "antd";

// Function to get the role from localStorage
const getRole = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user).role : null;
};

const role = getRole();

// Sidebar items cho admin
const adminItems = [
  {
    key: "sub1",
    label: <Link to="/admin/dashboard">Dashboard</Link>,
    icon: <AppstoreOutlined />,
    children: [
      { key: "1", label: "Option 1" },
      {
        key: "sub2",
        label: "Quản lý Tài khoản",
        children: [
          { key: "2", label: <Link to="/admin/add-seller">Thêm Seller</Link> },
          {
            key: "3",
            label: <Link to="/admin/manage-users">Quản lý Users</Link>,
          },
        ],
      },
    ],
  },
  { type: "divider" },
];

// Sidebar items cho seller
const sellerItems = [
  {
    key: "sub1",
    label: <Link to="/seller/dashboard">Dashboard</Link>,
    icon: <AppstoreOutlined />,
    children: [
      { key: "1", label: "Option 1" },
      {
        key: "sub2",
        label: "Quản lý Sản phẩm",
        children: [
          {
            key: "2",
            label: <Link to="/seller/add-product">Thêm Sản phẩm</Link>,
          },
          {
            key: "3",
            label: <Link to="/seller/manage-products">Quản lý Sản phẩm</Link>,
          },
        ],
      },
    ],
  },
  { type: "divider" },
];

// Chọn items phù hợp với role
const items = role === "admin" ? adminItems : sellerItems;

const SideBar = () => {
  return (
    <div className="fixed top-2 left-2 bottom-[30px] h-full w-1/6 p-2 bg-gradient-to-b from-gray-200 to-gray-100 overflow-hidden rounded-2xl shadow-lg border border-gray-200 flex flex-col">
      <h1 className="text-center font-black text-2xl p-4 text-gray-800 flex-none">
        Trang Quản Trị
      </h1>
      <div className="flex-1 overflow-auto">
        <Menu
          className="w-full !bg-transparent !border-none"
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          items={items}
        />
      </div>
    </div>
  );
};

export default SideBar;
