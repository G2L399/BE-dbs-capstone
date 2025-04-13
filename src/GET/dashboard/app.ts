import Hapi from "@hapi/hapi";
import Joi from "joi";
import { getPopularDestinationsByTicketCount } from "../../services/destinationService.ts";
import { getTopRatedHotelsByReview } from "../../services/hotelService.ts";

export default async (
  request: Hapi.Request<Hapi.ReqRefDefaults>,
  h: Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
) => {
  try {
    // Get query parameters with default values
    const { limit } = request.query as { limit?: number };
    const destinationLimit = limit || 7;
    
    // Use the service functions to get the data
    const popularDestinations = await getPopularDestinationsByTicketCount(destinationLimit);
    const topRatedHotels = await getTopRatedHotelsByReview(3); // Always get top 3 for dashboard

    return h.response({
      popularDestinations,
      topRatedHotels
    }).code(200);
  } catch (error) {
    console.error("Error dashboard:", error);
    return h.response({
      error: "Failed to fetch dashboard data"
    }).code(500);
  }
};

export const options: Hapi.RouteOptions = {
  tags: ["api", "dashboard"],
  description: "Get dashboard data including popular destinations and top-rated hotels",
  notes: "Returns aggregated data for dashboard display",
  validate: {
    query: Joi.object({
      limit: Joi.number().min(1).default(7).description("Limit the number of destinations returned")
    }).optional()
  }
};