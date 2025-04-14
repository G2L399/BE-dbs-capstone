import { PrismaClient } from '@prisma/client';

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
