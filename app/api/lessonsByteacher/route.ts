// app/api/lessons/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/app/utils/prisma';
import { authOptions } from '@/libs/auth';


export const runtime = 'nodejs';
// Secure "mine" endpoint (recommended): GET /api/lessons?date=YYYY-MM-DD
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const dateStr = searchParams.get('date') ?? '';
  if (!dateStr) {
    return NextResponse.json({ error: 'date is required' }, { status: 400 });
  }

  const start = new Date(`${dateStr}T00:00:00.000Z`);
  const end = new Date(`${dateStr}T23:59:59.999Z`);

  const lessons = await prisma.lesson.findMany({
    where: {
      teacherId: session.user.id,               // must be this teacher
      date: { gte: start, lte: end },           // today only
      subject: { teachers: { some: { id: session.user.id } } }, // subject is taught by this teacher
    },
    include: { class: true, subject: true },
    orderBy: [{ date: 'asc' }, { id: 'asc' }],
  });

  return NextResponse.json(lessons, { status: 200 });
}
