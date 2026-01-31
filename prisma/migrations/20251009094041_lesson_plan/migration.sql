-- CreateTable
CREATE TABLE "public"."WeeklyPlan" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "week" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WeeklyPlanItem" (
    "id" TEXT NOT NULL,
    "weeklyPlanId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "lessons" TEXT NOT NULL,
    "pages" TEXT NOT NULL,

    CONSTRAINT "WeeklyPlanItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."WeeklyPlan" ADD CONSTRAINT "WeeklyPlan_classId_fkey" FOREIGN KEY ("classId") REFERENCES "public"."Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WeeklyPlanItem" ADD CONSTRAINT "WeeklyPlanItem_weeklyPlanId_fkey" FOREIGN KEY ("weeklyPlanId") REFERENCES "public"."WeeklyPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WeeklyPlanItem" ADD CONSTRAINT "WeeklyPlanItem_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "public"."Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
