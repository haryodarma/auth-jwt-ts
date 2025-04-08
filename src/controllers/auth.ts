import { Request, Response } from "express-serve-static-core";
import { ApiResponseMessages } from "../helper/response";
import prismaClient from "../database/prismaClient";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function login(req: Request, res: Response): Promise<any> {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json(ApiResponseMessages.BAD_REQUEST);
  const user = await prismaClient.users.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) return res.status(401).json(ApiResponseMessages.NOT_FOUND);

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch)
    return res.status(401).json(ApiResponseMessages.UNAUTHORIZED);

  const refreshToken = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "1d",
    }
  );

  await prismaClient.users.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken: refreshToken,
    },
  });

  const accessToken = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "1m",
    }
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    signed: true,
  });

  return res.status(200).json({
    ...ApiResponseMessages.OK,
    accessToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
}
export async function register(
  req: Request<{}, {}, { username: string; email: string; password: string }>,
  res: Response
): Promise<any> {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username.length < 5 ||
    username.length > 50 ||
    password.length < 8 ||
    !email.includes("@")
  )
    return res.status(400).json(ApiResponseMessages.BAD_REQUEST);

  const newUser = await prismaClient.users.create({
    data: {
      username,
      email,
      password,
    },
  });

  return res.status(201).json({
    ...ApiResponseMessages.CREATED,
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    },
  });
}

export async function logout(req: Request, res: Response): Promise<any> {
  res.clearCookie("refreshToken");
  return res.status(200).json(ApiResponseMessages.OK);
}

export async function refreshToken(req: Request, res: Response): Promise<any> {
  const refreshToken = req.signedCookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json(ApiResponseMessages.UNAUTHORIZED);
  const user = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string
  );
  const accessToken = jwt.sign(
    user,
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "1m",
    }
  );
  return res.status(200).json({
    ...ApiResponseMessages.OK,
    accessToken,
  });
}
