import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    general: "",
  });

  const [clicked, setClicked] = useState({
    phoneNumber: false,
    password: false,
    confirmPassword: false,
  });

  const navigate = useNavigate();

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;

    // Allow only numeric input
    if (/^\d*$/.test(value)) {
      setFormData((prevData) => ({
        ...prevData,
        phoneNumber: value,
      }));

      // Clear error for phone number when user edits
      setErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: "",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: "Phone number can only contain digits.",
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Generalized handler for all fields except phoneNumber
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (clicked[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;

    // Mark the field as clicked
    setClicked((prevClicked) => ({
      ...prevClicked,
      [name]: true,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits.";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password should be at least 6 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post("http://cmpe-sjsu-lb-1470530135.us-west-1.elb.amazonaws.com:3001/api/users/signup", {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        p_n: formData.phoneNumber,
        password: formData.password,
      });

      const data = response.data;

      // Save token, user ID, and is_admin to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user._id);
      localStorage.setItem('is_admin', data.user.is_admin);

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
      setClicked({
        phoneNumber: false,
        password: false,
        confirmPassword: false,
      });

      // Redirect to home page on successful sign-up
      navigate("/home");
    } catch (err) {
      console.error("Error during signup:", err.message);
      setErrors((prevErrors) => ({
        ...prevErrors,
        general: err.response?.data?.message || "Sign-up failed. Please try again.",
      }));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border border-gray-300 rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="mb-4">
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onInput={handlePhoneNumberChange}
            onBlur={handleBlur}
            required
            className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
        </div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="mb-4 relative">
          <input
            type={isPasswordVisible ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span
            className="absolute inset-y-0 right-3 text-gray-500 flex items-center cursor-pointer"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </span>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>
        <div className="mb-4 relative">
          <input
            type={isConfirmPasswordVisible ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span
            className="absolute inset-y-0 right-3 text-gray-500 flex items-center cursor-pointer"
            onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
          >
            {isConfirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </span>
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Sign Up
        </button>
      </form>
      {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}

      <div className="my-4 flex items-center">
        <hr className="flex-grow border-t border-gray-300" />
        <span className="px-2 text-gray-500">OR</span>
        <hr className="flex-grow border-t border-gray-300" />
      </div>

      <button
        onClick={() => (window.location.href = "http://cmpe-sjsu-lb-1470530135.us-west-1.elb.amazonaws.com:3001/api/users/auth/google")}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Sign Up with Google
      </button>
    </div>
  );
};

export default SignUp;
