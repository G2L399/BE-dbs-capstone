import Hapi from "@hapi/hapi";
import Joi from "joi";
import { getHotelById } from "../../../services/hotelService.ts";

export default async (
  request: Hapi.Request<Hapi.ReqRefDefaults>,
  h: Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
) => {
  try {
    const id = parseInt(request.params.id);
    
    // Use the service function to get hotel by ID
    const result = await getHotelById(id);

    if (!result.hotel) {
      return h.response({
        error: `Hotel with ID ${id} not found`
      }).code(404);
    }

    return h.response(result).code(200);
  } catch (error) {
    console.error(`Error fetching hotel with ID ${request.params.id}:`, error);
    return h.response({
      error: "Failed to fetch hotel details"
    }).code(500);
  }
};

export const options: Hapi.RouteOptions = {
  tags: ["api", "hotels"],
  description: "Get hotel details by ID",
  notes: "Returns detailed information about a specific hotel including reviews",
  validate: {
    params: Joi.object({
      id: Joi.string().required()
        .description("The ID of the hotel to retrieve")
    })
  }
};