
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token or error in the URL query parameters after Google redirect
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");

    if (token) {
      
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // navigate("/home"); // Redirect to the home page
    } else if (error) {
      console.error("Google login error:", error);
      setErrors((prev) => ({
        ...prev,
        general: "Google login failed. Please try again.",
      }));
    }
  }, [navigate]);


  const validate = () => {
    const validationErrors = {};
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      validationErrors.email = "Email is required.";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      validationErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!password) {
      validationErrors.password = "Password is required.";
      isValid = false;
    } else if (password.length < 6) {
      validationErrors.password = "Password should be at least 6 characters.";
      isValid = false;
    }

    setErrors(validationErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const response = await axios.post(
        "http://cmpe-sjsu-lb-1470530135.us-west-1.elb.amazonaws.com:3001/api/users/login",
        {
          email,
          password,
        }
      );

      const data = response.data;
      console.log("Login successful:", data);
      console.log("API Response:", response.data);
      console.log("Token being saved:", data.token);


      setEmail("");
      setPassword("");
      setErrors({});

      // if (data.token) {
      //   localStorage.setItem("token", data.token);
      if (data.token && data.user && data.user._id) {
      // Save token and user ID to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user._id);
      localStorage.setItem('is_admin', data.user.is_admin)
        

        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        navigate("/home");
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      
      setErrors((prev) => ({
        ...prev,
        general: error.response?.data?.message || "Login failed",
      }));
    }
  };

  const handleGoogleLogin = () => {
    const googleAuthUrl = "http://cmpe-sjsu-lb-1470530135.us-west-1.elb.amazonaws.com:3001/api/users/auth/google";
    window.location.href = googleAuthUrl; // Redirect to the Google auth URL in the same tab
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full p-2 mb-2 border ${
            errors.email ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-4">{errors.email}</p>
        )}

        {/* <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full p-2 mb-2 border ${
            errors.password ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-4">{errors.password}</p>
        )} */}
<div className="relative">
      <input
        type={isPasswordVisible ? "text" : "password"} // Toggle type between "text" and "password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={`w-full p-2 mb-2 border ${
          errors.password ? "border-red-500" : "border-gray-300"
        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
      {errors.password && (
        <p className="text-red-500 text-sm mb-4">{errors.password}</p>
      )}
      <button
        type="button"
        onClick={() => setIsPasswordVisible(!isPasswordVisible)} // Toggle visibility state
        className="absolute right-2 top-2 text-gray-500"
      >
        {isPasswordVisible ? (
           <FaEyeSlash className="h-5 w-5" />
        ) : (
          <FaEye className="h-5 w-5" />
        )}
      </button>
    </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Login
        </button>
      </form>

      {errors.general && (
        <p className="text-red-500 text-center mt-4">{errors.general}</p>
      )}

      <div className="my-4 flex items-center">
        <hr className="flex-grow border-t border-gray-300" />
        <span className="px-2 text-gray-500">OR</span>
        <hr className="flex-grow border-t border-gray-300" />
      </div>

      <button
        onClick={handleGoogleLogin}
        className="w-full py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
      >
        Continue with Google
      </button>
    </div>
  );
};

export default Login;

