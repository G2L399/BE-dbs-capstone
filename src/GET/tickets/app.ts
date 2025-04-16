import Hapi from "@hapi/hapi";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async (
  request: Hapi.Request<Hapi.ReqRefDefaults>,
  h: Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
) => {
  try {
    const user = request.auth.credentials;
    if (!user) {
      return h
        .response({
          message: "User not authenticated",
          success: false
        })
        .code(401);
    }
    const id = user.id as number;
    const tickets = await prisma.user.findFirst({
      where: {
        id
      },
      include: {
        travelTickets: {
          include: {
            travelDestination: true
          }
        }, lodgingTickets: {
          include: {
            lodging: true
          }
        }, transportationTickets: {
          include: {
            transportation: true
          }
        }
      }
    });
    return h.response(tickets!).code(200);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return h.response({ error: "Failed to fetch tickets" }).code(500);
  }
};

export const options: Hapi.RouteOptions = {
  tags: ["api", "tickets"],
  description: "Get user tickets",
  notes: "Returns a list of user tickets",
  auth: "jwt"
};