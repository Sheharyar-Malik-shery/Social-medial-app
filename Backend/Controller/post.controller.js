const { response } = require("express");
const Post = require("../Model/post.model");

async function createpost(req, res) {
  let { title, content } = req.body;
  let userid = req.user.id;
  console.log(userid);
  let data = await Post.create({ title, content, user: userid });
  //   console.log(data);
  res.status(200).json({ status: true, response: "Done" });
}

async function allpost(req, res) {
  let allposts = await Post.find({}).populate("user", "firstname lastname");
  res.status(200).json({ status: true, response: "All Users Posts", allposts });
}

async function deletepost(req, res) {
  try {
    let postid = req.params.id;
    let userid = req.user.id;
    console.log(userid, "userid", postid, "postid");

    const post = await Post.findById(postid);
    if (!post) {
      return res
        .status(404)
        .json({ status: false, response: "Post not Found" });
    }

    if (post.user.toString() !== userid) {
      // Convert ObjectId to string for comparison
      return res.status(403).json({
        status: false,
        response: "You are not authorized to delete this post",
      });
    }

    await Post.deleteOne({ _id: postid }); // Correct the delete query
    return res
      .status(200)
      .json({ status: true, response: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res
      .status(500)
      .json({ status: false, response: "Internal Server Error" });
  }
}

async function updatepost(req, res) {
  try {
    let postid = req.params.id;
    let userid = req.user.id;
    let { title, content } = req.body;
    console.log(userid, "userid", postid, "postid");

    const post = await Post.findById(postid);
    if (!post) {
      return res
        .status(404)
        .json({ status: false, response: "Post not Found" });
    }

    if (post.user.toString() !== userid) {
      return res.status(403).json({
        status: false,
        response: "You are not authorized to update this post",
      });
    }

    if (title) post.title = title;
    if (content) post.content = content;

    await post.save();

    return res
      .status(200)
      .json({ status: true, response: "Post updated successfully" });
  } catch (error) {
    console.error("Error updating post:", error);
    return res
      .status(500)
      .json({ status: false, response: "Internal Server Error" });
  }
}

// async function likepost(req, res) {
//   console.log(req.body, "from like body req");
//   const { likes, postid } = req.body;
//   console.log(likes, "from frontend");

//   try {
//     // Find the post by postid
//     const post = await Post.findById(postid);
//     if (!post) {
//       return res
//         .status(404)
//         .json({ status: false, response: "Post not found" });
//     }

//     // Add the user ID to the likes array if not already present
//     if (!post.likes.includes(likes)) {
//       post.likes.push(likes);
//       await post.save();
//     }

//     res
//       .status(200)
//       .json({ status: true, response: "Post Liked", likes: post.likes });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: false, response: "Server error" });
//   }
// }
async function likepost(req, res) {
  const { userId, postId } = req.body;

  try {
    let post = await Post.findById(postId);

    if (!post) {
      return res
        .status(404)
        .json({ status: false, response: "Post not found" });
    }

    // Check if user has already liked the post
    if (post.likes.includes(userId)) {
      return res
        .status(400)
        .json({ status: false, response: "User has already liked this post" });
    }

    post.likes.push(userId);
    await post.save();

    res
      .status(200)
      .json({ status: true, response: "Post liked", likes: post.likes });
  } catch (error) {
    res.status(500).json({ status: false, response: "Internal server error" });
  }
}

async function unlikepost(req, res) {
  console.log(req.body, "from unlike body req");
  const { likes, postid } = req.body;
  console.log(likes, "from frontend");

  try {
    // Find the post by postid and remove the user ID from the likes array
    const post = await Post.findByIdAndUpdate(
      postid,
      { $pull: { likes: likes } },
      { new: true }
    );

    if (!post) {
      return res
        .status(404)
        .json({ status: false, response: "Post not found" });
    }

    res
      .status(200)
      .json({ status: true, response: "Post Unliked", likes: post.likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, response: "Server error" });
  }
}

module.exports = {
  allpost,
  createpost,
  deletepost,
  updatepost,
  likepost,
  unlikepost,
};
