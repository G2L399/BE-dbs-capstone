-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Review" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "travelDestinationId" INTEGER,
    "lodgingId" INTEGER,
    "transportationId" INTEGER,
    CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Review_travelDestinationId_fkey" FOREIGN KEY ("travelDestinationId") REFERENCES "TravelDestination" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Review_lodgingId_fkey" FOREIGN KEY ("lodgingId") REFERENCES "Lodging" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Review_transportationId_fkey" FOREIGN KEY ("transportationId") REFERENCES "Transportation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Review" ("comment", "createdAt", "id", "lodgingId", "rating", "travelDestinationId", "updatedAt", "userId") SELECT "comment", "createdAt", "id", "lodgingId", "rating", "travelDestinationId", "updatedAt", "userId" FROM "Review";
DROP TABLE "Review";
ALTER TABLE "new_Review" RENAME TO "Review";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
