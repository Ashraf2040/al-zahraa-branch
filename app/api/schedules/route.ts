// app/api/schedules/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/app/utils/prisma';
export async function GET() {
  try {
    const schedules = await prisma.schedule.findMany({
      include: {
        items: {
          select: { dayIndex: true, subjectId: true },
        },
        class: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = schedules.map((s) => ({
      id: s.id,
      classId: s.classId,
      className: s.class.name,
      isActive: s.isActive,
      createdAt: s.createdAt.toISOString(),
      items: s.items,
    }));

    return NextResponse.json({ schedules: formatted });
  } catch (error) {
    console.error('GET /api/schedules error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedules' },
      { status: 500 }
    );
  }
}