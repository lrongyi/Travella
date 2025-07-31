-- CreateTable
CREATE TABLE "ContributorsToTrip" (
    "tripId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContributorsToTrip_pkey" PRIMARY KEY ("tripId","userId")
);

-- AddForeignKey
ALTER TABLE "ContributorsToTrip" ADD CONSTRAINT "ContributorsToTrip_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContributorsToTrip" ADD CONSTRAINT "ContributorsToTrip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
