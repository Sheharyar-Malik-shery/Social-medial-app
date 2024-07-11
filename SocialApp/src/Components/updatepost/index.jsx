import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const UpdatePost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { post } = location.state || {};
  const [formData, setFormData] = useState({
    title: post?.title || "",
    content: post?.content || "",
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
      const response = await fetch(
        `http://localhost:8080/post/updatepost/${post._id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      // console.log(response);
      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result, {
          withCredentials: true,
          httpOnly: false,
        });

        let token = result.token;
        console.log(token);

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
        <h1 className="text-xl font-bold mb-5">Create New Post</h1>
        <input
          type="text"
          placeholder="Enter Your title"
          name="title"
          className="p-1 m-2 w-full outline-none border border-gray-300 rounded-md shadow-md"
          value={formData.title}
          onChange={handleInput}
        />
        <textarea
          placeholder="Enter Your content"
          name="content"
          className="p-1 m-2 w-full h-32 outline-none border border-gray-300 rounded-md shadow-md"
          value={formData.content}
          onChange={handleInput}
        />
        <input
          type="submit"
          value="UpDate"
          className="bg-orange-500 my-3 p-2 rounded-md w-24 shadow-md cursor-pointer"
        />
      </form>
    </div>
  );
};
