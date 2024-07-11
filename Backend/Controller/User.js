const bcrypt = require("bcryptjs");
const User = require("../Model/user"); // Adjust the path to your user model
const jwt = require("jsonwebtoken");

async function newUser(req, res) {
  const { firstname, lastname, email, password } = req.body;
  console.log(firstname, lastname, email, password); // Check if data is being logged

  if (!(firstname && lastname && email && password)) {
    return res
      .status(400)
      .json({ status: false, response: "All fields are required" });
  }

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(401)
        .json({ status: false, response: "Email already exists" });
    }

    // Encrypt the password
    const encryptedPassword = await bcrypt.hash(password, 10);
    console.log(encryptedPassword);

    // Create a new user
    const newUser = new User({
      firstname,
      lastname,
      email,
      password: encryptedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Send a success response
    res
      .status(201)
      .json({ status: true, response: "User registered successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ status: false, response: "Internal Server Error" });
  }
}

async function siginuser(req, res) {
  let { email, password } = req.body;
  console.log(email, password);
  if (!(email && password)) {
    res
      .status(401)
      .json({ status: false, response: "All Fields are required" });
  }

  let finduser = await User.findOne({ email });
  if (!finduser) {
    res.status(401).json({ status: false, response: "Email not exists" });
  }
  // let pass = await finduser.password;
  // console.log(pass);
  const isPasswordValid = await bcrypt.compare(
    password.toString(),
    finduser.password
  );
  if (!isPasswordValid) {
    res
      .status(401)
      .json({ status: false, response: "Invalid email or password" });
  }
  // let passwordmatsh = await bcrypt.compare(password, User.password);

  let token = jwt.sign({ id: finduser._id }, "12shhh");
  res.cookie("token", token, {
    maxAge: 1000 * 60 * 30,
    httpOnly: true,
  });
  res.status(200).json({
    status: true,
    response: "Login Successfully",
    token: token,
    userid: finduser._id,
    username: finduser.firstname,
  });
}

async function logoutuser(req, res) {
  let token = req.cookies.token;
  token = "";
  res.cookie("token", token);
  res.status(200).json({ status: true, response: "User Logout Successfully" });
}

module.exports = { newUser, siginuser, logoutuser };
