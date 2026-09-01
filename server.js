import { createServer } from "node:http";
import { Server } from "socket.io";
import process from "node:process";

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

import jwt from "jsonwebtoken";
import User from "./model/User.js";

dotenv.config();


// ========================================
// EXPRESS APP
// ========================================

const app = express();

const PORT = 5000;


// ========================================
// HTTP SERVER
// ========================================

const httpServer = createServer(app);


// ========================================
// SOCKET.IO
// ========================================

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});


// Make Socket.IO available to routes
app.set("io", io);


// Socket connection
// Socket.IO connection
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Client sends its JWT when connecting
  socket.on("joinAdmin", async (token) => {
    try {
      if (!token) {
        console.log("No token provided");
        return;
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      const user = await User.findById(decoded.userId);

      if (!user) {
        console.log("Socket user not found");
        return;
      }

      // Only admins can join this room
      if (user.role === "admin") {
        socket.join("admins");

        console.log(
          `Admin joined room: ${user.username}`
        );
      } else {
        console.log(
          `User ${user.username} is not an admin`
        );
      }

    } catch (error) {
      console.error(
        "Socket authentication failed:",
        error.message
      );
    }
  });

  socket.on("disconnect", () => {
    console.log(
      "Client disconnected:",
      socket.id
    );
  });
});

// ========================================
// MIDDLEWARE
// ========================================

app.use(
  cors({
    origin: "http://localhost:5173"
  })
);

app.use(express.json());


// ========================================
// ROUTES
// ========================================

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);
app.use("/api/admin", adminRoutes);

// ========================================
// TEST ROUTE
// ========================================

app.get("/", (req, res) => {

  res.send(
    "MyShop Backend is running!"
  );

});


// ========================================
// MONGODB CONNECTION
// ========================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {

    console.log(
      "MongoDB connected successfully"
    );

  })
  .catch((error) => {

    console.error(
      "MongoDB connection failed:",
      error.message
    );

  });


// ========================================
// START SERVER
// ========================================

httpServer.listen(PORT, () => {

  console.log(
    `Server running on http://localhost:${PORT}`
  );

});