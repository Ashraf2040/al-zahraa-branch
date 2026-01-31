-- CreateTable
CREATE TABLE "public"."Substitution" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "dayIndex" INTEGER NOT NULL,
    "session" INTEGER NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "subjectId" TEXT,
    "absentId" TEXT NOT NULL,
    "replacementId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Substitution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Substitution_date_idx" ON "public"."Substitution"("date");

-- CreateIndex
CREATE INDEX "Substitution_absentId_idx" ON "public"."Substitution"("absentId");

-- CreateIndex
CREATE INDEX "Substitution_replacementId_idx" ON "public"."Substitution"("replacementId");

-- AddForeignKey
ALTER TABLE "public"."Substitution" ADD CONSTRAINT "Substitution_classId_fkey" FOREIGN KEY ("classId") REFERENCES "public"."Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Substitution" ADD CONSTRAINT "Substitution_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "public"."Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Substitution" ADD CONSTRAINT "Substitution_absentId_fkey" FOREIGN KEY ("absentId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Substitution" ADD CONSTRAINT "Substitution_replacementId_fkey" FOREIGN KEY ("replacementId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
