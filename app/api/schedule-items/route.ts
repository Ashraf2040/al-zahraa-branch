import { prisma } from "@/app/utils/prisma";
import { NextResponse } from "next/server";

// GET /api/schedule-items?classId=...&weekday=Sunday
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const classId = searchParams.get("classId");
  const weekday = searchParams.get("weekday");

  if (!classId || !weekday) {
    return NextResponse.json(
      { error: "Missing classId or weekday" },
      { status: 400 }
    );
  }

  try {
    // Map weekday name → dayIndex (Sunday = 0, Monday = 1, ...)
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayIndex = days.indexOf(weekday);
    if (dayIndex === -1) {
      return NextResponse.json(
        { error: "Invalid weekday name" },
        { status: 400 }
      );
    }

    // Find the currently active schedule for that class
    const activeSchedule = await prisma.schedule.findFirst({
      where: { classId, isActive: true },
      select: { id: true },
    });

    if (!activeSchedule) {
      return NextResponse.json({ items: [] });
    }

    // Get all schedule items for that class/day
    const scheduleItems = await prisma.scheduleItem.findMany({
      where: {
        scheduleId: activeSchedule.id,
        dayIndex,
      },
      select: {
        id: true,
        subject: { select: { id: true, name: true } },
        teacher: { select: { id: true, name: true, username: true } },
        session: true,
        start: true,
        end: true,
      },
      orderBy: { session: "asc" },
    });

    return NextResponse.json({ items: scheduleItems });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
