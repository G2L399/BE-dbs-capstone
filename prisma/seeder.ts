import {
  type Lodging,
  type LodgingTicket,
  type Payment,
  PrismaClient,
  type Transportation,
  type TransportationTicket,
  type TravelPlan,
  type TravelTicket,
  type TravelDestination,
  type User,
} from "@prisma/client";
import { fakerID_ID as faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  // Seed Users
  const users = [] as User[];
  for (let i = 0; i < 15; i++) {
    const user = await prisma.user.create({
      data: {
        username: faker.internet.userName(),
        profilePicture: faker.image.avatar(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });
    users.push(user);
  }

  console.log("Seeded Users:", users);

  // Seed TravelDestinations
  const travelDestinations = [] as TravelDestination[];
  for (let i = 0; i < 15; i++) {
    const travelDestination = await prisma.travelDestination.create({
      data: {
        name: faker.location.city(),
        description: faker.lorem.sentence(),
        travelPictureUrl: faker.image.url(),
        price: faker.number.int({ min: 100, max: 1000 }),
        location: faker.location.country(),
      },
    });
    travelDestinations.push(travelDestination);
  }

  console.log("Seeded TravelDestinations:", travelDestinations);

  // Seed Lodgings
  const lodgings = [] as Lodging[];
  for (let i = 0; i < 15; i++) {
    const lodging = await prisma.lodging.create({
      data: {
        name: faker.company.name(),
        description: faker.lorem.sentence(),
        lodgingPictureUrl: faker.image.url(),
        price: faker.number.int({ min: 50, max: 500 }),
        address: faker.location.streetAddress(),
      },
    });
    lodgings.push(lodging);
  }

  console.log("Seeded Lodgings:", lodgings);

  // Seed Transportations
  const transportations = [] as Transportation[];
  for (let i = 0; i < 15; i++) {
    const transportation = await prisma.transportation.create({
      data: {
        name: faker.vehicle.type(),
        description: faker.lorem.sentence(),
        pickupLocation: faker.location.city(),
        destination: faker.location.city(),
        pickupTime: faker.date.future(),
        arrivalTime: faker.date.future(),
        price: faker.number.int({ min: 20, max: 200 }),
        type: faker.helpers.arrayElement(["BUS", "TRAIN", "FLIGHT", "CAR"]),
        transportPictureUrl: faker.image.url(),
      },
    });
    transportations.push(transportation);
  }

  console.log("Seeded Transportations:", transportations);

  // Seed TravelPlans
  const travelPlans = [] as TravelPlan[];
  for (let i = 0; i < 15; i++) {
    const user = faker.helpers.arrayElement(users);
    const travelPlan = await prisma.travelPlan.create({
      data: {
        user_id: user.id,
        totalPrice: faker.number.int({ min: 500, max: 5000 }),
        status: faker.helpers.arrayElement([
          "PENDING",
          "CONFIRMED",
          "CANCELLED",
        ]),
      },
    });
    travelPlans.push(travelPlan);
  }

  console.log("Seeded TravelPlans:", travelPlans);

  // Seed Payments
  const payments = [] as Payment[];
  for (let i = 0; i < 15; i++) {
    const user = faker.helpers.arrayElement(users);
    const travelPlan = faker.helpers.arrayElement(travelPlans);
    const payment = await prisma.payment.create({
      data: {
        user_id: user.id,
        item_id: travelPlan.id,
        transactionId: faker.string.uuid(),
        paymentType: faker.finance.transactionType(),
        bank: faker.helpers.arrayElement([
          "BCA",
          "MANDIRI",
          "BNI",
          "BRI",
          "OTHER",
        ]),
        vaNumber: faker.finance.accountNumber(),
        paymentStatus: faker.helpers.arrayElement([
          "SUCCESS",
          "FAILED",
          "PENDING",
        ]),
      },
    });
    payments.push(payment);
  }

  console.log("Seeded Payments:", payments);

  // Seed TravelTickets
  const travelTickets = [] as TravelTicket[];
  for (let i = 0; i < 15; i++) {
    const user = faker.helpers.arrayElement(users);
    const travelDestination = faker.helpers.arrayElement(travelDestinations);
    const travelPlan = faker.helpers.arrayElement(travelPlans);
    const travelTicket = await prisma.travelTicket.create({
      data: {
        user_id: user.id,
        travelId: travelDestination.id,
        guestAmount: faker.number.int({ min: 1, max: 10 }),
        totalPrice: faker.number.int({ min: 100, max: 1000 }),
        status: faker.helpers.arrayElement([
          "PENDING",
          "CONFIRMED",
          "CANCELLED",
        ]),
        plan_id: travelPlan.id,
      },
    });
    travelTickets.push(travelTicket);
  }

  console.log("Seeded TravelTickets:", travelTickets);

  // Seed LodgingTickets
  const lodgingTickets = [] as LodgingTicket[];
  for (let i = 0; i < 15; i++) {
    const user = faker.helpers.arrayElement(users);
    const lodging = faker.helpers.arrayElement(lodgings);
    const travelPlan = faker.helpers.arrayElement(travelPlans);
    const lodgingTicket = await prisma.lodgingTicket.create({
      data: {
        user_id: user.id,
        lodgingId: lodging.id,
        guestAmount: faker.number.int({ min: 1, max: 10 }),
        totalPrice: faker.number.int({ min: 50, max: 500 }),
        checkinDate: faker.date.future(),
        checkoutDate: faker.date.future(),
        status: faker.helpers.arrayElement([
          "PENDING",
          "CONFIRMED",
          "CANCELLED",
        ]),
        plan_id: travelPlan.id,
      },
    });
    lodgingTickets.push(lodgingTicket);
  }

  console.log("Seeded LodgingTickets:", lodgingTickets);

  // Seed TransportationTickets
  const transportationTickets = [] as TransportationTicket[];
  for (let i = 0; i < 15; i++) {
    const user = faker.helpers.arrayElement(users);
    const transportation = faker.helpers.arrayElement(transportations);
    const travelPlan = faker.helpers.arrayElement(travelPlans);
    const transportationTicket = await prisma.transportationTicket.create({
      data: {
        user_id: user.id,
        transportation_id: transportation.id,
        passengerAmount: faker.number.int({ min: 1, max: 10 }),
        totalPrice: faker.number.int({ min: 20, max: 200 }),
        status: faker.helpers.arrayElement([
          "PENDING",
          "CONFIRMED",
          "CANCELLED",
        ]),
        plan_id: travelPlan.id,
      },
    });
    transportationTickets.push(transportationTicket);
  }

  console.log("Seeded TransportationTickets:", transportationTickets);
}

main()
  .then(async () => {
    console.log("Seeder completed successfully.");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
