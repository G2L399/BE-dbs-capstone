// script.js
import {
  type Lodging,
  PrismaClient,
  type Transportation,
  type TravelDestination,
  type TravelPlan,
  type User,
} from "@prisma/client";
import { faker } from "@faker-js/faker";
import fs from "fs";
import csv from "csv-parser";
const results: {
  Place_Name: String;
  Place_Id: string;
  City: string;
  Price: string;
  Place_Ratings: string;
}[] = [];
import { hashPassword } from "../src/helper/helper.ts";

const prisma = new PrismaClient();

async function seed() {
  console.log("🌱 Start seeding...");

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
      console.log(`Created ${count} ${modelName} records.`);
    } catch (error) {
      console.error(`Error creating ${modelName}:`, error);
    }
  }

  // --- Helper function to create a single record ---
  async function createOne<T>(modelName: string, createFunction: () => T) {
    try {
      // @ts-ignore
      const record = await prisma[modelName].create({ data: createFunction() });
      console.log(`Created 1 ${modelName} record with id: ${record.id}`);
      return record;
    } catch (error) {
      console.error(`Error creating ${modelName}:`, error);
      return null;
    }
  }

  // --- Seed Enums (No actual database records for enums) ---
  const statusEnumValues = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];
  const transportTypeEnumValues = [
    "BUS",
    "TRAIN",
    "FLIGHT",
    "CAR",
    "FERRY",
    "OTHER",
  ];
  const bankEnumValues = ["BCA", "MANDIRI", "BNI", "BRI", "OTHER"];

  // --- Seed Categories ---
  const categoriesData = [
    "Beach",
    "History",
    "Adventure",
    "Nature",
    "Luxury",
    "Budget",
    "Food",
    "Culture",
    "Relaxation",
  ];
  for (const name of categoriesData) {
    await createOne("category", () => ({ name }));
  }
  const existingCategories = await prisma.category.findMany();

  // --- Seed Users ---
  const usersCount = 10;
  const users: User[] = [];
  for (let i = 0; i < usersCount; i++) {
    const password = await hashPassword("nigga");
    const user = await createOne("user", () => ({
      username: faker.internet.userName(),
      profilePicture: faker.image.avatar(),
      email: faker.internet.email(),
      password,
    }));
    if (user) {
      users.push(user);
    }
  }

  // --- Seed Travel Destinations ---
  const destinationsCount = 20;
  const destinations: TravelDestination[] = [];
  for (let i = 0; i < 1; i++) {
    fs.createReadStream("./prisma/hawktuah.csv")
      .pipe(csv())
      .on(
        "data",
        async (data: {
          Place_Name: String;
          Place_Id: string;
          City: string;
          Price: string;
          Place_Ratings: string;
        }) => {
          const destination = await createOne("travelDestination", () => ({
            id: Number(data.Place_Id),
            name: data.Place_Name,
            description: faker.lorem.paragraph(),
            travelPictureUrl: faker.image.url(),
            price: Number(data.Price),
            address: faker.location.streetAddress(),
            city: data.City,
            country: "Indonesia",
            latitude: faker.location.latitude(),
            longitude: faker.location.longitude(),
            avg_rating: parseFloat(data.Place_Ratings),
            openingHours: `${faker.number.int({
              min: 8,
              max: 10,
            })}:00-${faker.number.int({ min: 17, max: 20 })}:00`,
            categories: {
              connect: faker.helpers
                .arrayElements(
                  existingCategories,
                  faker.number.int({ min: 1, max: 3 })
                )
                .map((cat) => ({ id: cat.id })),
            },
          }));
          if (destination) {
            destinations.push(destination);
          }
        }
      )
      .on("end", () => {
        console.log(results);
      });
  }
  console.log("hawktuah");
  console.log(destinations);

  // --- Seed Lodgings ---
  const lodgingsCount = 15;
  const lodgings: Lodging[] = [];
  for (let i = 0; i < lodgingsCount; i++) {
    const lodging = await createOne("lodging", () => ({
      name: faker.company.name() + " Hotel",
      description: faker.lorem.paragraphs(2),
      lodgingPictureUrl: faker.image.url(),
      pricePerNight: faker.number.int({ min: 50, max: 300 }),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      country: faker.location.countryCode(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      propertyType: faker.helpers.arrayElement([
        "Hotel",
        "Hostel",
        "Villa",
        "Apartment",
      ]),
      categories: {
        connect: faker.helpers
          .arrayElements(
            existingCategories,
            faker.number.int({ min: 1, max: 3 })
          )
          .map((cat) => ({ id: cat.id })),
      },
    }));
    if (lodging) {
      lodgings.push(lodging);
    }
  }

  // --- Seed Transportations ---
  const transportationsCount = 25;
  const transportations: Transportation[] = [];
  for (let i = 0; i < transportationsCount; i++) {
    const transportation = await createOne("transportation", () => ({
      name: `${faker.helpers.arrayElement([
        "Flight",
        "Train",
        "Bus",
      ])} ${faker.string.alphanumeric(2)}-${faker.number.int({
        min: 100,
        max: 999,
      })}`,
      description: faker.lorem.sentence(),
      company: faker.company.name(),
      pickupLocation: faker.location.city(),
      destination: faker.location.city(),
      pickupTime: faker.date.future(),
      arrivalTime: faker.date.future(),
      basePrice: faker.number.int({ min: 20, max: 200 }),
      type: faker.helpers.arrayElement(transportTypeEnumValues),
      transportPictureUrl: faker.image.url(),
    }));
    if (transportation) {
      transportations.push(transportation);
    }
  }

  // --- Seed Travel Plans ---
  const plansCount = 8;
  const plans: TravelPlan[] = [];
  for (let i = 0; i < plansCount; i++) {
    const startDate = faker.date.future();
    const endDate = faker.date.future({ years: 1, refDate: startDate });
    const plan = await createOne("travelPlan", () => ({
      userId: faker.helpers.arrayElement(users).id,
      name: faker.lorem.words(faker.number.int({ min: 2, max: 5 })),
      startDate,
      endDate,
      totalPrice: faker.number.int({ min: 500, max: 10000 }),
      status: faker.helpers.arrayElement(statusEnumValues),
    }));
    if (plan) {
      plans.push(plan);
    }
  }

  // --- Seed Payments ---
  const paymentsCount = 12;
  await createMany("payment", paymentsCount, () => ({
    userId: faker.helpers.arrayElement(users).id,
    planId: faker.helpers.arrayElement(plans).id,
    transactionId: faker.string.uuid(),
    paymentType: faker.helpers.arrayElement(["virtual_account", "credit_card"]),
    bank: faker.helpers.arrayElement(bankEnumValues),
    vaNumber: faker.helpers.maybe(() => faker.finance.accountNumber()),
    amount: faker.number.int({ min: 100, max: 5000 }),
    paymentStatus: faker.helpers.arrayElement(["pending", "paid", "failed"]),
  }));

  // --- Seed Travel Tickets ---
  const travelTicketsCount = 30;
  await createMany("travelTicket", travelTicketsCount, () => ({
    userId: faker.helpers.arrayElement(users).id,
    travelDestinationId: faker.helpers.arrayElement(destinations).id,
    guestAmount: faker.number.int({ min: 1, max: 5 }),
    totalPrice: faker.number.int({ min: 50, max: 1000 }),
    visitDate: faker.helpers.maybe(() => faker.date.future()),
    status: faker.helpers.arrayElement(statusEnumValues),
    planId: faker.helpers.maybe(() => faker.helpers.arrayElement(plans).id),
  }));

  // --- Seed Lodging Tickets ---
  const lodgingTicketsCount = 25;
  await createMany("lodgingTicket", lodgingTicketsCount, () => ({
    userId: faker.helpers.arrayElement(users).id,
    lodgingId: faker.helpers.arrayElement(lodgings).id,
    guestAmount: faker.number.int({ min: 1, max: 4 }),
    totalPrice: faker.number.int({ min: 100, max: 2000 }),
    checkInDate: faker.date.future(),
    checkOutDate: faker.date.future(),
    status: faker.helpers.arrayElement(statusEnumValues),
    planId: faker.helpers.maybe(() => faker.helpers.arrayElement(plans).id),
  }));

  // --- Seed Transportation Tickets ---
  const transportationTicketsCount = 40;
  await createMany("transportationTicket", transportationTicketsCount, () => ({
    userId: faker.helpers.arrayElement(users).id,
    transportationId: faker.helpers.arrayElement(transportations).id,
    passengerAmount: faker.number.int({ min: 1, max: 3 }),
    totalPrice: faker.number.int({ min: 30, max: 500 }),
    departureDateTime: faker.date.future(),
    arrivalDateTime: faker.date.future(),
    status: faker.helpers.arrayElement(statusEnumValues),
    planId: faker.helpers.maybe(() => faker.helpers.arrayElement(plans).id),
  }));

  // --- Seed Reviews ---
  const reviewsCount = 50;
  await createMany("review", reviewsCount, () => {
    const targetType = faker.helpers.arrayElement(["destination", "lodging"]);
    const reviewData = {
      userId: faker.helpers.arrayElement(users).id,
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.paragraph(),
      transportationId: faker.helpers.arrayElement(transportations).id,
    };
    if (targetType === "destination") {
      return {
        ...reviewData,
        travelDestinationId: faker.helpers.arrayElement(destinations).id,
      };
    } else {
      return {
        ...reviewData,
        lodgingId: faker.helpers.arrayElement(lodgings).id,
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
          connect: wishlistedDestinations.map((dest) => ({ id: dest.id })),
        },
      },
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
          connect: wishlistedLodgings.map((lodging) => ({ id: lodging.id })),
        },
      },
    });
  }

  console.log("🌱 Seeding finished.");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
