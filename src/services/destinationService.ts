import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface DestinationWithRating {
  id: number;
  name: string;
  description: string | null;
  travelPictureUrl: string | null;
  price: number | null;
  address: string | null;
  city: string | null;
  country: string | null;
  avgRating: number;
  reviewCount: number;
  popularity: number;
}

/**
 * Retrieves popular destinations with average ratings and ticket counts
 * @param limit Number of destinations to return (default: 7)
 * @returns Array of formatted destination data with ratings
 */
export async function getPopularDestinationsByTicketCount(
  limit: number = 7
): Promise<DestinationWithRating[]> {
  // Retrieve popular destinations
  const popularDestinations = await prisma.travelDestination.findMany({
    take: limit,
    include: {
      travelTickets: {
        take: 1
      },
      reviews: true,
      _count: {
        select: {
          travelTickets: true
        }
      }
    }
  });

  // Sort by number of tickets (popularity)
  const sortedDestinations = [...popularDestinations].sort(
    (a, b) => (b._count?.travelTickets || 0) - (a._count?.travelTickets || 0)
  );

  // Format destination data with average rating
  return sortedDestinations.map((destination) => {
    // Calculate average rating
    const totalRating = destination.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const avgRating =
      destination.reviews.length > 0
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
      avgRating: parseFloat(avgRating.toFixed(1)),
      reviewCount: destination.reviews.length,
      popularity: destination._count?.travelTickets || 0
    };
  });
}

/**
 * Retrieves all destinations with optional filtering and pagination
 * @param page Page number (default: 1)
 * @param limit Items per page (default: 10)
 * @param search Optional search term for name/description
 * @param country Optional country filter
 * @returns Paginated array of destinations with ratings
 */
export async function getAllDestinations(
  page: number = 1,
  limit: number = 10,
  search?: string,
  country?: string
): Promise<{ destinations: DestinationWithRating[]; total: number }> {
  const skip = (page - 1) * limit;

  // Build the where clause based on filters
  const where: Prisma.TravelDestinationWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } }
    ];
  }

  if (country) {
    where.country = country;
  }

  // Get total count for pagination
  const total = await prisma.travelDestination.count({ where });

  // Retrieve destinations with filters
  const destinations = await prisma.travelDestination.findMany({
    where,
    skip,
    take: limit,
    include: {
      reviews: true,
      categories: true
    },
    orderBy: {
      name: 'asc'
    }
  });

  // Format destination data with average rating
  return {
    destinations: destinations.map((destination) => {
      // Calculate average rating
      const totalRating = destination.reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const avgRating =
        destination.reviews.length > 0
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
        avgRating: parseFloat(avgRating.toFixed(1)),
        reviewCount: destination.reviews.length,
        popularity: 0, // We don't have ticket counts here
        categories: destination.categories.map((cat) => cat.name)
      };
    }),
    total
  };
}

export async function getTravelHistory(id: number,limit: number = 10) {
  return await prisma.travelTicket.findMany({
    where: {
      userId: id
    },
    include: {
      travelDestination: true
    },
    take: limit
  });
}