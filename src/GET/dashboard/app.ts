import Hapi from '@hapi/hapi';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';

const prisma = new PrismaClient();

export default async (
  request: Hapi.Request<Hapi.ReqRefDefaults>,
  h: Hapi.ResponseToolkit<Hapi.ReqRefDefaults>
) => {
  try {
    // Retrieve all destinations
    const destinations = await prisma.travelDestination.findMany({
      include: {
        reviews: true,
        _count: {
          select: {
            travelTickets: true
          }
        }
      }
    });

    // Sort by number of tickets (popularity) and take top 7
    const popularDestinations = [...destinations]
      .sort((a, b) => (b._count?.travelTickets || 0) - (a._count?.travelTickets || 0))
      .slice(0, 7);

    // Format destination data with average rating
    const formattedDestinations = popularDestinations.map((destination) => {
      // Calculate average rating manually
      const totalRating = destination.reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const avgRating = destination.reviews.length > 0 
        ? totalRating / destination.reviews.length 
        : 0;

      return {
        id: destination.id,
        name: destination.name,
        description: destination.description,
        travelPictureUrl: destination.travelPictureUrl,
        price: destination.price,
        address: destination.address,
        city: destination.city,
        country: destination.country,
        avgRating: parseFloat(avgRating.toFixed(1)), // Use calculated rating instead of direct access
        reviewCount: destination.reviews.length,
        popularity: destination._count?.travelTickets || 0
      };
    });

    // Retrieve top-rated hotels (3 items)
    const topRatedHotels = await prisma.lodging.findMany({
      take: 20, // Take more to filter later
      include: {
        reviews: true
      }
    });

    // Calculate average rating and sort
    const hotelsWithRating = topRatedHotels.map((hotel) => {
      const totalRating = hotel.reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const avgRating =
        hotel.reviews.length > 0 ? totalRating / hotel.reviews.length : 0;

      return {
        id: hotel.id,
        name: hotel.name,
        description: hotel.description,
        lodgingPictureUrl: hotel.lodgingPictureUrl,
        pricePerNight: hotel.pricePerNight,
        address: hotel.address,
        city: hotel.city,
        country: hotel.country,
        propertyType: hotel.propertyType,
        avgRating: parseFloat(avgRating.toFixed(1)),
        reviewCount: hotel.reviews.length
      };
    });

    // Sort hotels by average rating and take top 3
    const top3Hotels = hotelsWithRating
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 3);

    return h
      .response({
        popularDestinations: formattedDestinations,
        topRatedHotels: top3Hotels
      })
      .code(200);
  } catch (error) {
    console.error('Error dashboard:', error);
    return h
      .response({
        error: 'Failed to fetch dashboard data'
      })
      .code(500);
  }
};

export const options: Hapi.RouteOptions = {
  tags: ['api', 'dashboard'],
  description:
    'Get dashboard data including popular destinations and top-rated hotels',
  notes: 'Returns aggregated data for dashboard display',
  validate: {
    query: Joi.object({
      limit: Joi.number()
        .min(1)
        .default(7)
        .description('Limit the number of destinations returned')
    }).optional()
  }
};