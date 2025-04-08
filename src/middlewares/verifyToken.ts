import { NextFunction, Request, Response } from "express";
import { ApiResponseMessages } from "../helper/response";
import jwt from "jsonwebtoken";

export function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
): any {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(400).json(ApiResponseMessages.BAD_REQUEST);
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
  if (!decodedToken)
    return res.status(401).json(ApiResponseMessages.UNAUTHORIZED);
  req.body.user = decodedToken;
  next();
}
