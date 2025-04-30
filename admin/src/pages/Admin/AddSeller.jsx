import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import axios from "axios";
import { backendUrl } from "../../App";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddSeller = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        `${backendUrl}/api/auth/create-seller`,
        values,
        config
      );

      if (data.success) {
        toast.success("Tạo tài khoản Seller thành công!");
        navigate("/admin/dashboard"); // Adjust the path as needed
      } else {
        message.error(data.message || "Đã có lỗi xảy ra!");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi tạo tài khoản.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white/30 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-4 mt-20">
      <h1 className="text-2xl font-bold text-gray-600 border-b border-b-gray-400 mb-8">
        Thêm tài khoản Seller
      </h1>
      <Form
        name="basic"
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 50 }}
        labelAlign="top"
      >
        <Form.Item
          label="Tên cửa hàng"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên cửa hàng!" }]}
        >
          <Input placeholder="Nhập tên cửa hàng" />
        </Form.Item>
        <div className="flex items-center justify-center gap-6">
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input placeholder="Nhập Số điện thoại" />
          </Form.Item>
          <Form.Item
            label="Email cửa hàng"
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input placeholder="Nhập email cửa hàng" />
          </Form.Item>
        </div>

        <Form.Item
          label="Địa chỉ cửa hàng"
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <Input placeholder="Nhập địa chỉ cửa hàng" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu cho cửa hàng"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password placeholder="Nhập mật khẩu seller" />
        </Form.Item>

        <Form.Item label={null}>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-black text-white rounded-md py-2 hover:bg-gray-800 transition-all duration-300 mt-8"
            loading={loading}
          >
            Thêm seller
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddSeller;
