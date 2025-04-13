import Hapi from "@hapi/hapi";
import Joi from "joi";
import { getAllHotels } from "../../services/hotelService.ts";

export default async (
  request: Hapi.Request<Hapi.ReqRefDefaults>,
  h: Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
) => {
  try {
    // Get query parameters with default values
    const { 
      page = 1, 
      limit = 10,
      city,
      priceMin,
      priceMax,
      propertyType
    } = request.query as { 
      page?: number; 
      limit?: number;
      city?: string;
      priceMin?: number;
      priceMax?: number;
      propertyType?: string;
    };
    
    // Build filters object from query parameters
    const filters: any = {};
    if (city) filters.city = city;
    if (priceMin && priceMax) {
      filters.priceMin = priceMin;
      filters.priceMax = priceMax;
    }
    if (propertyType) filters.propertyType = propertyType;
    
    // Use the service function to get paginated hotels
    const result = await getAllHotels(page, limit, filters);

    return h.response(result).code(200);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    return h.response({
      error: "Failed to fetch hotels"
    }).code(500);
  }
};

export const options: Hapi.RouteOptions = {
  tags: ["api", "hotels"],
  description: "Get all hotels with pagination and filtering",
  notes: "Returns a paginated list of hotels with optional filtering",
  validate: {
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1)
        .description("Page number for pagination"),
      limit: Joi.number().integer().min(1).max(100).default(10)
        .description("Number of hotels per page"),
      city: Joi.string().optional()
        .description("Filter hotels by city"),
      priceMin: Joi.number().integer().min(0).optional()
        .description("Minimum price per night"),
      priceMax: Joi.number().integer().min(0).optional()
        .description("Maximum price per night"),
      propertyType: Joi.string().optional()
        .description("Filter by property type (Hotel, Hostel, Villa, Apartment)")
    }).optional()
  }
};