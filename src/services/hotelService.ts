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

export async function getBestDealHotelsByPrice(
  takeForFiltering: number = 8
): Promise<Lodging[]> {
  // Retrieve hotels with their reviews
  const hotels = await prisma.lodging.findMany({
    take: takeForFiltering,
    include: {
      reviews: true
    },
    orderBy:{
      pricePerNight: 'asc'
    }
  });
  // Sort hotels by average rating and take requested limit
  return hotels
}

export async function getHotelByID(
  id:number
): Promise<Lodging & { reviews: Review[]; Rooms: Rooms[]} | null> {
  // Retrieve hotels with their reviews
  const hotels = await prisma.lodging.findFirst({
    where:{
      id
    },
    include:{
      reviews:true,
      Rooms:true
    }
  })
  
  // Sort hotels by average rating and take requested limit
  return hotels
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
      }
    }
  });

  // Return the hotel if found
  return hotel;
}
