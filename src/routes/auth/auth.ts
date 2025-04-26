import { Router, Response, Request } from "express";
import {
  login,
  register,
  refreshToken,
  logout,
  authGoogle,
  authGoogleCallback,
} from "../../controllers/auth";
import jwt from "jsonwebtoken";

const authRoutes = Router();

authRoutes.post("/login", login);
authRoutes.post("/register", register);
authRoutes.post("/logout", logout);
authRoutes.get("/refreshToken", refreshToken);
authRoutes.get("/google", authGoogle);
authRoutes.get("/google/callback", authGoogleCallback);

export default authRoutes;
