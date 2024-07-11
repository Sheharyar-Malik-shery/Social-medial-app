require("dotenv").config();
const express = require("express");
const connectDB = require("./Connection/db");
const cors = require("cors");
const app = express();
var cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const { handleSocketConnection } = require("./Controller/socket.controller");
const userRoutes = require("./Routes/User");
const postrouter = require("./Routes/post.rouer");

var corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
};
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

// Middleware to parse URL-encoded bodies (form data)
app.use(express.urlencoded({ extended: true }));
connectDB();
// Import the user routes

// Use the user routes
app.use("/user", userRoutes);
app.use("/post", postrouter);

// Create HTTP server and Socket.IO server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  },
});

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  handleSocketConnection(socket, io);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log("Failed to connect to DB", err));
