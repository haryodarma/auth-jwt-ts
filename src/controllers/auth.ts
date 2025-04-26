import { Request, Response } from "express-serve-static-core";
import { ApiResponseMessages } from "../helper/response";
import prismaClient from "../database/prismaClient";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { authorizationUrl, oauth2Client } from "../services/oauth";
import { google } from "googleapis";

export async function login(req: Request, res: Response): Promise<any> {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json(ApiResponseMessages.BAD_REQUEST);

  console.log(email, password);
  const user = await prismaClient.users.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) return res.status(404).json(ApiResponseMessages.NOT_FOUND);

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

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  });

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

  return res.status(200).json({
    ...ApiResponseMessages.OK,
    accessToken,
    refreshToken,
  });
}
export async function register(
  req: Request<{}, {}, { username: string; email: string; password: string }>,
  res: Response
): Promise<any> {
  console.log("Register Request");
  const { username, email, password } = req.body;

  const existing = await prismaClient.users.findUnique({
    where: {
      email: email,
    },
  });
  if (existing)
    return res.status(400).json({
      ...ApiResponseMessages.BAD_REQUEST,
      message: "Email is already exist",
    });

  if (
    !username ||
    !email ||
    !password ||
    email == "" ||
    username.length < 5 ||
    username.length > 50 ||
    password.length < 8 ||
    !email.includes("@")
  )
    return res.status(400).json(ApiResponseMessages.BAD_REQUEST);

  const encryptedPassword = await bcrypt.hash(password, 10);
  const newUser = await prismaClient.users.create({
    data: {
      username,
      email,
      password: encryptedPassword,
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
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return res.status(401).json(ApiResponseMessages.UNAUTHORIZED);

  try {
    const verify = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as { id: string; username: string; email: string };

    const accessToken = jwt.sign(
      { id: verify.id, username: verify.username, email: verify.email },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: "1m",
      }
    );

    return res.status(200).json({
      ...ApiResponseMessages.OK,
      accessToken,
    });
  } catch {
    return res.status(401).json(ApiResponseMessages.UNAUTHORIZED);
  }
}

export async function authGoogle(req: Request, res: Response) {
  res.redirect(authorizationUrl);
}

export async function authGoogleCallback(
  req: Request,
  res: Response
): Promise<any> {
  const code = req.query.code as string;

  if (!code) {
    return res.status(400).json(ApiResponseMessages.BAD_REQUEST);
  }

  const { tokens } = await oauth2Client.getToken(code);

  oauth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });

  const { data } = await oauth2.userinfo.get();

  if (!data) return res.status(400).json(ApiResponseMessages.BAD_REQUEST);

  const user = await prismaClient.users.findUnique({
    where: {
      email: data.email || "",
    },
  });

  if (!user) {
    const newUser = await prismaClient.users.create({
      data: {
        id: data.id || "",
        username: data.name || "",
        email: data.email || "",
        password: "",
      },
    });

    const accessToken = jwt.sign(
      {
        id: data!.id,
        username: data!.name,
        email: data!.email,
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: "1m",
      }
    );

    const refreshToken = jwt.sign(
      {
        id: data!.id,
        username: data!.name,
        email: data!.email,
      },
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      ...ApiResponseMessages.CREATED,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
      accessToken,
      refreshToken,
    });
  }

  const accessToken = jwt.sign(
    {
      id: user!.id,
      username: user!.username,
      email: user!.email,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: "1m",
    }
  );

  const refreshToken = jwt.sign(
    {
      id: user!.id,
      username: user!.username,
      email: user!.email,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: "1d",
    }
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.redirect("http://127.0.0.1:5173?accessToken=" + accessToken);
}
