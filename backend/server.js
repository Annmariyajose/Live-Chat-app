const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Create socket server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Import routes
const messageRoutes = require("./routes/messages");
app.use("/api/messages", messageRoutes);

// ✅ SOCKET LOGIC (MUST BE AFTER io IS CREATED)
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join room
  socket.on("join_room", (channelId) => {
    socket.join(channelId);
    console.log("User joined room:", channelId);
  });

  // Send message
  socket.on("send_message", async (data) => {
    try {
      const Message = require("./models/message");

      const newMessage = await Message.create({
        senderId: data.senderId,
        content: data.content,
        timestamp: data.timestamp,
        channelId: data.channelId,
      });

      io.to(data.channelId).emit("receive_message", {
        ...newMessage._doc,
        channelId: data.channelId,
      });

      console.log("Message sent to room:", data.channelId);

    } catch (error) {
      console.log("Error sending message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
