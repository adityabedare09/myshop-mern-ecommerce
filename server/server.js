import { createServer } from "node:http";
import { Server } from "socket.io";
import process from "node:process";

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

import User from "./model/User.js";

dotenv.config();


// ========================================
// EXPRESS APP
// ========================================

const app = express();

const PORT = process.env.PORT || 5000;

const CLIENT_URL =
  process.env.CLIENT_URL || "http://localhost:5173";


// ========================================
// HTTP SERVER
// ========================================

const httpServer = createServer(app);


// ========================================
// SOCKET.IO
// ========================================

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE"
    ]
  }
});


// Make Socket.IO available to routes
app.set("io", io);


// ========================================
// SOCKET.IO CONNECTION
// ========================================

io.on("connection", (socket) => {

  console.log(
    "Client connected:",
    socket.id
  );


  // ======================================
  // ADMIN ROOM
  // ======================================

  socket.on(
    "joinAdmin",
    async (token) => {

      try {

        if (!token) {
          console.log(
            "No token provided for admin socket"
          );

          return;
        }


        // Verify JWT
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET
        );


        // Find user
        const user =
          await User.findById(
            decoded.userId
          );


        if (!user) {
          console.log(
            "Socket user not found"
          );

          return;
        }


        // Only admins can join
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
    }
  );


  // ======================================
  // DISCONNECT
  // ======================================

  socket.on(
    "disconnect",
    () => {

      console.log(
        "Client disconnected:",
        socket.id
      );

    }
  );

});


// ========================================
// MIDDLEWARE
// ========================================

app.use(
  cors({
    origin: CLIENT_URL
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

httpServer.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log(
      `Server running on port ${PORT}`
    );

  }
);