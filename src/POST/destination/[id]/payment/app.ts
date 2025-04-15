import Hapi from '@hapi/hapi';
import Joi from 'joi';
import { PrismaClient, type User } from '@prisma/client';

const prisma = new PrismaClient({});

/**
 * Handler for destination payment
 * Processes payment for a travel destination and creates a ticket
 */
export default async (
  request: Hapi.Request<Hapi.ReqRefDefaults>,
  h: Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
) => {
  try {
    // Get request payload and authenticated user
    const body = request.payload as any;
    const user = request.auth.credentials as User;
    
    // Check if user has sufficient balance
    if (user.balance < body.totalPrice) {
      return h
        .response({
          message: 'Insufficient balance',
          success: false
        })
        .code(400);
    }
    
    // Validate guest amount
    if (body.guestAmount <= 0) {
      return h
        .response({
          message: 'Invalid guest amount',
          success: false
        })
        .code(400);
    }
    
    // Check if destination exists
    const destination = await prisma.travelDestination.findUnique({
      where: { id: body.destinationId }
    });
    
    if (!destination) {
      return h
        .response({
          message: 'Destination not found',
          success: false
        })
        .code(404);
    }
    
    // Create payment record and travel ticket
    const data = await prisma.payment.create({
      data: {
        userId: user.id,
        amount: body.totalPrice,
        paymentStatus: 'PAID', // Assumed immediate payment
        paymentType: body.paymentType,
        bank: body.bank,
        TravelTicket: {
          create: {
            userId: user.id,
            travelDestinationId: body.destinationId,
            totalPrice: body.totalPrice,
            visitDate: body.visitDate,
            guestAmount: body.guestAmount,
            status: 'CONFIRMED', // Auto-confirm after payment
          }
        }
      },
      include: {
        TravelTicket: true
      }
    });
    
    // Deduct payment from user balance
    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        balance: user.balance - body.totalPrice
      }
    });
    
    return h
      .response({
        data,
        success: true,
        message: 'Payment successful and ticket created'
      })
      .code(200);
      
  } catch (error) {
    console.error('Error processing destination payment:', error);
    return h
      .response({
        error: 'Failed to process payment',
        success: false,
        message: 'Payment failed, please try again later'
      })
      .code(500);
  }
};

/**
 * Route options including validation schema and authentication
 */
export const options: Hapi.RouteOptions = {
  tags: ['api', 'destinations', 'payments'],
  description: 'Process payment for a travel destination',
  notes: 'Creates a payment record and a travel ticket for the specified destination',
  validate: {
    payload: Joi.object({
      bank: Joi.string().required().description('Bank for payment processing'),
      visitDate: Joi.date().optional().description('Planned visit date'),
      guestAmount: Joi.number().integer().min(1).required().description('Number of guests'),
      destinationId: Joi.number().integer().required().description('ID of the destination'),
      paymentType: Joi.string().required().description('Type of payment (e.g., virtual_account, credit_card)'),
      totalPrice: Joi.number().positive().required().description('Total price for the ticket')
    })
  },
  auth: 'jwt' // Requires authenticated user
};