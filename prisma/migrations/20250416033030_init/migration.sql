-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "profilePicture" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

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

-- CreateTable
CREATE TABLE "TravelPlan" (
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

-- CreateTable
CREATE TABLE "TravelTicket" (
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

-- CreateTable
CREATE TABLE "LodgingTicket" (
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

-- CreateTable
CREATE TABLE "TransportationTicket" (
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

-- CreateTable
CREATE TABLE "Transportation" (
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

-- CreateTable
CREATE TABLE "Lodging" (
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

-- CreateTable
CREATE TABLE "Rooms" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lodgingId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "roomPictureUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Rooms_lodgingId_fkey" FOREIGN KEY ("lodgingId") REFERENCES "Lodging" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TravelDestination" (
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
    "category" TEXT,
    "openingHours" TEXT,
    "avg_rating" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Payment" (
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
    "transportationId" INTEGER,
    CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Review_travelDestinationId_fkey" FOREIGN KEY ("travelDestinationId") REFERENCES "TravelDestination" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Review_lodgingId_fkey" FOREIGN KEY ("lodgingId") REFERENCES "Lodging" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Review_transportationId_fkey" FOREIGN KEY ("transportationId") REFERENCES "Transportation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
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

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_UserWishlistLodgings_AB_unique" ON "_UserWishlistLodgings"("A", "B");

-- CreateIndex
CREATE INDEX "_UserWishlistLodgings_B_index" ON "_UserWishlistLodgings"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserWishlistDestinations_AB_unique" ON "_UserWishlistDestinations"("A", "B");

-- CreateIndex
CREATE INDEX "_UserWishlistDestinations_B_index" ON "_UserWishlistDestinations"("B");
