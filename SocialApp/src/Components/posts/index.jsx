import React from "react";
import { Header } from "../header";
import { Post } from "../post";

export const Posts = ({ name, userId }) => {
  return (
    <div className="bg-orange-400 h-screen  overflow-auto text-center">
      <Header name={name} userId={userId} />
      <div className="px-4 pt-5 sm:w-md m-auto  ">
        <Post />
      </div>
    </div>
  );
};
