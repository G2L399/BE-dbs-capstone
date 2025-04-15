import Hapi from '@hapi/hapi';
import { getTravelHistory } from '../../../services/destinationService.ts';
import Joi from 'joi';


export default async (
  request: Hapi.Request<Hapi.ReqRefDefaults>,
  h: Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
) => {
  try {
    const userId = request.auth.credentials.id as number;
    const limit = request.query.limit as number
    if (!userId) {
      return h
        .response({
          message: 'User not authenticated',
          success: false
        })
        .code(401);
    }
    const history = await getTravelHistory(userId, limit);

    return h
      .response({
        history,
        success: true,
        message: 'Travel history fetched successfully'
      })
      .code(200);
  } catch (error) {
    console.error('Error fetching History', error);
    return h
      .response({
        error: 'Failed to fetch History'
      })
      .code(500);
  }
};

export const options: Hapi.RouteOptions = {
  tags: ['api', 'destinations'],
  description: 'Get Travel History',
  notes: "Returns detailed information about the user's history",
  auth: 'jwt',
  validate: {
    query: Joi.object({
      limit: Joi.number().integer().min(1).optional()
    })
  },
};
