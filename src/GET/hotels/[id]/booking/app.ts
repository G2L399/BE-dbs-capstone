import Hapi from '@hapi/hapi';
import Joi from 'joi';
import { getBookingHotel } from '../../../../services/hotelService.ts';

export default async (
  request: Hapi.Request<Hapi.ReqRefDefaults>,
  h: Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
) => {
  try {
    // Get query parameters with default values
    const { id } = request.params as { id: number };

    // Use the service function to get the data
    const Hotel = await getBookingHotel(id);

    return h
      .response({
        Hotel
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
  }
};
