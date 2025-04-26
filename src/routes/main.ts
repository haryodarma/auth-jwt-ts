import { Router } from "express";
import authRoutes from "./auth/auth";
import userRouter from "./users/users";

const mainRoutes = Router();
mainRoutes.use("/auth", authRoutes);
mainRoutes.use("/users", userRouter);

export default mainRoutes;
