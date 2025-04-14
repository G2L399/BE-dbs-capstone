import Hapi from '@hapi/hapi';
import Joi from 'joi';
import { getTopRatedHotelsByReview } from '../../../services/hotelService.ts';

export default async (
  request: Hapi.Request<Hapi.ReqRefDefaults>,
  h: Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
) => {
  try {
    // Get query parameters with default values
    const { limit } = request.query as { limit?: number };
    const hotelLimit = limit || 10; // Default to 10 for this endpoint

    // Use the service function to get the data
    const topRatedHotels = await getTopRatedHotelsByReview(hotelLimit);

    return h
      .response({
        topRatedHotels
      })
      .code(200);
  } catch (error) {
    console.error('Error fetching top-rated hotels:', error);
    return h
      .response({
        error: 'Failed to fetch top-rated hotels'
      })
      .code(500);
  }
};

export const options: Hapi.RouteOptions = {
  tags: ['api', 'hotels'],
  description: 'Get top-rated hotels based on user reviews',
  notes: 'Returns an array of hotels sorted by rating',
  validate: {
    query: Joi.object({
      limit: Joi.number()
        .min(1)
        .default(10)
        .description('Limit the number of hotels returned')
    }).optional()
  }
};
