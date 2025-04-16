import Hapi from '@hapi/hapi';
import Joi from 'joi';
import { getPopularDestinationsByTicketCount } from '../../../services/destinationService.ts';

export default async (
  request: Hapi.Request<Hapi.ReqRefDefaults>,
  h: Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
) => {
  try {
    // Get query parameters with default values
    const { limit } = request.query as { limit?: number };
    const destinationLimit = limit || 10; // Default to 10 for this endpoint

    // Use the service function to get the data
    const popularDestinations =
      await getPopularDestinationsByTicketCount(destinationLimit);

    return h
      .response({
        popularDestinations
      })
      .code(200);
  } catch (error) {
    console.error('Error fetching popular destinations:', error);
    return h
      .response({
        error: 'Failed to fetch popular destinations'
      })
      .code(500);
  }
};

export const options: Hapi.RouteOptions = {
  tags: ['api', 'destinations'],
  description: 'Get popular destinations based on booking count',
  notes: 'Returns an array of popular destinations with ratings and details',
  validate: {
    query: Joi.object({
      limit: Joi.number()
        .min(1)
        .default(10)
        .description('Limit the number of destinations returned')
    }).optional()
  }
};