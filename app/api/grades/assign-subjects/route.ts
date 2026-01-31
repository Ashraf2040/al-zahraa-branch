import { prisma } from '@/app/utils/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
  try {
    const { gradeId, subjectIds } = await req.json();

    if (!gradeId || !Array.isArray(subjectIds) || subjectIds.length === 0) {
      return NextResponse.json({ error: 'gradeId and subjectIds[] are required' }, { status: 400 });
    }

    // Validate grade exists
    const grade = await prisma.grade.findUnique({ where: { id: gradeId } });
    if (!grade) return NextResponse.json({ error: 'Grade not found' }, { status: 404 });

    // Remove duplicates and build upserts
    const uniq = Array.from(new Set(subjectIds as string[]));

    // Create missing links; ignore ones that already exist
    await prisma.$transaction(
      uniq.map((sid) =>
        prisma.gradeSubject.upsert({
          where: { gradeId_subjectId: { gradeId, subjectId: sid } },
          update: {},
          create: { gradeId, subjectId: sid },
        })
      )
    );

    // Return current subjects for this grade
    const rows = await prisma.gradeSubject.findMany({
      where: { gradeId },
      include: { subject: true },
      orderBy: { subjectId: 'asc' },
    });
    const subjects = rows.map((r) => r.subject);

    return NextResponse.json({ ok: true, gradeId, subjects }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
