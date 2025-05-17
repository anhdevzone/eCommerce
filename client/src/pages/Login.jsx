import React, { useState } from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { FaFacebookF, FaGoogle, FaTwitter, FaPaperPlane } from "react-icons/fa";
import { Link } from "react-router-dom";
const Login = () => {
  const [state, setState] = useState("Logi");
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  return (
    <div className="max-w-[1200px] mx-auto p-6 mb-30 mt-15">
      <div className="flex items-center justify-center">
        <div className="bg-white shadow h-auto min-w-[800px] flex flex-col items-center justify-center p-8 rounded-xl">
          <Form
            labelCol={{ span: 24 }}
            name="login"
            className="w-[700px]"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <div className="flex flex-col items-center justify-center mb-6 gap-2">
              {state === "Login" ? (
                <>
                  <h1 className="text-center text-4xl font-bold text-primary">
                    Đăng nhập
                  </h1>
                  <p className="text-gray-500">Chào mừng bạn trở lại</p>
                </>
              ) : (
                <>
                  <h1 className="text-center text-4xl font-bold text-primary">
                    Đăng ký
                  </h1>
                  <p className="text-gray-500">Tạo tài khoản miễn phí</p>
                </>
              )}
            </div>

            <div className={`grid grid-cols-2 gap-x-4 gap-y-1`}>
              {state !== "Login" && (
                <>
                  <div>
                    <Form.Item
                      label="Họ"
                      name="firstName"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập họ của bạn!",
                        },
                      ]}
                    >
                      <Input placeholder="Họ" />
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                      label="Tên"
                      name="lastName"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên của bạn!",
                        },
                      ]}
                    >
                      <Input placeholder="Tên" />
                    </Form.Item>
                  </div>
                </>
              )}
              <div className={`${state === "Login" && "col-span-2"}`}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email của bạn!" },
                  ]}
                >
                  <Input placeholder="Email" />
                </Form.Item>
              </div>
              {state !== "Login" && (
                <div>
                  <Form.Item
                    label="Số điện thoại"
                    name="Phone"
                    rules={[
                      { required: true, message: "Vui lòng nhập số điện !" },
                    ]}
                  >
                    <Input placeholder="Số điện thoại" />
                  </Form.Item>
                </div>
              )}
              <div className="col-span-2">
                <Form.Item
                  label="Mật khẩu"
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                  ]}
                >
                  <Input.Password placeholder="Mật khẩu" />
                </Form.Item>
              </div>
              <div
                className={`${
                  state === "Login" ? "" : "col-span-2 row-start-4"
                }`}
              >
                <Form.Item
                  name="remember"
                  className="!my-2"
                  valuePropName="checked"
                >
                  <Checkbox>
                    {state === "Login"
                      ? "Ghi nhớ tài khoản"
                      : "Tôi đồng ý với các điều khoản dịch vụ"}
                  </Checkbox>
                </Form.Item>
              </div>

              {state === "Login" && (
                <div className="flex items-center justify-end">
                  <Link to={"/"}>Quên mật khẩu</Link>
                </div>
              )}
              <div className="col-span-2 row-start-5">
                <Form.Item>
                  <Button
                    className="w-full !h-[40px] !rounded-xl !bg-primary !text-white !text-lg !my-4"
                    type="primary"
                    htmlType="submit"
                  >
                    <FaPaperPlane />
                    {state === "Login" ? "Đăng nhập" : "Đăng ký"}
                  </Button>
                </Form.Item>
              </div>
              <div className="col-span-2 row-start-6  flex items-center justify-center text-base">
                {state === "Login" ? (
                  <>
                    Bạn chưa có tài khoản?
                    <span className="text-primary cursor-pointer" onClick={() => setState("Register")}>
                      {" "}
                      Đăng ký
                    </span>
                  </>
                ) : (
                  <>
                    Bạn đã có tài khoản?
                    <span className="text-primary cursor-pointer" onClick={() => setState("Login")}>
                      {" "}
                      Đăng nhập
                    </span>
                  </>
                )}
              </div>
              <div className="col-span-2 row-start-7  flex items-center justify-center my-4">
                <div class="flex items-center justify-center w-full max-w-xs mx-4">
                  <hr class="flex-grow border-t border-gray-300" />
                  <span class="mx-3 text-gray-500 text-base font-sans select-none">
                    or
                  </span>
                  <hr class="flex-grow border-t border-gray-300" />
                </div>
              </div>
              <div className="col-span-2 row-start-8">
                {" "}
                <div class="text-center">
                  <p class="text-sm text-[#5B6B82] mb-4">
                    Continue with social media
                  </p>
                  <div class="flex space-x-4 justify-center">
                    <button class="flex items-center cursor-pointer hover:text-white hover:bg-[#3b5998] transition-all duration-300 ease-linear space-x-2 border border-[#3B5998] text-[#3B5998] rounded-full px-5 py-1.5 text-sm font-normal">
                      <FaFacebookF />
                      <span>Facebook</span>
                    </button>
                    <button class="flex items-center cursor-pointer hover:text-white hover:bg-[#D9482B] transition-all duration-300 ease-linear space-x-2 border border-[#D9482B] text-[#D9482B] rounded-full px-5 py-1.5 text-sm font-normal">
                      <FaGoogle />
                      <span>Google</span>
                    </button>
                    <button class="flex items-center cursor-pointer hover:text-white hover:bg-[#5EB7FF] transition-all duration-300 ease-linear space-x-2 border border-[#5EB7FF] text-[#5EB7FF] rounded-full px-5 py-1.5 text-sm font-normal">
                      <FaTwitter />
                      <span>Twitter</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
