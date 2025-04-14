import Hapi from '@hapi/hapi';
import Joi from 'joi';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (
  request: Hapi.Request<Hapi.ReqRefDefaults>,
  h: Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
) => {
  try {
    const { id } = request.params;
    const destinationId = parseInt(id, 10);

    if (isNaN(destinationId)) {
      return h
        .response({
          error: 'Invalid destination ID'
        })
        .code(400);
    }

    const destination = await prisma.travelDestination.findUnique({
      where: {
        id: destinationId
      },
      include: {
        reviews: true,
        categories: true
      }
    });

    if (!destination) {
      return h
        .response({
          error: 'Destination not found'
        })
        .code(404);
    }

    // Calculate average rating
    const totalRating = destination.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const avgRating =
      destination.reviews.length > 0
        ? totalRating / destination.reviews.length
        : 0;

    const formattedDestination = {
      ...destination,
      avgRating: parseFloat(avgRating.toFixed(1)),
      reviewCount: destination.reviews.length,
      categories: destination.categories.map((category) => category.name)
    };

    return h
      .response({
        destination: formattedDestination
      })
      .code(200);
  } catch (error) {
    console.error('Error fetching destination by ID:', error);
    return h
      .response({
        error: 'Failed to fetch destination'
      })
      .code(500);
  }
};

export const options: Hapi.RouteOptions = {
  tags: ['api', 'destinations'],
  description: 'Get destination details by ID',
  notes: 'Returns detailed information about a specific destination',
  validate: {
    params: Joi.object({
      id: Joi.string().required().description('The ID of the destination')
    })
  }
};
