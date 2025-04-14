-- CreateTable
CREATE TABLE "Rooms" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lodgingId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Rooms_lodgingId_fkey" FOREIGN KEY ("lodgingId") REFERENCES "Lodging" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
