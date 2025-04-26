import Router from "express";
import { deleteUser, getUser, getUsers } from "../../controllers/users";
import { verifyToken } from "../../middlewares/verifyToken";

const userRouter = Router();

userRouter.get("/", verifyToken, getUsers);
userRouter.get("/:id", verifyToken, getUser);
userRouter.delete("/:id", deleteUser);

export default userRouter;
