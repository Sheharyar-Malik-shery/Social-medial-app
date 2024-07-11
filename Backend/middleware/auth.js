const jwt = require("jsonwebtoken");

function authorization(req, res, next) {
  let token = req.cookies.token;
  console.log(token, "from auth");
  if (!token) {
    res.status(200).json({
      status: false,
      response: "You are not authorized, There is no Token",
      token: token,
      msg: "why token is not showing",
    });
  }
  let verified = jwt.verify(token, "12shhh");
  if (!verified) {
    res.status(200).json({
      status: false,
      response: "Somethink went wrong in Token verficaton",
    });
  }
  req.user = verified;
  console.log(req.user);

  next();
  //   res.status(200).json({ status: true, response: "User can create post" });
}

module.exports = authorization;
