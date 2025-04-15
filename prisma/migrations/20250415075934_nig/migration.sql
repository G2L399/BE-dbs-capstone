/*
  Warnings:

  - You are about to drop the column `planId` on the `LodgingTicket` table. All the data in the column will be lost.
  - You are about to drop the column `planId` on the `TransportationTicket` table. All the data in the column will be lost.
  - You are about to drop the column `planId` on the `TravelTicket` table. All the data in the column will be lost.

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
    "paymentId" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LodgingTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LodgingTicket_lodgingId_fkey" FOREIGN KEY ("lodgingId") REFERENCES "Lodging" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LodgingTicket_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_LodgingTicket" ("checkInDate", "checkOutDate", "createdAt", "guestAmount", "id", "lodgingId", "paymentId", "status", "totalPrice", "updatedAt", "userId") SELECT "checkInDate", "checkOutDate", "createdAt", "guestAmount", "id", "lodgingId", "paymentId", "status", "totalPrice", "updatedAt", "userId" FROM "LodgingTicket";
DROP TABLE "LodgingTicket";
ALTER TABLE "new_LodgingTicket" RENAME TO "LodgingTicket";
CREATE TABLE "new_TransportationTicket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "transportationId" INTEGER NOT NULL,
    "passengerAmount" INTEGER NOT NULL,
    "paymentId" INTEGER,
    "totalPrice" INTEGER NOT NULL,
    "departureDateTime" DATETIME NOT NULL,
    "arrivalDateTime" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TransportationTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TransportationTicket_transportationId_fkey" FOREIGN KEY ("transportationId") REFERENCES "Transportation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TransportationTicket_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_TransportationTicket" ("arrivalDateTime", "createdAt", "departureDateTime", "id", "passengerAmount", "paymentId", "status", "totalPrice", "transportationId", "updatedAt", "userId") SELECT "arrivalDateTime", "createdAt", "departureDateTime", "id", "passengerAmount", "paymentId", "status", "totalPrice", "transportationId", "updatedAt", "userId" FROM "TransportationTicket";
DROP TABLE "TransportationTicket";
ALTER TABLE "new_TransportationTicket" RENAME TO "TransportationTicket";
CREATE TABLE "new_TravelPlan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "name" TEXT,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "totalPrice" INTEGER NOT NULL,
    "travelTicketId" INTEGER,
    "lodgingTicketId" INTEGER,
    "transportationTicketId" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TravelPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TravelPlan_travelTicketId_fkey" FOREIGN KEY ("travelTicketId") REFERENCES "TravelTicket" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TravelPlan_lodgingTicketId_fkey" FOREIGN KEY ("lodgingTicketId") REFERENCES "LodgingTicket" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "TravelPlan_transportationTicketId_fkey" FOREIGN KEY ("transportationTicketId") REFERENCES "TransportationTicket" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_TravelPlan" ("createdAt", "endDate", "id", "name", "startDate", "status", "totalPrice", "updatedAt", "userId") SELECT "createdAt", "endDate", "id", "name", "startDate", "status", "totalPrice", "updatedAt", "userId" FROM "TravelPlan";
DROP TABLE "TravelPlan";
ALTER TABLE "new_TravelPlan" RENAME TO "TravelPlan";
CREATE TABLE "new_TravelTicket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "travelDestinationId" INTEGER NOT NULL,
    "guestAmount" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "paymentId" INTEGER,
    "visitDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TravelTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TravelTicket_travelDestinationId_fkey" FOREIGN KEY ("travelDestinationId") REFERENCES "TravelDestination" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TravelTicket_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_TravelTicket" ("createdAt", "guestAmount", "id", "paymentId", "status", "totalPrice", "travelDestinationId", "updatedAt", "userId", "visitDate") SELECT "createdAt", "guestAmount", "id", "paymentId", "status", "totalPrice", "travelDestinationId", "updatedAt", "userId", "visitDate" FROM "TravelTicket";
DROP TABLE "TravelTicket";
ALTER TABLE "new_TravelTicket" RENAME TO "TravelTicket";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
