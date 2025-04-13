-- AlterTable
ALTER TABLE "TravelDestination" ADD COLUMN "avg_rating" REAL;

-- CreateTable
CREATE TABLE "Preferences" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "transportationId" INTEGER NOT NULL,
    "lodgingId" INTEGER NOT NULL,
    "travelDestinationId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Preferences_transportationId_fkey" FOREIGN KEY ("transportationId") REFERENCES "Transportation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Preferences_lodgingId_fkey" FOREIGN KEY ("lodgingId") REFERENCES "Lodging" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Preferences_travelDestinationId_fkey" FOREIGN KEY ("travelDestinationId") REFERENCES "TravelDestination" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
