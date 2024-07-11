import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookie from "js-cookie";

export const Header = ({ name, userId }) => {
  const [token, setToken] = useState(null);
  let username = JSON.parse(localStorage.getItem("username"));

  useEffect(() => {
    let userid = JSON.parse(localStorage.getItem("userid"));
    setToken(userid);
  }, []);
  // console.log(name);
  // Empty dependency array so it only runs once when the component mounts

  const navigate = useNavigate();

  function handleNavigation() {
    navigate("/login");
  }

  function handleNavigationsignup() {
    navigate("/signup");
  }

  function handlelogout() {
    const fetchedToken = Cookie.get("token");
    fetch("http://localhost:8080/user/logout", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.status) {
          console.log(fetchedToken, "from response"); // Remove the token from cookies on logout
          localStorage.removeItem("username");
          localStorage.removeItem("userid");
          navigate("/");
        }
      })
      .catch((error) => console.error("Error during logout:", error));
  }

  function handleNewPost() {
    navigate("./newpost");
  }

  return (
    <div className="bg-orange-800 text-center p-3 rounded-b-3xl">
      <h1>{userId}</h1>
      <h1 className="m-3 text-white text-3xl font-bold">
        Welcome To Social Post App {username}
      </h1>
      {token ? (
        <>
          <button
            onClick={handleNewPost}
            className="w-32 bg-orange-400 rounded-md p-2 px-6 text-lg text-white font-bold mx-3 shadow-md"
          >
            Post
          </button>
          <button
            onClick={handlelogout}
            className="w-32 bg-orange-400 rounded-md p-2 px-6 text-lg text-white font-bold mx-3 shadow-md"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <button
            onClick={handleNavigation}
            className="w-32 bg-blue-400 rounded-md p-2 px-6 text-lg text-white font-bold mx-3 shadow-md"
          >
            Login
          </button>
          <button
            onClick={handleNavigationsignup}
            className="w-32 bg-blue-400 rounded-md p-2 px-6 text-lg text-white font-bold mx-3 shadow-md"
          >
            Signup
          </button>
        </>
      )}
    </div>
  );
};
