import { prisma } from '@/app/utils/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  try {
    const gs = await prisma.gradeSubject.findMany({
      where: { gradeId: id },
      include: { subject: true },
      orderBy: { subjectId: 'asc' },
    });
    const subjects = gs.map((x) => x.subject);
    return NextResponse.json(subjects, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
