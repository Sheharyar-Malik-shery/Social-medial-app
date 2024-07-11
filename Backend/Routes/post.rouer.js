const express = require("express");
const router = express.Router();
const {
  allpost,
  createpost,
  deletepost,
  updatepost,
  likepost,
  unlikepost,
} = require("../Controller/post.controller");
const authorization = require("../middleware/auth");

router.post("/newpost", authorization, createpost);

router.get("/allpost", allpost);

router.delete("/deletepost/:id", authorization, deletepost);

router.patch("/updatepost/:id", authorization, updatepost);

router.patch("/like", authorization, likepost);

router.patch("/unlikepost", authorization, unlikepost);

module.exports = router;
