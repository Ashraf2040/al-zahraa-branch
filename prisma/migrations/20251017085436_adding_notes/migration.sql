-- AlterTable
ALTER TABLE "public"."WeeklyPlan" ADD COLUMN     "dictation" TEXT,
ADD COLUMN     "note" TEXT;

-- AlterTable
ALTER TABLE "public"."WeeklyPlanItem" ADD COLUMN     "classwork" TEXT,
ADD COLUMN     "dictation" TEXT,
ADD COLUMN     "homework" TEXT;
