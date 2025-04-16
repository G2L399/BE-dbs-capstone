import Hapi from '@hapi/hapi';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';
const prisma = new PrismaClient();
export default async (
  request: Hapi.Request<Hapi.ReqRefDefaults>,
  h: Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
) => {  
  try {
    const auth = request.auth.credentials as { id: number,balance: number };
    const payload = request.payload as any
    console.log(auth);
    
    console.log('Received payload:', request.payload);
    const { amount, bank = 'OTHER', vaNumber = null, paymentType = 'virtual_account', guestAmount, travelDestinationId, visitDate } = payload
    if (!auth) {
      return h
        .response({
          message: 'User not authenticated',
          success: false
        })
        .code(401);
    }
    if (auth.balance < amount) {
      return h
        .response({
          message: 'Insufficient balance',
          success: false
        })
        .code(400);
    }
    

    await prisma.user.update({
      where: { id: auth.id! },
      data: { balance: auth.balance - amount }
    });
    console.log(guestAmount);
    
    const payment = await prisma.payment.create({
      data: {
        userId: auth.id!,
        amount,
        bank,
        vaNumber,
        paymentType,
        paymentStatus: 'PENDING',
        TravelTicket: {
          create: {
            userId: auth.id!,
            guestAmount:Number(guestAmount),
            totalPrice: amount,
            travelDestinationId,
            status: 'PENDING',
            visitDate: new Date(visitDate),
          }
        }
      },
    })
    console.log(payment);
    return h.response({
      message: 'Payment and travel ticket created successfully',
      success: true,
      data: payment,
    }).code(201); // Use 201 Created status code
  } catch (error:any) {
    console.error('Error creating payment:', error);
    return h.response({
      message: 'An error occurred while processing your request',
      success: false,
      error: error.message, // Optionally include error details for debugging
    }).code(500); // Use 500 Internal Server Error status code
  }
 
};
export const options: Hapi.RouteOptions = {
  tags: ['api'],
  auth: 'jwt',
  validate:{
    payload: Joi.object({
      "amount": Joi.number().required(),
      "bank": Joi.string().optional(),
      "vaNumber": Joi.string().optional().allow(null),
      "paymentType": Joi.string().optional(),
      "guestAmount": Joi.number().required().min(1).error(new Error('Guest amount must be at least 1')),
      "travelDestinationId": Joi.number().required(),
      "visitDate": Joi.string().required()
    }).unknown(true)
  },
};
