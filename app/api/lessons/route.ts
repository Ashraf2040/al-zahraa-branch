import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { prisma } from '@/app/utils/prisma';
import { authOptions } from '@/libs/auth';


export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const {
    classId,
    subjectId,
    date,
    unit,
    lesson,
    pages,
    objective,
    homework,
    comments,
  } = await req.json();

  if (!classId || !subjectId || !date || !unit || !lesson || !pages || !objective) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Build a full UTC day window for the submitted date (prevents TZ mismatches)
  const dayIso = new Date(date).toISOString().slice(0, 10); // expects date like YYYY-MM-DD or ISO
  const start = new Date(`${dayIso}T00:00:00.000Z`);
  const end = new Date(`${dayIso}T23:59:59.999Z`);

  // Guard: one lesson per teacher + class + subject per day
  const exists = await prisma.lesson.findFirst({
    where: {
      teacherId: session.user.id,
      classId,
      subjectId,
      date: { gte: start, lte: end },
    },
  });

  if (exists) {
    return NextResponse.json(
      { error: 'You already submitted a lesson for this class, subject, and date.' },
      { status: 409 }
    );
  }

  const created = await prisma.lesson.create({
    data: {
      teacherId: session.user.id,
      classId,
      subjectId,
      date: new Date(date),
      unit,
      pages,
      lesson,
      objective,
      homework,
      comments,
    },
    include: { class: true, subject: true },
  });

  return NextResponse.json(created, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const classId = searchParams.get('classId');
  const date = searchParams.get('date');

  try {
    const lessons = await prisma.lesson.findMany({
      where: {
        classId: classId || undefined,
        date: date ? { gte: new Date(date), lte: new Date(date) } : undefined,
      },
      include: { teacher: true, class: true, subject: true },
    });
    return NextResponse.json(lessons);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 });
  }
}