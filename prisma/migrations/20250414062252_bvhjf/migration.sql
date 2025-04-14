/*
  Warnings:

  - You are about to drop the column `planId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `paymentId` to the `LodgingTicket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentId` to the `TransportationTicket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentId` to the `TravelTicket` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LodgingTicket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "lodgingId" INTEGER NOT NULL,
    "guestAmount" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "checkInDate" DATETIME NOT NULL,
    "checkOutDate" DATETIME NOT NULL,
    "paymentId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "planId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LodgingTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LodgingTicket_lodgingId_fkey" FOREIGN KEY ("lodgingId") REFERENCES "Lodging" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LodgingTicket_planId_fkey" FOREIGN KEY ("planId") REFERENCES "TravelPlan" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "LodgingTicket_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LodgingTicket" ("checkInDate", "checkOutDate", "createdAt", "guestAmount", "id", "lodgingId", "planId", "status", "totalPrice", "updatedAt", "userId") SELECT "checkInDate", "checkOutDate", "createdAt", "guestAmount", "id", "lodgingId", "planId", "status", "totalPrice", "updatedAt", "userId" FROM "LodgingTicket";
DROP TABLE "LodgingTicket";
ALTER TABLE "new_LodgingTicket" RENAME TO "LodgingTicket";
CREATE TABLE "new_Payment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "paymentType" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "vaNumber" TEXT,
    "amount" INTEGER NOT NULL,
    "paymentStatus" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER,
    CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Payment" ("amount", "bank", "createdAt", "id", "paymentStatus", "paymentType", "updatedAt", "userId", "vaNumber") SELECT "amount", "bank", "createdAt", "id", "paymentStatus", "paymentType", "updatedAt", "userId", "vaNumber" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
CREATE TABLE "new_TransportationTicket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "transportationId" INTEGER NOT NULL,
    "passengerAmount" INTEGER NOT NULL,
    "paymentId" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "departureDateTime" DATETIME NOT NULL,
    "arrivalDateTime" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "planId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TransportationTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TransportationTicket_transportationId_fkey" FOREIGN KEY ("transportationId") REFERENCES "Transportation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TransportationTicket_planId_fkey" FOREIGN KEY ("planId") REFERENCES "TravelPlan" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TransportationTicket_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TransportationTicket" ("arrivalDateTime", "createdAt", "departureDateTime", "id", "passengerAmount", "planId", "status", "totalPrice", "transportationId", "updatedAt", "userId") SELECT "arrivalDateTime", "createdAt", "departureDateTime", "id", "passengerAmount", "planId", "status", "totalPrice", "transportationId", "updatedAt", "userId" FROM "TransportationTicket";
DROP TABLE "TransportationTicket";
ALTER TABLE "new_TransportationTicket" RENAME TO "TransportationTicket";
CREATE TABLE "new_TravelTicket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "travelDestinationId" INTEGER NOT NULL,
    "guestAmount" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "paymentId" INTEGER NOT NULL,
    "visitDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "planId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TravelTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TravelTicket_travelDestinationId_fkey" FOREIGN KEY ("travelDestinationId") REFERENCES "TravelDestination" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TravelTicket_planId_fkey" FOREIGN KEY ("planId") REFERENCES "TravelPlan" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TravelTicket_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TravelTicket" ("createdAt", "guestAmount", "id", "planId", "status", "totalPrice", "travelDestinationId", "updatedAt", "userId", "visitDate") SELECT "createdAt", "guestAmount", "id", "planId", "status", "totalPrice", "travelDestinationId", "updatedAt", "userId", "visitDate" FROM "TravelTicket";
DROP TABLE "TravelTicket";
ALTER TABLE "new_TravelTicket" RENAME TO "TravelTicket";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
