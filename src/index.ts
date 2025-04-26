import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mainRoutes from "./routes/main";
import dotenv from "dotenv";
import { google } from "googleapis";

// Server Setup
const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://127.0.0.1:5173", credentials: true }));
app.use(cookieParser());

// Routes
app.use("/api", mainRoutes);

// Running Server
app.listen(
  Number(process.env.SERVER_PORT) || 3000,
  process.env.SERVER_HOST || "127.0.0.1",
  () => {
    console.log(
      `Server running on ${process.env.SERVER_HOST || "127.0.0.1"}:${
        Number(process.env.SERVER_PORT) || 3000
      }`
    );
  }
);
