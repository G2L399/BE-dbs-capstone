import { PrismaClient } from "@prisma/client";
import Hapi from "@hapi/hapi";
import jwt from "jsonwebtoken";
import { comparePassword } from "../../helper/helper.ts";
const prisma = new PrismaClient();
export default async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { email, password } = request.payload as any;
  const user = await prisma.user.findUnique({ where: { email } });

  if (email && password) {
    if (user && (await comparePassword(password, user.password))) {
      const token = jwt.sign(
        {
          id: user?.id
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: '7d'
        }
      );
      return h
        .response({ message: 'Login successful', email, token })
        .code(200);
    } else {
      return h.response({ message: 'Invalid email or password' }).code(401);
    }
  } else {
    return h.response({ message: 'Email and password are required' }).code(400);
  }
};
