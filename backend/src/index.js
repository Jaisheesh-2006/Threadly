import express from "express";
import { authRouter } from "./routes/auth.route.js";
import { messageRouter } from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";

// app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());
const rawOrigins = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const allowedOrigins = rawOrigins
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(
    `Backend server running at: http://localhost:${process.env.PORT}`,
  );
  // console.log(__dirname+" or "+import.meta.dirname)
  connectDB();
});
