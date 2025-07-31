-- DropForeignKey
ALTER TABLE "ContributorsToTrip" DROP CONSTRAINT "ContributorsToTrip_tripId_fkey";

-- AddForeignKey
ALTER TABLE "ContributorsToTrip" ADD CONSTRAINT "ContributorsToTrip_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
