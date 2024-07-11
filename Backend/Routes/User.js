const express = require("express");
const router = express.Router();
const { newUser, siginuser, logoutuser } = require("../Controller/User");

router.post("/signup", newUser);

router.post("/sigin", siginuser);

router.get("/logout", logoutuser);

module.exports = router;
