import { PrismaClient } from "@prisma/client";
import Hapi from "@hapi/hapi";
import { hashPassword } from "../../helper/helper";
const prisma = new PrismaClient();
export default async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { email, password, username } = request.payload as any;
  if (!email || !password || !username) {
    return h
      .response({
        error: `${email ? "" : "email"} ${password ? "" : "password"} ${
          username ? "" : "username"
        } fields are required`,
      })
      .code(400);
  }
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return h
      .response({
        error: `User with email ${email} already exists`,
      })
      .code(400);
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      username,
    },
  });

  return h.response(newUser).code(201);
};
