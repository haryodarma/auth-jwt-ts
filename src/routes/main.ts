import { Router } from "express";
import authRoutes from "./auth/auth";

const mainRoutes = Router();
mainRoutes.use("/auth", authRoutes);

export default mainRoutes;
