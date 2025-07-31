/*
  Warnings:

  - You are about to drop the column `long` on the `Location` table. All the data in the column will be lost.
  - Added the required column `arrivalTime` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lng` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Location" DROP COLUMN "long",
ADD COLUMN     "arrivalTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "icon" TEXT NOT NULL,
ADD COLUMN     "lng" DOUBLE PRECISION NOT NULL;
