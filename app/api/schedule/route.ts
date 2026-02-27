// app/api/schedule/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/utils/prisma';
import { getToken } from 'next-auth/jwt';

type IncomingSchedule = {
  [dayIndex: string]: string[];
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const classId = searchParams.get('classId');

  if (!classId) {
    return NextResponse.json(
      { error: 'Missing classId query parameter' },
      { status: 400 }
    );
  }

  try {
    const schedule = await prisma.schedule.findFirst({
      where: { classId, isActive: true },
      include: {
        items: {
          select: { dayIndex: true, subjectId: true },
        },
      },
    });

    const result: { [key: number]: string[] } = {};

    if (schedule) {
      for (const item of schedule.items) {
        if (!result[item.dayIndex]) result[item.dayIndex] = [];
        if (!result[item.dayIndex].includes(item.subjectId)) {
          result[item.dayIndex].push(item.subjectId);
        }
      }
    }

    return NextResponse.json({ schedule: result });
  } catch (error) {
    console.error('GET /api/schedule error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedule' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Get logged-in user
    const token = await getToken({ req });

    if (!token?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const createdBy = token.sub;

    // 2️⃣ Parse body
    const body = await req.json();
    const { classId, schedule } = body as {
      classId: string;
      schedule: IncomingSchedule;
    };

    if (!classId || !schedule) {
      return NextResponse.json(
        { error: 'Missing required fields: classId, schedule' },
        { status: 400 }
      );
    }

    // 3️⃣ Validate class
    const classObj = await prisma.class.findUnique({
      where: { id: classId },
      select: { name: true },
    });

    if (!classObj) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    // 4️⃣ Validate user
    const user = await prisma.user.findUnique({
      where: { id: createdBy },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 5️⃣ Deactivate old schedules
    await prisma.schedule.updateMany({
      where: { classId, isActive: true },
      data: { isActive: false },
    });

    // 6️⃣ Build schedule items (WITH TEACHER)
    const itemsToCreate: any[] = [];

    for (const [dayIndexStr, subjectIds] of Object.entries(schedule)) {
      const dayIndex = parseInt(dayIndexStr, 10);

      if (isNaN(dayIndex) || !Array.isArray(subjectIds)) continue;

      for (const subjectId of subjectIds) {
        const subject = await prisma.subject.findUnique({
          where: { id: subjectId },
          select: {
            teachers: {
              select: { id: true },
              take: 1,
            },
          },
        });

        if (!subject || subject.teachers.length === 0) {
          throw new Error(`No teacher assigned to subject ${subjectId}`);
        }

        const teacherId = subject.teachers[0].id;

        itemsToCreate.push({
          dayIndex,
          session: 0,
          start: '08:00',
          end: '09:00',
          subject: {
            connect: { id: subjectId },
          },
          teacher: {
            connect: { id: teacherId },
          },
        });
      }
    }

    // 7️⃣ Create schedule
    const newSchedule = await prisma.schedule.create({
      data: {
        classId,
        name: `${classObj.name} Schedule`,
        isActive: true,
        createdBy: user.id,
        items: {
          create: itemsToCreate,
        },
      },
    });

    return NextResponse.json(
      { ok: true, schedule: newSchedule },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('POST /api/schedule error:', error);

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// =======================
// === DELETE schedule
// =======================
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Missing schedule ID' },
      { status: 400 }
    );
  }

  try {
    const schedule = await prisma.schedule.findUnique({
      where: { id },
    });

    if (!schedule) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      );
    }

    await prisma.schedule.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('DELETE /api/schedule error:', error);
    return NextResponse.json(
      { error: 'Failed to delete schedule' },
      { status: 500 }
    );
  }
}