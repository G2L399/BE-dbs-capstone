// script.js
import {
  type Lodging,
  type LodgingTicket,
  type Payment,
  PrismaClient,
  type Transportation,
  type TravelDestination,
  type TravelPlan,
  type TravelTicket,
  type User
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import fs from 'fs';
import csv from 'csv-parser';
import { hashPassword } from '../src/helper/helper.ts';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Start seeding...');

  // --- Helper function to create multiple records ---
  async function createMany<T>(
    modelName: string,
    count: number,
    createFunction: () => T
  ) {
    const data = Array.from({ length: count }, () => createFunction());
    try {
      // @ts-ignore
      await prisma[modelName].createMany({ data });
    } catch (error) {
      console.error(`Error creating ${modelName}:`, error);
    }
  }

  // --- Helper function to create a single record ---
  async function createOne<T>(modelName: string, createFunction: () => T) {
    try {
      // @ts-ignore
      const record = await prisma[modelName].create({ data: createFunction() });
      return record;
    } catch (error) {
      console.error(`Error creating ${modelName}:`, error);
      return null;
    }
  }

  // --- Seed Enums (No actual database records for enums) ---
  const statusEnumValues = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
  const transportTypeEnumValues = [
    'BUS',
    'TRAIN',
    'FLIGHT',
    'CAR',
    'FERRY',
    'OTHER'
  ];
  const bankEnumValues = ['BCA', 'MANDIRI', 'BNI', 'BRI', 'OTHER'];

  // --- Seed Categories ---
  const categoriesData = [
    'Beach',
    'History',
    'Adventure',
    'Nature',
    'Luxury',
    'Budget',
    'Food',
    'Culture',
    'Relaxation'
  ];
  for (const name of categoriesData) {
    await createOne('category', () => ({ name }));
  }
  const existingCategories = await prisma.category.findMany();

  // --- Seed Users ---
  const usersCount = 10;
  const users: User[] = [];
  for (let i = 0; i < usersCount; i++) {
    const password = await hashPassword('nigga');
    const balance = Number(faker.finance.amount());
    const user = await createOne('user', () => ({
      username: faker.internet.username(),
      profilePicture: faker.image.avatar(),
      email: faker.internet.email(),
      password,
      balance
    }));
    if (user) {
      users.push(user);
    }
  }
  const destinations: TravelDestination[] = [];
  for (let i = 0; i < 1; i++) {
    fs.createReadStream('./prisma/hawktuah.csv')
      .pipe(csv())
      .on(
        'data',
        async (data: {
          Place_Name: String;
          Place_Id: string;
          City: string;
          Price: string;
          Place_Ratings: string;
          Description: string;
          Lat: any;
          Long: any;
        }) => {
          const destination = await createOne('travelDestination', () => ({
            id: Number(data.Place_Id),
            name: data.Place_Name,
            description: data.Description,
            travelPictureUrl: faker.image.url(),
            price: Number(data.Price),
            address: faker.location.streetAddress(),
            city: data.City,
            country: 'Indonesia',
            latitude: parseFloat(data.Lat),
            longitude: parseFloat(data.Long),
            avg_rating: parseFloat(data.Place_Ratings),
            openingHours: `${faker.number.int({
              min: 8,
              max: 10
            })}:00-${faker.number.int({ min: 17, max: 20 })}:00`,
            categories: {
              connect: faker.helpers
                .arrayElements(
                  existingCategories,
                  faker.number.int({ min: 1, max: 3 })
                )
                .map((cat) => ({ id: cat.id }))
            }
          }));
          if (destination) {
            destinations.push(destination);
          }
        }
      )
      .on('end', () => {
        console.log('Data seeding completed for travel destinations.');
      });
  }

  // --- Seed Lodgings ---
  const lodgingsCount = 15;
  const lodgings: Lodging[] = [];
  for (let i = 0; i < lodgingsCount; i++) {
    const pricePerNight = faker.number.int({ min: 50, max: 300 });
    const lodging = await createOne('lodging', () => ({
      name: faker.company.name() + ' Hotel',
      description: faker.lorem.paragraphs(2),
      lodgingPictureUrl: faker.image.url(),
      pricePerNight,
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      country: faker.location.country(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      propertyType: faker.helpers.arrayElement([
        'Hotel',
        'Hostel',
        'Villa',
        'Apartment'
      ]),
      categories: {
        connect: faker.helpers
          .arrayElements(
            existingCategories,
            faker.number.int({ min: 1, max: 3 })
          )
          .map((cat) => ({ id: cat.id }))
      },

      Rooms: {
        create: Array.from(
          { length: faker.number.int({ min: 5, max: 10 }) },
          (_, index) => ({
            name: faker.lorem.words(2),
            description: faker.lorem.sentence(),
            price:
              index === 0
                ? pricePerNight
                : faker.number.int({
                    min: pricePerNight,
                    max: pricePerNight * 100
                  }),
            capacity: faker.number.int({ min: 1, max: 4 }),
            status: faker.helpers.arrayElement(['AVAILABLE', 'OCCUPIED']),
            roomPictureUrl: faker.image.url({
              width: 800,
              height: 600
            })
          })
        )
      }
    }));
    if (lodging) {
      lodgings.push(lodging);
    }
  }

  // --- Seed Transportations ---
  const transportationsCount = 25;
  const transportations: Transportation[] = [];
  for (let i = 0; i < transportationsCount; i++) {
    const transportation = await createOne('transportation', () => ({
      name: `${faker.helpers.arrayElement([
        'Flight',
        'Train',
        'Bus'
      ])} ${faker.string.alphanumeric(2)}-${faker.number.int({
        min: 100,
        max: 999
      })}`,
      description: faker.lorem.sentence(),
      company: faker.company.name(),
      pickupLocation: faker.location.city(),
      destination: faker.location.city(),
      pickupTime: faker.date.future(),
      arrivalTime: faker.date.future(),
      basePrice: faker.number.int({ min: 20, max: 200 }),
      type: faker.helpers.arrayElement(transportTypeEnumValues),
      transportPictureUrl: faker.image.url()
    }));
    if (transportation) {
      transportations.push(transportation);
    }
  }

  // --- Seed Payments ---
  const paymentsCount = 12;
  await createMany<Payment>('payment', paymentsCount, () => ({
    userId: faker.helpers.arrayElement(users).id,
    paymentType: faker.helpers.arrayElement(['virtual_account', 'credit_card']),
    bank: faker.helpers.arrayElement(bankEnumValues),
    vaNumber: faker.helpers.maybe(() => faker.finance.accountNumber()),
    amount: faker.number.int({ min: 100, max: 5000 }),
    paymentStatus: faker.helpers.arrayElement(['pending', 'paid', 'failed'])
  }));
  const payments = await prisma.payment.findMany();

  // --- Seed Travel Tickets ---
  const travelTicketsCount = 30;
  await createMany<TravelTicket>('travelTicket', travelTicketsCount, () => ({
    userId: faker.helpers.arrayElement(users).id,
    travelDestinationId: faker.helpers.arrayElement(destinations).id,
    guestAmount: faker.number.int({ min: 1, max: 5 }),
    totalPrice: faker.number.int({ min: 50, max: 1000 }),
    visitDate: faker.helpers.maybe(() => faker.date.future()),
    status: faker.helpers.arrayElement(statusEnumValues),
    paymentId: faker.helpers.arrayElement(payments).id
  }));
  const TravelTickets = await prisma.travelTicket.findMany();

  // --- Seed Lodging Tickets ---
  const lodgingTicketsCount = 25;
  await createMany<LodgingTicket>('lodgingTicket', lodgingTicketsCount, () => ({
    userId: faker.helpers.arrayElement(users).id,
    lodgingId: faker.helpers.arrayElement(lodgings).id,
    guestAmount: faker.number.int({ min: 1, max: 4 }),
    totalPrice: faker.number.int({ min: 100, max: 2000 }),
    checkInDate: faker.date.future(),
    checkOutDate: faker.date.future(),
    status: faker.helpers.arrayElement(statusEnumValues),
    paymentId: faker.helpers.arrayElement(payments).id
  }));
  const LodgingTickets = await prisma.lodgingTicket.findMany();

  // --- Seed Transportation Tickets ---
  const transportationTicketsCount = 40;
  await createMany('transportationTicket', transportationTicketsCount, () => ({
    userId: faker.helpers.arrayElement(users).id,
    transportationId: faker.helpers.arrayElement(transportations).id,
    passengerAmount: faker.number.int({ min: 1, max: 3 }),
    totalPrice: faker.number.int({ min: 30, max: 500 }),
    departureDateTime: faker.date.future(),
    arrivalDateTime: faker.date.future(),
    status: faker.helpers.arrayElement(statusEnumValues),
    paymentId: faker.helpers.arrayElement(payments).id
  }));
  const transportationTickets = await prisma.transportationTicket.findMany();

  // --- Seed Travel Plans ---
  const plansCount = 10;
  const plans: TravelPlan[] = [];
  for (let i = 0; i < plansCount; i++) {
    const startDate = faker.date.future();
    const endDate = faker.date.future({ years: 1, refDate: startDate });
    const plan = await createOne<TravelPlan>('travelPlan', () => ({
      userId: faker.helpers.arrayElement(users).id,
      name: faker.lorem.words(faker.number.int({ min: 2, max: 5 })),
      startDate,
      endDate,
      totalPrice: faker.number.int({ min: 500, max: 10000 }),
      status: faker.helpers.arrayElement(statusEnumValues),
      lodgingTicketId: faker.helpers.arrayElement(LodgingTickets).id,
      travelTicketId: faker.helpers.arrayElement(TravelTickets).id,
      transportationTicketId: faker.helpers.arrayElement(transportationTickets)
        .id
    }));
    if (plan) {
      plans.push(plan);
    }
  }

  // --- Seed Reviews ---
  const reviewsCount = 1000;
  await createMany('review', reviewsCount, () => {
    const targetType = faker.helpers.arrayElement(['destination', 'lodging']);
    const reviewData = {
      userId: faker.helpers.arrayElement(users).id,
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.paragraph(),
      transportationId: faker.helpers.arrayElement(transportations).id
    };
    if (targetType === 'destination') {
      return {
        ...reviewData,
        travelDestinationId: faker.helpers.arrayElement(destinations).id
      };
    } else {
      return {
        ...reviewData,
        lodgingId: faker.helpers.arrayElement(lodgings).id
      };
    }
  });

  // --- Seed Wishlisted Destinations ---
  for (const user of users) {
    const wishlistedDestinations = faker.helpers.arrayElements(
      destinations,
      faker.number.int({ min: 0, max: 5 })
    );
    await prisma.user.update({
      where: { id: user.id },
      data: {
        wishlistedDestinations: {
          connect: wishlistedDestinations.map((dest) => ({ id: dest.id }))
        }
      }
    });
  }

  // --- Seed Wishlisted Lodgings ---
  for (const user of users) {
    const wishlistedLodgings = faker.helpers.arrayElements(
      lodgings,
      faker.number.int({ min: 0, max: 3 })
    );
    await prisma.user.update({
      where: { id: user.id },
      data: {
        wishlistedLodgings: {
          connect: wishlistedLodgings.map((lodging) => ({ id: lodging.id }))
        }
      }
    });
  }

  console.log('🌱 Seeding finished.');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
