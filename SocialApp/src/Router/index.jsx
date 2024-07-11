import { Route, Routes } from "react-router-dom";
import { Login, NewPost, Post, SignUp, UpdatePost } from "../Components";
import { Posts } from "../Components/posts";
import { useState } from "react";

export const Routers = () => {
  const [name, setName] = useState(null);
  const [userId, setUserId] = useState(null);
  console.log(name, "from routes");
  return (
    <Routes>
      <Route path="/" element={<Posts name={name} userId={userId} />} />
      <Route
        path="/login"
        element={<Login setName={setName} setUserId={setUserId} />}
      />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/post" element={<Post />} />
      <Route path="/newpost" element={<NewPost />} />
      <Route path="/updatepost" element={<UpdatePost />} />
    </Routes>
  );
};
