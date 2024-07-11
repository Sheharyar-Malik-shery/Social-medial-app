import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = ({ setName, setUserId }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleInput(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault(); // Prevent the default form submission
    try {
      const response = await fetch("http://localhost:8080/user/sigin", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      // console.log(response);
      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result, {
          withCredentials: true,
          httpOnly: false,
        });

        let token = result.token;
        console.log(token);
        localStorage.setItem("username", JSON.stringify(result.username));
        localStorage.setItem("userid", JSON.stringify(result.userid));
        setName(result.username);
        setUserId(result.userid);
        console.log(result, "from result");
        alert(`${result.response}`);
        setTimeout(() => {
          navigate("/");
        }, 1000);
        // Handle successful login, e.g., redirect, display a message, etc.
      } else {
        const error = await response.json();
        console.error("Error:", error);
        alert(`${error.response}`);

        // Handle login error, e.g., display an error message
      }
    } catch (error) {
      console.error("Error:", error);

      // Handle network or other errors
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        className="flex justify-center items-center flex-col border border-gray-500 rounded-md p-4 w-96"
        onSubmit={handleSubmit}
      >
        <h1 className="text-xl font-bold mb-5">Login</h1>
        <input
          type="text"
          placeholder="Enter Your email"
          name="email"
          className="p-1 m-2 w-full outline-none border border-gray-300 rounded-md shadow-md"
          value={formData.email}
          onChange={handleInput}
        />
        <input
          type="password"
          placeholder="Enter Your password"
          name="password"
          className="p-1 m-2 w-full outline-none border border-gray-300 rounded-md shadow-md"
          value={formData.password}
          onChange={handleInput}
        />
        <input
          type="submit"
          value="Login"
          className="bg-orange-500 my-3 p-2 rounded-md w-24 shadow-md cursor-pointer"
        />
      </form>
    </div>
  );
};
