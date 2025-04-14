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
    if (user.balance < body.totalPrice) {
      return h
        .response({
          message: 'Insufficient balance'
        })
        .code(400);
    }
    if (body.guestAmount <= 0) {

      return h
        .response({
          message: 'Invalid guest amount'
        })
        .code(400);
    }
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
    await prisma.user.update({
      where:{
        id: user.id
      },data:{
        balance: user.balance - body.totalPrice
      }
    })
    return h
      .response({
        data,
        success: true,
        message: 'Payment successful'
      })
      .code(200);
  } catch (error) {
    console.error('Error fetching best-deal hotels:', error);
    return h
      .response({
        error: 'Failed to fetch best-deal hotels',
         success: false,
        message: 'Payment failed, try again later'
      })
      .code(500);
  }
};

export const options: Hapi.RouteOptions = {
  tags: ['api', 'hotels'],
  description: 'Get top-rated hotels based on user reviews',
  notes: 'Returns an array of hotels sorted by rating',
  validate: {
    payload: Joi.object({
        "bank": Joi.string().required(),
        "checkInDate": Joi.date().required(),
        "checkOutDate": Joi.date().required(),
        "guestAmount": Joi.number().required(),
        "lodgingId": Joi.number().required(),
        "paymentType": Joi.string().required(),
        "totalPrice": Joi.number().required()
    
    })
  },
  auth: 'jwt'
};
