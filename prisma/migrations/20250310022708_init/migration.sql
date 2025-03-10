-- CreateEnum
CREATE TYPE "StatusEnum" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TransportTypeEnum" AS ENUM ('BUS', 'TRAIN', 'FLIGHT', 'CAR');

-- CreateEnum
CREATE TYPE "BankEnum" AS ENUM ('BCA', 'MANDIRI', 'BNI', 'BRI', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "profilePicture" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TravelPlan" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "status" "StatusEnum" NOT NULL,

    CONSTRAINT "TravelPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "transactionId" TEXT NOT NULL,
    "paymentType" TEXT NOT NULL,
    "bank" "BankEnum" NOT NULL,
    "vaNumber" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TravelTicket" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "travelId" INTEGER NOT NULL,
    "guestAmount" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "status" "StatusEnum" NOT NULL,
    "plan_id" INTEGER NOT NULL,

    CONSTRAINT "TravelTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LodgingTicket" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "lodgingId" INTEGER NOT NULL,
    "guestAmount" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "checkinDate" TIMESTAMP(3) NOT NULL,
    "checkoutDate" TIMESTAMP(3) NOT NULL,
    "status" "StatusEnum" NOT NULL,
    "plan_id" INTEGER NOT NULL,

    CONSTRAINT "LodgingTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransportationTicket" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "transportation_id" INTEGER NOT NULL,
    "passengerAmount" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "status" "StatusEnum" NOT NULL,
    "plan_id" INTEGER NOT NULL,

    CONSTRAINT "TransportationTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transportation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pickupLocation" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "pickupTime" TIMESTAMP(3) NOT NULL,
    "arrivalTime" TIMESTAMP(3) NOT NULL,
    "price" INTEGER NOT NULL,
    "type" "TransportTypeEnum" NOT NULL,
    "transportPictureUrl" TEXT NOT NULL,

    CONSTRAINT "Transportation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lodging" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "lodgingPictureUrl" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Lodging_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TravelDestination" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "travelPictureUrl" TEXT NOT NULL,
    "price" INTEGER,
    "location" TEXT NOT NULL,

    CONSTRAINT "TravelDestination_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionId_key" ON "Payment"("transactionId");

-- AddForeignKey
ALTER TABLE "TravelPlan" ADD CONSTRAINT "TravelPlan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "TravelPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelTicket" ADD CONSTRAINT "TravelTicket_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelTicket" ADD CONSTRAINT "TravelTicket_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "TravelPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LodgingTicket" ADD CONSTRAINT "LodgingTicket_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LodgingTicket" ADD CONSTRAINT "LodgingTicket_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "TravelPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportationTicket" ADD CONSTRAINT "TransportationTicket_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportationTicket" ADD CONSTRAINT "TransportationTicket_transportation_id_fkey" FOREIGN KEY ("transportation_id") REFERENCES "Transportation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransportationTicket" ADD CONSTRAINT "TransportationTicket_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "TravelPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
