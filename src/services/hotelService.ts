import {
   type Lodging, 
  Prisma, 
  PrismaClient, 
  type Review, 
  type Rooms } from '@prisma/client';

const prisma = new PrismaClient();

interface HotelWithRating {
  id: number;
  name: string;
  description: string | null;
  lodgingPictureUrl: string | null;
  pricePerNight: number;
  address: string;
  city: string | null;
  country: string | null;
  propertyType: string | null;
  avgRating: number;
  reviewCount: number;
  categories?: string[];
  reviews?: {
    id: number;
    rating: number;
    comment: string | null;
    userId: number;
    username: string;
  }[];

}

/**
 * Retrieves top-rated hotels based on average review ratings
 * @param limit Number of hotels to return (default: 3)
 * @param takeForFiltering Number of hotels to retrieve for filtering (default: 20)
 * @returns Array of top-rated hotels with calculated average ratings
 */
export async function getTopRatedHotelsByReview(
  limit: number = 3,
  takeForFiltering: number = 20
): Promise<HotelWithRating[]> {
  // Retrieve hotels with their reviews
  const hotels = await prisma.lodging.findMany({
    take: takeForFiltering,
    include: {
      reviews: true
    }
  });

  // Calculate average rating and sort
  const hotelsWithRating = hotels.map((hotel) => {
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

  // Sort hotels by average rating and take requested limit
  return hotelsWithRating
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, limit);
}

/**
 * Retrieves all hotels with pagination and optional filtering
 * @param page Page number for pagination (default: 1)
 * @param limit Number of hotels per page (default: 10)
 * @param filters Optional filters for hotel data
 * @returns Paginated array of hotels with rating information
 */
export async function getAllHotels(page: number = 1, limit: number = 10, filters?: any): Promise<{
  data: HotelWithRating[];
  meta: {
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }
}> {
  // Calculate pagination values
  const skip = (page - 1) * limit;
  
  // Build where clause based on filters
  let whereClause = {};
  if (filters) {
    // Add filter conditions here (e.g., price range, city, etc.)
    if (filters.city) whereClause = { ...whereClause, city: filters.city };
    if (filters.priceMin && filters.priceMax) {
      whereClause = { 
        ...whereClause, 
        pricePerNight: { 
          gte: parseInt(filters.priceMin), 
          lte: parseInt(filters.priceMax) 
        } 
      };
    }
    if (filters.propertyType) {
      whereClause = { ...whereClause, propertyType: filters.propertyType };
    }
    // Add more filter conditions as needed
  }

  // Count total hotels with the same filters
  const totalCount = await prisma.lodging.count({
    where: whereClause
  });

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / limit);

  // Retrieve hotels with pagination
  const hotels = await prisma.lodging.findMany({
    skip,
    take: limit,
    where: whereClause,
    include: {
      reviews: true,
      categories: true
    },
    orderBy: {
      id: 'asc' // Default ordering
    }
  });

  // Calculate average rating for each hotel
  const hotelsWithRating = hotels.map(hotel => {
    const totalRating = hotel.reviews.reduce(
      (sum, review) => sum + review.rating, 
      0
    );
    const avgRating = hotel.reviews.length > 0 
      ? totalRating / hotel.reviews.length 
      : 0;
    
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
      reviewCount: hotel.reviews.length,
      categories: hotel.categories.map(category => category.name),
    };
  });

  return {
    data: hotelsWithRating,
    meta: {
      totalCount,
      page,
      pageSize: limit,
      totalPages
    }
  };
}

/**
 * Retrieves a specific hotel by ID with detailed information
 * @param id Hotel/Lodging ID to retrieve
 * @returns Detailed hotel information including reviews or null if not found
 */
export async function getHotelById(id: number): Promise<{
  hotel: HotelWithRating & {
    reviews: {
      id: number;
      rating: number;
      comment: string | null;
      userId: number;
      username: string;
    }[];
  } | null;
}> {
  // Find the specific hotel by ID
  const hotel = await prisma.lodging.findUnique({
    where: { id },
    include: {
      reviews: true,
      categories: true
    }
  });
  
  // Fetch usernames for reviews separately since we need to join them
  const userIds = hotel?.reviews.map(review => review.userId) || [];
  const users = userIds.length > 0 
    ? await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, username: true }
      })
    : [];

  // Return null if hotel not found
  if (!hotel) {
    return { hotel: null };
  }

  // Calculate average rating
  const totalRating = hotel.reviews.reduce(
    (sum, review) => sum + review.rating, 
    0
  );
  const avgRating = hotel.reviews.length > 0 
    ? totalRating / hotel.reviews.length 
    : 0;

  // Format reviews to include username
  const formattedReviews = hotel.reviews.map(review => {
    const user = users.find(u => u.id === review.userId);
    return {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      userId: review.userId,
      username: user?.username || "Unknown User" // Fallback if user not found
    };
  });

  // Return formatted hotel with reviews
  return {
    hotel: {
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
      reviewCount: hotel.reviews.length,
      categories: hotel.categories.map(category => category.name),
      reviews: formattedReviews
    }
  };
}

export async function getBookingHotel(
  id: number
): Promise<(Lodging & { reviews: Review[]; Rooms: Rooms[] }) | null> {
  // Retrieve hotels with their reviews and available rooms
  const hotel = await prisma.lodging.findFirst({
    where: {
      id
    },
    include: {
      reviews: true,
      Rooms: {
        where: {
          status: "AVAILABLE"
        },
        orderBy: {
          price: 'asc'
        }
      },
      categories: true
    }
  })
  return hotel;
}

export async function getBestDealHotelsByPrice(
  takeForFiltering: number = 8
): Promise<Lodging[]> {
  const hotels = await prisma.lodging.findMany({
    take: takeForFiltering,
    include: {
      reviews: true,
      categories: true
    },
  });
  return hotels
}