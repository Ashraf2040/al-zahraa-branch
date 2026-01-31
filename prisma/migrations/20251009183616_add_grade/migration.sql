/*
  Warnings:

  - Added the required column `gradeId` to the `WeeklyPlan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."WeeklyPlan" DROP CONSTRAINT "WeeklyPlan_classId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WeeklyPlanItem" DROP CONSTRAINT "WeeklyPlanItem_weeklyPlanId_fkey";

-- AlterTable
ALTER TABLE "public"."WeeklyPlan" ADD COLUMN     "gradeId" TEXT NOT NULL,
ALTER COLUMN "classId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."Grade" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GradeSubject" (
    "gradeId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,

    CONSTRAINT "GradeSubject_pkey" PRIMARY KEY ("gradeId","subjectId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Grade_name_key" ON "public"."Grade"("name");

-- AddForeignKey
ALTER TABLE "public"."GradeSubject" ADD CONSTRAINT "GradeSubject_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "public"."Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GradeSubject" ADD CONSTRAINT "GradeSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "public"."Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WeeklyPlan" ADD CONSTRAINT "WeeklyPlan_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "public"."Grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WeeklyPlanItem" ADD CONSTRAINT "WeeklyPlanItem_weeklyPlanId_fkey" FOREIGN KEY ("weeklyPlanId") REFERENCES "public"."WeeklyPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
