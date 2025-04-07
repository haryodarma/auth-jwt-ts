import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mainRoutes from "./routes/main";
import dotenv from "dotenv";

// Server Setup
const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routes
app.use("/api", mainRoutes);

// Running Server
app.listen(
  Number(process.env.SERVER_PORT) || 3000,
  process.env.SERVER_HOST || "localhost",
  () => {
    console.log(
      `Server running on ${Number(process.env.SERVER_PORT) || 3000}:${
        process.env.SERVER_HOST || "localhost"
      }`
    );
  }
);
