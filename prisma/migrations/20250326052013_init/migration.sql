-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "profilePicture" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TravelPlan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "TravelPlan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "item_id" INTEGER NOT NULL,
    "transactionId" TEXT NOT NULL,
    "paymentType" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "vaNumber" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL,
    CONSTRAINT "Payment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Payment_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "TravelPlan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TravelTicket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "travelId" INTEGER NOT NULL,
    "guestAmount" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "plan_id" INTEGER NOT NULL,
    CONSTRAINT "TravelTicket_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TravelTicket_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "TravelPlan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LodgingTicket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "lodgingId" INTEGER NOT NULL,
    "guestAmount" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "checkinDate" DATETIME NOT NULL,
    "checkoutDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "plan_id" INTEGER NOT NULL,
    CONSTRAINT "LodgingTicket_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LodgingTicket_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "TravelPlan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TransportationTicket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "transportation_id" INTEGER NOT NULL,
    "passengerAmount" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "plan_id" INTEGER NOT NULL,
    CONSTRAINT "TransportationTicket_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TransportationTicket_transportation_id_fkey" FOREIGN KEY ("transportation_id") REFERENCES "Transportation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TransportationTicket_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "TravelPlan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Transportation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pickupLocation" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "pickupTime" DATETIME NOT NULL,
    "arrivalTime" DATETIME NOT NULL,
    "price" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "transportPictureUrl" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Lodging" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "lodgingPictureUrl" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "address" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TravelDestination" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "travelPictureUrl" TEXT NOT NULL,
    "price" INTEGER,
    "location" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionId_key" ON "Payment"("transactionId");
