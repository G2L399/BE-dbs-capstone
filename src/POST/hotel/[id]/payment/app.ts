import Hapi from '@hapi/hapi';
import Joi from 'joi';
import { PrismaClient, type User } from '@prisma/client';
const prisma = new PrismaClient({});
export default async (
  request: Hapi.Request<Hapi.ReqRefDefaults>,
  h: Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
) => {
  try {
    // Get query parameters with default values
    console.log(request.auth.credentials);
    const body = request.payload as unknown as any;
    const user = request.auth.credentials as unknown as User;
    const data = await prisma.payment.create({
      data:{
        userId: user.id,
        amount: body.totalPrice,
        paymentStatus: 'PENDING',
        paymentType: body.paymentType,
        bank: body.bank,
        LodgingTicket:{
          create:{
            userId : user.id,
            lodgingId : body.lodgingId,
            totalPrice: body.totalPrice,
            checkOutDate : body.checkOutDate,
            checkInDate : body.checkInDate,
            guestAmount: body.guestAmount,
            status: 'PENDING',
          }
        }
      }
    })
    return h
      .response({
        data
      })
      .code(200);
  } catch (error) {
    console.error('Error fetching best-deal hotels:', error);
    return h
      .response({
        error: 'Failed to fetch best-deal hotels'
      })
      .code(500);
  }
};

export const options: Hapi.RouteOptions = {
  tags: ['api', 'hotels'],
  description: 'Get top-rated hotels based on user reviews',
  notes: 'Returns an array of hotels sorted by rating',
  validate: {
    params: Joi.object({
      id: Joi.number().required()
    })
  },
  auth: 'jwt'
};
