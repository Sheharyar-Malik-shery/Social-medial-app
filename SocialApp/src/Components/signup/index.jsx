import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
  let navigate = useNavigate();
  const [formInputData, setFormInputData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  async function handleSubmit(e) {
    e.preventDefault(); // Fixed typo here
    console.log(formInputData);
    try {
      const response = await fetch("http://localhost:8080/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formInputData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);
        alert(result.response);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
        // Handle successful login, e.g., redirect, display a message, etc.
      } else {
        const error = await response.json();
        console.error("Error:", error);
        alert(result.response);
        // Handle login error, e.g., display an error message
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle network or other errors
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormInputData({
      ...formInputData,
      [name]: value,
    });
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        className="w-full max-w-md space-y-4 p-4 border rounded shadow-md"
        onSubmit={handleSubmit}
      >
        <h1 className="text-center font-bold">Create Your Account</h1>
        <input
          type="text"
          placeholder="Enter Your FirstName"
          required
          className="w-full p-2 border rounded"
          value={formInputData.firstname}
          onChange={handleChange}
          name="firstname"
        />
        <input
          type="text"
          placeholder="Enter Your LastName"
          required
          className="w-full p-2 border rounded"
          value={formInputData.lastname}
          onChange={handleChange}
          name="lastname"
        />
        <input
          type="email"
          placeholder="Enter Your Email"
          required
          className="w-full p-2 border rounded"
          value={formInputData.email}
          onChange={handleChange}
          name="email"
        />
        <input
          type="password"
          placeholder="Enter Your Password"
          required
          className="w-full p-2 border rounded"
          value={formInputData.password}
          onChange={handleChange}
          name="password"
        />
        <div className="flex justify-center">
          <input
            type="submit"
            value="Create Account"
            className="w-md p-2 bg-orange-500 text-white rounded cursor-pointer hover:bg-orange-600"
          />
        </div>
      </form>
    </div>
  );
};
