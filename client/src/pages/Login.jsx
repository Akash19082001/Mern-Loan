// src/Pages/Login.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logo, background } from "../Assets/index";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for error messages

  const navigate = useNavigate();

  const loginUser = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Store the token in localStorage
        localStorage.setItem("token", data.data.token);
        navigate("/dashboard");
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
      }}
    >
      <div className="text-center">
        <img
          className="w-80 h-70 mb-auto sm:mb-20 mx-auto min-w-[150px]"
          src={logo}
          alt="logo"
        />
        <form onSubmit={loginUser} className="mx-auto mt-4 text-left">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mt-4 mb-2 text-gray-600 text-left">
              Login
            </h1>
            <p className="text-gray-500 text-left">
              Need an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-lime-500 cursor-pointer"
              >
                Sign Up
              </span>
            </p>
          </div>
          <div className="text-left mb-4">
            <label className="block mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="text-left mb-4">
            <label className="block mb-1">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          {error && (
            <div className="mb-4 text-red-500">
              {error}
            </div>
          )}
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-lime-500 text-white py-2 px-4 rounded-sm"
            >
              Login
            </button>
            <span className="text-sm text-gray-500 cursor-pointer">
              Forget password?
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
