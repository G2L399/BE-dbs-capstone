import Hapi from '@hapi/hapi';
import Joi from 'joi';
import { getAllDestinations } from '../../services/destinationService.ts';

export default async (
  request: Hapi.Request<Hapi.ReqRefDefaults>,
  h: Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
) => {
  try {
    // Get query parameters with default values
    const {
      page = 1,
      limit = 10,
      search,
      country
    } = request.query as {
      page?: number;
      limit?: number;
      search?: string;
      country?: string;
    };

    // Use the service function to get the data
    const result = await getAllDestinations(page, limit, search, country);

    // Calculate pagination metadata
    const totalPages = Math.ceil(result.total / limit);

    return h
      .response({
        destinations: result.destinations,
        meta: {
          currentPage: page,
          itemsPerPage: limit,
          totalItems: result.total,
          totalPages
        }
      })
      .code(200);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return h
      .response({
        error: 'Failed to fetch destinations'
      })
      .code(500);
  }
};

export const options: Hapi.RouteOptions = {
  tags: ['api', 'destinations'],
  description: 'Get all destinations with optional filtering and pagination',
  notes:
    'Returns a paginated list of destinations with their details and ratings',
  validate: {
    query: Joi.object({
      page: Joi.number().min(1).default(1).description('Page number'),
      limit: Joi.number()
        .min(1)
        .max(100)
        .default(10)
        .description('Items per page'),
      search: Joi.string().description('Search term for name or description'),
      country: Joi.string().description('Filter by country')
    }).optional()
  }
};
