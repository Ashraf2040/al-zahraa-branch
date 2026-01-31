import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { prisma } from '@/app/utils/prisma';
import { authOptions } from '@/libs/auth';


export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { classId, name, items } = body || {};
  if (!classId || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Missing classId or items' }, { status: 400 });
  }

  try {
    const created = await prisma.$transaction(async (tx) => {
      // ✅ Deactivate all previous schedules for this class
      await tx.schedule.updateMany({
        where: { 
          classId, 
          isActive: true 
        },
        data: { isActive: false },
      });

      // Create new active schedule
      const schedule = await tx.schedule.create({
        data: {
          classId,
          name: name ?? null,
          createdBy: session.user.id,
          isActive: true,  // ✅ Mark as active
        },
      });

      // Create schedule items
      await tx.scheduleItem.createMany({
        data: items.map((it: any) => ({
          scheduleId: schedule.id,
          dayIndex: it.dayIndex,
          session: it.session,
          start: it.start,
          end: it.end,
          subjectId: it.subjectId,
          teacherId: it.teacherId,
        })),
      });

      return schedule;
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Failed to create schedule:', error);
    return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const classId = searchParams.get('classId') || undefined;
  const teacherId = searchParams.get('teacherId') || undefined;

  try {
    // ✅ Special handling for teacher view
    if (teacherId && !classId) {
      const allSchedules = await prisma.schedule.findMany({
        where: {
          isActive: true,  // ✅ Only active schedules
          items: { some: { teacherId } },
        },
        include: {
          class: true,
          items: { 
            where: { teacherId },  // ✅ Only items for this teacher
            include: { subject: true, teacher: true } 
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // ✅ Keep only the most recent schedule per classId (extra safety)
      const uniqueSchedules = new Map<string, typeof allSchedules[0]>();
      for (const schedule of allSchedules) {
        if (!uniqueSchedules.has(schedule.classId)) {
          uniqueSchedules.set(schedule.classId, schedule);
        }
      }

      return NextResponse.json(Array.from(uniqueSchedules.values()));
    }

    // ✅ Regular class view
    const schedules = await prisma.schedule.findMany({
      where: {
        classId,
        isActive: true,  // ✅ Only active schedules
        items: teacherId ? { some: { teacherId } } : undefined,
      },
      include: {
        class: true,
        items: { include: { subject: true, teacher: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(schedules);
  } catch (error) {
    console.error('Failed to fetch schedules:', error);
    return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 });
  }
}
