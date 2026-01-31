/*
  Warnings:

  - You are about to drop the column `startDate` on the `WeeklyPlan` table. All the data in the column will be lost.
  - Added the required column `fromDate` to the `WeeklyPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toDate` to the `WeeklyPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."WeeklyPlan" DROP COLUMN "startDate",
ADD COLUMN     "fromDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "toDate" TIMESTAMP(3) NOT NULL;
