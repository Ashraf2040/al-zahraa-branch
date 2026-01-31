/*
  Warnings:

  - You are about to drop the column `classId` on the `WeeklyPlan` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."WeeklyPlan" DROP CONSTRAINT "WeeklyPlan_gradeId_fkey";

-- AlterTable
ALTER TABLE "public"."WeeklyPlan" DROP COLUMN "classId",
ALTER COLUMN "gradeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."WeeklyPlan" ADD CONSTRAINT "WeeklyPlan_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "public"."Grade"("id") ON DELETE SET NULL ON UPDATE CASCADE;
