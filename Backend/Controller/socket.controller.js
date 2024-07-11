const Post = require("../Model/post.model");
const { ObjectId } = require("mongodb");

async function handleSocketConnection(socket, io) {
  socket.on("likePost", async ({ userId, postId }) => {
    try {
      let post = await Post.findById(postId);

      if (!post) {
        socket.emit("likePostResponse", {
          status: false,
          response: "Post not found",
        });
        return;
      }

      const userObjectId = new ObjectId(userId); // Correctly instantiate ObjectId

      if (post.likes.includes(userObjectId)) {
        socket.emit("likePostResponse", {
          status: false,
          response: "User has already liked this post",
        });
        return;
      }

      post.likes.push(userObjectId);
      await post.save();

      io.emit("postLiked", { postId, likes: post.likes });
    } catch (error) {
      console.error("Error liking post:", error);
      socket.emit("likePostResponse", {
        status: false,
        response: "Internal server error",
      });
    }
  });

  socket.on("unlikePost", async ({ userId, postId }) => {
    console.log(userId, postId, "from unlike");

    try {
      let post = await Post.findById(postId);
      let likeid = post.likes;
      console.log(likeid, "from unlike");

      if (!post) {
        socket.emit("unlikePostResponse", {
          status: false,
          response: "Post not found",
        });
        return;
      }

      const userObjectId = new ObjectId(userId); // Convert userId to ObjectId
      post.likes = post.likes.filter((id) => !id.equals(userObjectId));
      await post.save();

      console.log("Post after unlike:", post); // Add logging to verify the post object

      io.emit("postUnliked", { postId, likes: post.likes });
    } catch (error) {
      console.error("Error unliking post:", error);
      socket.emit("unlikePostResponse", {
        status: false,
        response: "Internal server error",
      });
    }
  });

  socket.on("usercomment", async ({ userId, postId, commentText }) => {
    // console.log(userId, postId, commentText, "From omment");

    try {
      console.log(userId, postId, commentText, "From omment");
      let post = await Post.findById(postId);

      if (!post) {
        socket.emit("addCommentResponse", {
          status: false,
          response: "Post not found",
        });
        return;
      }

      const userObjectId = new ObjectId(userId);

      post.comments.push({
        text: commentText,
        user: userObjectId,
      });
      await post.save();

      io.emit("commentAdded", { postId, comments: post.comments });
    } catch (error) {
      console.error("Error adding comment:", error);
      socket.emit("addCommentResponse", {
        status: false,
        response: "Internal server error",
      });
    }
  });

  socket.on("addReply", async ({ userId, postId, commentId, replyText }) => {
    console.log(userId, postId, commentId, replyText);
    try {
      let post = await Post.findById(postId);

      if (!post) {
        socket.emit("addReplyResponse", {
          status: false,
          response: "Post not found",
        });
        return;
      }

      const userObjectId = new ObjectId(userId);

      const comment = post.comments.id(commentId);
      if (!comment) {
        socket.emit("addReplyResponse", {
          status: false,
          response: "Comment not found",
        });
        return;
      }

      comment.replies.push({
        text: replyText,
        user: userObjectId,
      });
      await post.save();

      io.emit("replyAdded", { postId, comments: post.comments });
    } catch (error) {
      console.error("Error adding reply:", error);
      socket.emit("addReplyResponse", {
        status: false,
        response: "Internal server error",
      });
    }
  });
}

module.exports = {
  handleSocketConnection,
};
