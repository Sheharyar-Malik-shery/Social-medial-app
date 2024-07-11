import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillLike } from "react-icons/ai";
import { IoSend } from "react-icons/io5";
import { io } from "socket.io-client";

const socket = io("http://localhost:8080");

export const Post = () => {
  const navigate = useNavigate();
  const [postData, setPostData] = useState({ allposts: [] });
  const [reply, setReply] = useState(false);

  let userid = JSON.parse(localStorage.getItem("userid"));
  // console.log(userid, "from userr");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/post/allpost");
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data, "from fetch");
        setPostData(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();

    // Socket.IO event listeners
    socket.on("postLiked", ({ postId, likes }) => {
      const updatedPosts = postData.allposts.map((p) =>
        p._id === postId ? { ...p, likes } : p
      );
      setPostData({ allposts: updatedPosts });
    });

    socket.on("postUnliked", ({ postId, likes }) => {
      const updatedPosts = postData.allposts.map((p) =>
        p._id === postId ? { ...p, likes } : p
      );
      setPostData({ allposts: updatedPosts });
    });

    socket.on("commentAdded", ({ postId, comments }) => {
      const updatedPosts = postData.allposts.map((p) =>
        p._id === postId ? { ...p, comments } : p
      );
      setPostData({ allposts: updatedPosts });
    });
    socket.on("replyAdded", ({ postId, comments }) => {
      const updatedPosts = postData.allposts.map((p) =>
        p._id === postId ? { ...p, comments } : p
      );
      setPostData({ allposts: updatedPosts });
    });

    return () => {
      socket.off("postLiked");
      socket.off("postUnliked");
      socket.off("commentAdded");
      socket.off("replyAdded");
    };
  }, [postData.allposts]);

  async function handledeletepost(postid) {
    console.log(postid, "deleted post id");
    let response = await fetch(
      `http://localhost:8080/post/deletepost/${postid}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (response.ok) {
      let result = await response.json();
      console.log(result);

      alert(result.response);
    }
  }

  async function handleUpdatepost(post) {
    console.log(post);
    navigate("/updatepost", { state: { post } });
  }

  const handleLike = (post) => {
    console.log(post);
    socket.emit("likePost", { userId: userid, postId: post._id });
  };

  const handleUnlike = (post) => {
    console.log(post);

    socket.emit("unlikePost", { userId: userid, postId: post._id });
  };

  const handlecomment = (post, e) => {
    e.preventDefault();

    let usercomment = e.target[0].value;
    let comment = JSON.stringify(usercomment);
    console.log(post._id, userid, comment, "post id");
    socket.emit("usercomment", {
      userId: userid,
      commentText: comment,
      postId: post._id,
    });
  };

  const handlreply = (post, comment, e) => {
    // userId, postId, commentId, replyText
    e.preventDefault();
    let userreply = e.target[0].value;
    console.log(post);
    // console.log(userid, post._id, comment._id, userreply, "from reply");
    socket.emit("addReply", {
      userId: userid,
      postId: post._id,
      commentId: comment._id,
      replyText: userreply,
    });
    e.target[0].value = "";
    setReply(false);
  };

  return (
    <>
      {postData.allposts.length > 0 ? (
        postData.allposts.map((post) => (
          <div
            key={post._id}
            className="w-full sm:w-1/2 m-auto text-left p-3 border border-grey-250 rounded-md shadow-lg overflow-hidden mb-3 text-white "
          >
            <div className="mb-2  shadow-md mb-3 rounded-md w-full p-2 font-bold">
              <h1>
                {post.user.firstname.toUpperCase()}{" "}
                {post.user.lastname.toUpperCase()}
              </h1>
            </div>
            <div className="shadow-md  rounded-md w-full p-2">
              <div className="mb-2 ">
                <h1 className="underline">{post.title.toUpperCase()}</h1>
              </div>
              <div className="mb-2">{post.content}</div>
              {post.user._id === userid && (
                <div className="gap-3 flex">
                  <button
                    onClick={() => handledeletepost(post._id)}
                    className="w-32 bg-orange-800 rounded-md p-2 px-6 text-lg text-white font-bold  shadow-md"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleUpdatepost(post)}
                    className="w-32 bg-orange-800 rounded-md p-2 px-6 text-lg text-white font-bold  shadow-md"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
            <div className="flex gap-3  align-center items-center ">
              <div className="flex gap-3 p-2 rounded-full hover:bg-red-800 ">
                <AiFillLike
                  className={`text-xl cursor-pointer ${
                    post.likes.includes(userid) ? "text-blue-600" : ""
                  }`}
                  onClick={() =>
                    post.likes.includes(userid)
                      ? handleUnlike(post)
                      : handleLike(post)
                  }
                />
              </div>

              <h1>{post.likes.length}</h1>
            </div>
            <div className="px-2">
              <form
                onSubmit={(e) => handlecomment(post, e)}
                className="flex align-center gap-1"
              >
                <input
                  type="text"
                  placeholder="Add comment ..."
                  className="outline-none rounded-md p-1 border-none text-black placeholder-gray-500 focus:shadow-md w-full"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  }}
                />
                {/* <input
                  type="text"
                  placeholder="Add comment ..."
                  className="bg-transparent outline-none border-none text-white focus:bg-white shadow-md rounded-md w-full placeholder-white"
                /> */}
                <button
                  type="submit"
                  className="p-1 px-3 rounded-lg cursor-pointer hover:bg-red-700 flex items-center"
                >
                  <IoSend className="text-white" />
                </button>
              </form>
            </div>
            <div className=" pl-2 py-1 max-h-32 overflow">
              <div className="overflow-y-auto max-h-32">
                {post.comments.length > 0 ? (
                  post.comments.map((comment) => (
                    <div className="border border-white border-opacity-50  m-1  p-1 pb-2 rounded-md">
                      <h6 key={comment._id}>{comment.text}</h6>
                      {/* <h6 key={comment._id}>{comment.replies}</h6> */}
                      {comment.replies.length > 0 && (
                        <div className="ml-4">
                          {comment.replies.map((reply) => (
                            <h6
                              key={reply._id}
                              className="text-gray-100 border-b-2 border-white border-opacity-50  m-1"
                            >
                              {reply.text}
                            </h6>
                          ))}
                        </div>
                      )}
                      <button
                        onClick={() => setReply(!reply)}
                        className="pl-1 text-blue-500 p-1  hover:bg-red-100 rounded-md "
                      >
                        Reply
                      </button>
                      {reply && (
                        <div className="px-2">
                          <form
                            onSubmit={(e) => handlreply(post, comment, e)}
                            className="flex align-center gap-1"
                          >
                            <input
                              type="text"
                              placeholder="Add comment ..."
                              className="outline-none rounded-md p-1 border-none text-black placeholder-gray-500 focus:shadow-md w-full"
                              style={{
                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                              }}
                            />

                            <button
                              type="submit"
                              className="p-1 px-3 rounded-lg cursor-pointer hover:bg-red-700 flex items-center"
                            >
                              <IoSend className="text-white" />
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <h6>No comment yet</h6>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <h1>There is no post yet</h1>
      )}
    </>
  );
};
