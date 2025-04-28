import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Checkbox, Form, Input, Flex, Typography } from "antd";
import axios from "axios";
import { toast } from "react-toastify";

const { Title } = Typography;

const Login = () => {
  const { setIsShowNavbarFooter, backendUrl, setToken, setUser } =
    useContext(AppContext);
  const navigate = useNavigate();
  const [state, setState] = useState("Login"); // Login, SignUp, VerifyOtp, ForgotPassword, ResetPassword
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [percent, setPercent] = useState(-50);
  const [form] = Form.useForm();
  const timerRef = useRef(null);

  const onChange = (text) => console.log("onChange:", text);
  const onInput = (value) => console.log("onInput:", value);
  const sharedProps = { onChange, onInput };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (state === "Login") {
        const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
          email: values.email,
          password: values.password,
        });
        if (data.success) {
          setToken(data.token);
          localStorage.setItem("token", data.token);
          localStorage.setItem("email", values.email);
          localStorage.setItem("user", JSON.stringify(data.user)); // Lưu user vào localStorage
          setUser(data.user); // Cập nhật user trong AppContext
          toast.success(data.message);
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else if (state === "SignUp") {
        const { data } = await axios.post(`${backendUrl}/api/auth/register`, {
          name: values.name,
          email: values.email,
          password: values.password,
        });
        if (data.success) {
          toast.success(data.message);
          setState("VerifyOtp");
        } else {
          toast.error(data.message);
        }
      } else if (state === "VerifyOtp") {
        const { data } = await axios.post(`${backendUrl}/api/auth/verify-otp`, {
          email: email,
          otp: values.otp,
        });
        if (data.success) {
          toast.success(data.message);
          setState("Login");
        } else {
          toast.error(data.message);
        }
      } else if (state === "ForgotPassword") {
        const { data } = await axios.post(
          `${backendUrl}/api/auth/forgot-password`,
          {
            email: values.email,
          }
        );
        if (data.success) {
          toast.success(data.message);
          setState("ResetPassword");
        } else {
          toast.error(data.message);
        }
      } else if (state === "ResetPassword") {
        const { data } = await axios.post(
          `${backendUrl}/api/auth/reset-password`,
          {
            email: email,
            otp: values.otp,
            newPassword: values.newPassword,
          }
        );
        if (data.success) {
          toast.success(data.message);
          setState("Login");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (loading) {
      timerRef.current = setTimeout(() => {
        setPercent((v) => {
          const nextPercent = v + 5;
          return nextPercent > 150 ? -50 : nextPercent;
        });
      }, 100);
    } else {
      setPercent(-50);
    }
    return () => clearTimeout(timerRef.current);
  }, [loading]);

  useEffect(() => {
    setIsShowNavbarFooter(false);
    return () => setIsShowNavbarFooter(true);
  }, [setIsShowNavbarFooter]);

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center">
      <div className="w-xl p-6 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center justify-center gap-6">
          {/* Header Title */}
          <div>
            <div className="flex flex-col items-center justify-center gap-2 mb-6">
              <h1 className="text-2xl text-neutral-600 font-medium">
                {state === "Login"
                  ? "Đăng nhập"
                  : state === "SignUp"
                  ? "Đăng ký"
                  : state === "VerifyOtp"
                  ? "Xác minh OTP"
                  : state === "ForgotPassword"
                  ? "Quên mật khẩu"
                  : "Đặt lại mật khẩu"}
              </h1>
              <p className="text-base text-gray-500">
                {state === "Login"
                  ? "Chào mừng bạn quay trở lại"
                  : state === "SignUp"
                  ? "Hãy đăng ký tài khoản để tiếp tục"
                  : state === "VerifyOtp"
                  ? "Nhập mã OTP được gửi tới email"
                  : state === "ForgotPassword"
                  ? "Nhập email để lấy lại mật khẩu"
                  : "Nhập OTP và mật khẩu mới"}
              </p>
              <span className="block border-b-2 border-gray-500 w-full"></span>
            </div>
          </div>

          {/* Form */}
          <div>
            <Form
              name="auth"
              style={{ minWidth: 400 }}
              form={form}
              onFinish={onFinish}
            >
              {/* Name khi đăng ký */}
              {state === "SignUp" && (
                <Form.Item
                  name="name"
                  rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                >
                  <Input
                    placeholder="Tên của bạn"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                </Form.Item>
              )}

              {/* Email input */}
              {(state !== "VerifyOtp" && state !== "ResetPassword") ||
              state === "ForgotPassword" ? (
                <Form.Item
                  name="email"
                  rules={[{ required: true, message: "Vui lòng nhập email!" }]}
                >
                  <Input
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </Form.Item>
              ) : null}

              {/* Password input */}
              {(state === "Login" || state === "SignUp") && (
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                  ]}
                >
                  <Input.Password
                    placeholder="Mật khẩu"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                </Form.Item>
              )}

              <div className="flex flex-col gap-4 items-center justify-center">
                {/* OTP input */}
                {(state === "VerifyOtp" || state === "ResetPassword") && (
                  <Form.Item
                    name="otp"
                    rules={[
                      { required: true, message: "Vui lòng nhập mã OTP!" },
                    ]}
                  >
                    <Input.OTP
                      formatter={(str) => str.toUpperCase()}
                      {...sharedProps}
                    />
                  </Form.Item>
                )}

                {/* New Password input (Reset) */}
                {state === "ResetPassword" && (
                  <Form.Item
                    className="w-full"
                    name="newPassword"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập mật khẩu mới!",
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="Mật khẩu mới"
                      onChange={(e) => setNewPassword(e.target.value)}
                      value={newPassword}
                    />
                  </Form.Item>
                )}
              </div>

              {/* Remember me */}
              {state === "Login" && (
                <Form.Item>
                  <Flex justify="space-between" align="center">
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                      <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                    </Form.Item>
                    <Link onClick={() => setState("ForgotPassword")}>
                      Quên mật khẩu?
                    </Link>
                  </Flex>
                </Form.Item>
              )}

              {/* Submit Button */}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full group/button relative inline-flex items-center justify-center overflow-hidden rounded-md bg-gray-800/30 backdrop-blur-lg px-6 !py-6 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-gray-600/50 border border-white/20"
                  loading={loading}
                >
                  <span className="text-lg">
                    {state === "Login"
                      ? "Đăng nhập"
                      : state === "SignUp"
                      ? "Đăng ký"
                      : state === "VerifyOtp"
                      ? "Xác minh OTP"
                      : state === "ForgotPassword"
                      ? "Gửi OTP"
                      : "Đặt lại mật khẩu"}
                  </span>
                  <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
                    <div className="relative h-full w-10 bg-white/20"></div>
                  </div>
                </Button>
              </Form.Item>
            </Form>

            {/* Điều hướng các chế độ */}
            <div className="flex items-center justify-between gap-2 text-gray-500 py-4">
              {state === "Login" ? (
                <p>
                  Bạn chưa có tài khoản?{" "}
                  <Link
                    className="text-blue-500"
                    onClick={() => setState("SignUp")}
                  >
                    Đăng ký
                  </Link>
                </p>
              ) : state === "SignUp" ||
                state === "ForgotPassword" ||
                state === "ResetPassword" ? (
                <p>
                  Đã có tài khoản?{" "}
                  <Link
                    className="text-blue-500"
                    onClick={() => setState("Login")}
                  >
                    Đăng nhập
                  </Link>
                </p>
              ) : null}
              <Button
                color="default"
                variant="outlined"
                onClick={() => navigate("/")}
              >
                Quay về trang chủ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
