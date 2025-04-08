import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mainRoutes from "./routes/main";
import dotenv from "dotenv";
import { verifyToken } from "./middlewares/verifyToken";

// Server Setup
const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(verifyToken);

// Routes
app.use("/api", mainRoutes);

// Running Server
app.listen(
  Number(process.env.SERVER_PORT) || 3000,
  process.env.SERVER_HOST || "localhost",
  () => {
    console.log(
      `Server running on ${process.env.SERVER_HOST || "localhost"}:${
        Number(process.env.SERVER_PORT) || 3000
      }`
    );
  }
);
