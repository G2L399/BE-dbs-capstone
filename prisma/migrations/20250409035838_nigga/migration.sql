/*
  Warnings:

  - You are about to drop the column `price` on the `Lodging` table. All the data in the column will be lost.
  - You are about to drop the column `checkinDate` on the `LodgingTicket` table. All the data in the column will be lost.
  - You are about to drop the column `checkoutDate` on the `LodgingTicket` table. All the data in the column will be lost.
  - You are about to drop the column `plan_id` on the `LodgingTicket` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `LodgingTicket` table. All the data in the column will be lost.
  - You are about to drop the column `item_id` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Transportation` table. All the data in the column will be lost.
  - You are about to drop the column `plan_id` on the `TransportationTicket` table. All the data in the column will be lost.
  - You are about to drop the column `transportation_id` on the `TransportationTicket` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `TransportationTicket` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `TravelDestination` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `TravelPlan` table. All the data in the column will be lost.
  - You are about to drop the column `plan_id` on the `TravelTicket` table. All the data in the column will be lost.
  - You are about to drop the column `travelId` on the `TravelTicket` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `TravelTicket` table. All the data in the column will be lost.
  - Added the required column `pricePerNight` to the `Lodging` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Lodging` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkInDate` to the `LodgingTicket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkOutDate` to the `LodgingTicket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `LodgingTicket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `LodgingTicket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `basePrice` to the `Transportation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Transportation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `arrivalDateTime` to the `TransportationTicket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departureDateTime` to the `TransportationTicket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transportationId` to the `TransportationTicket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TransportationTicket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `TransportationTicket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TravelDestination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TravelPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `TravelPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `travelDestinationId` to the `TravelTicket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TravelTicket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `TravelTicket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Review" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "travelDestinationId" INTEGER,
    "lodgingId" INTEGER,
    CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Review_travelDestinationId_fkey" FOREIGN KEY ("travelDestinationId") REFERENCES "TravelDestination" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Review_lodgingId_fkey" FOREIGN KEY ("lodgingId") REFERENCES "Lodging" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_UserWishlistLodgings" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_UserWishlistLodgings_A_fkey" FOREIGN KEY ("A") REFERENCES "Lodging" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserWishlistLodgings_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_UserWishlistDestinations" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_UserWishlistDestinations_A_fkey" FOREIGN KEY ("A") REFERENCES "TravelDestination" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserWishlistDestinations_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_DestinationCategories" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_DestinationCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_DestinationCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "TravelDestination" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_LodgingCategories" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_LodgingCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_LodgingCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "Lodging" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lodging" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "lodgingPictureUrl" TEXT,
    "pricePerNight" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT,
    "country" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "propertyType" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Lodging" ("address", "description", "id", "lodgingPictureUrl", "name") SELECT "address", "description", "id", "lodgingPictureUrl", "name" FROM "Lodging";
DROP TABLE "Lodging";
ALTER TABLE "new_Lodging" RENAME TO "Lodging";
CREATE TABLE "new_LodgingTicket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "lodgingId" INTEGER NOT NULL,
    "guestAmount" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "checkInDate" DATETIME NOT NULL,
    "checkOutDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "planId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LodgingTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LodgingTicket_lodgingId_fkey" FOREIGN KEY ("lodgingId") REFERENCES "Lodging" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LodgingTicket_planId_fkey" FOREIGN KEY ("planId") REFERENCES "TravelPlan" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_LodgingTicket" ("guestAmount", "id", "lodgingId", "status", "totalPrice") SELECT "guestAmount", "id", "lodgingId", "status", "totalPrice" FROM "LodgingTicket";
DROP TABLE "LodgingTicket";
ALTER TABLE "new_LodgingTicket" RENAME TO "LodgingTicket";
CREATE TABLE "new_Payment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "planId" INTEGER NOT NULL,
    "transactionId" TEXT NOT NULL,
    "paymentType" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "vaNumber" TEXT,
    "amount" INTEGER NOT NULL,
    "paymentStatus" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Payment_planId_fkey" FOREIGN KEY ("planId") REFERENCES "TravelPlan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Payment" ("bank", "id", "paymentStatus", "paymentType", "transactionId", "vaNumber") SELECT "bank", "id", "paymentStatus", "paymentType", "transactionId", "vaNumber" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
CREATE UNIQUE INDEX "Payment_transactionId_key" ON "Payment"("transactionId");
CREATE TABLE "new_Transportation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "company" TEXT,
    "pickupLocation" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "pickupTime" DATETIME,
    "arrivalTime" DATETIME,
    "basePrice" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "transportPictureUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Transportation" ("arrivalTime", "description", "destination", "id", "name", "pickupLocation", "pickupTime", "transportPictureUrl", "type") SELECT "arrivalTime", "description", "destination", "id", "name", "pickupLocation", "pickupTime", "transportPictureUrl", "type" FROM "Transportation";
DROP TABLE "Transportation";
ALTER TABLE "new_Transportation" RENAME TO "Transportation";
CREATE TABLE "new_TransportationTicket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "transportationId" INTEGER NOT NULL,
    "passengerAmount" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "departureDateTime" DATETIME NOT NULL,
    "arrivalDateTime" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "planId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TransportationTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TransportationTicket_transportationId_fkey" FOREIGN KEY ("transportationId") REFERENCES "Transportation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TransportationTicket_planId_fkey" FOREIGN KEY ("planId") REFERENCES "TravelPlan" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_TransportationTicket" ("id", "passengerAmount", "status", "totalPrice") SELECT "id", "passengerAmount", "status", "totalPrice" FROM "TransportationTicket";
DROP TABLE "TransportationTicket";
ALTER TABLE "new_TransportationTicket" RENAME TO "TransportationTicket";
CREATE TABLE "new_TravelDestination" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "travelPictureUrl" TEXT,
    "price" INTEGER,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "openingHours" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_TravelDestination" ("description", "id", "name", "price", "travelPictureUrl") SELECT "description", "id", "name", "price", "travelPictureUrl" FROM "TravelDestination";
DROP TABLE "TravelDestination";
ALTER TABLE "new_TravelDestination" RENAME TO "TravelDestination";
CREATE TABLE "new_TravelPlan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "name" TEXT,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "totalPrice" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TravelPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TravelPlan" ("id", "status", "totalPrice") SELECT "id", "status", "totalPrice" FROM "TravelPlan";
DROP TABLE "TravelPlan";
ALTER TABLE "new_TravelPlan" RENAME TO "TravelPlan";
CREATE TABLE "new_TravelTicket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "travelDestinationId" INTEGER NOT NULL,
    "guestAmount" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "visitDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "planId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TravelTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TravelTicket_travelDestinationId_fkey" FOREIGN KEY ("travelDestinationId") REFERENCES "TravelDestination" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TravelTicket_planId_fkey" FOREIGN KEY ("planId") REFERENCES "TravelPlan" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_TravelTicket" ("guestAmount", "id", "status", "totalPrice") SELECT "guestAmount", "id", "status", "totalPrice" FROM "TravelTicket";
DROP TABLE "TravelTicket";
ALTER TABLE "new_TravelTicket" RENAME TO "TravelTicket";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "profilePicture" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("email", "id", "password", "profilePicture", "username") SELECT "email", "id", "password", "profilePicture", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_UserWishlistLodgings_AB_unique" ON "_UserWishlistLodgings"("A", "B");

-- CreateIndex
CREATE INDEX "_UserWishlistLodgings_B_index" ON "_UserWishlistLodgings"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserWishlistDestinations_AB_unique" ON "_UserWishlistDestinations"("A", "B");

-- CreateIndex
CREATE INDEX "_UserWishlistDestinations_B_index" ON "_UserWishlistDestinations"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DestinationCategories_AB_unique" ON "_DestinationCategories"("A", "B");

-- CreateIndex
CREATE INDEX "_DestinationCategories_B_index" ON "_DestinationCategories"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LodgingCategories_AB_unique" ON "_LodgingCategories"("A", "B");

-- CreateIndex
CREATE INDEX "_LodgingCategories_B_index" ON "_LodgingCategories"("B");
