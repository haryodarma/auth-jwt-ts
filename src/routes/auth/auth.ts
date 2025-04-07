import { Router, Response, Request } from "express";
import { login, register, refreshToken, logout } from "../../controllers/auth";

const authRoutes = Router();

authRoutes.post("/login", login);
authRoutes.post("/register", register);
authRoutes.post("/logout", logout);
authRoutes.post("/refreshToken", refreshToken);
authRoutes.get("/", (req: Request, res: Response): any => {
  return res.send("Auth Routes Is Succes");
});

export default authRoutes;
