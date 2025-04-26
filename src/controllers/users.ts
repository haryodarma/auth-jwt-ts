import { Request, Response } from "express";
import prismaClient from "../database/prismaClient";
import { ApiResponseMessages } from "../helper/response";

export async function getUsers(req: Request, res: Response): Promise<any> {
  console.log(":bener");
  const users = await prismaClient.users.findMany({
    select: { id: true, username: true, email: true },
  });
  console.log(users);
  return res.status(200).json({ ...ApiResponseMessages.OK, data: users });
}

export async function getUser(req: Request, res: Response): Promise<any> {
  const param = req.params.id;
  const user = await prismaClient.users.findUnique({
    where: {
      id: param,
    },
  });
  if (!user) return res.status(404).json(ApiResponseMessages.NOT_FOUND);
  return res.status(200).json({ ...ApiResponseMessages.OK, data: user });
}

export async function deleteUser(req: Request, res: Response): Promise<any> {
  const id = req.params.id;
  await prismaClient.users.delete({
    where: {
      id: id,
    },
  });
  return res.status(200).json(ApiResponseMessages.OK);
}
