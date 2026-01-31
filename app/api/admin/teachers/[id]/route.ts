import { prisma } from '@/app/utils/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await req.json();

    const {
      username,
      name,
      password,
      classIds,
      subjectIds,
    }: {
      username?: string;
      name?: string;
      password?: string;
      classIds?: string[];
      subjectIds?: string[];
    } = body ?? {};

    const data: Record<string, any> = {};

    if (typeof username === 'string') data.username = username;
    if (typeof name === 'string')     data.name     = name;

    if (typeof password === 'string' && password.trim().length > 0) {
      data.password = password.trim(); // ← add bcrypt later!
    }

    if (Array.isArray(classIds)) {
      data.classes = { set: classIds.map((id) => ({ id })) };
    }

    if (Array.isArray(subjectIds)) {
      data.subjects = { set: subjectIds.map((id) => ({ id })) };
    }

    const updatedTeacher = await prisma.user.update({
      where: { id },
      data,
      include: {
        classes: true,
        subjects: true,
      },
    });

    return NextResponse.json(updatedTeacher, { status: 200 });
  } catch (err: any) {
    const message = err?.message ?? 'Failed to update teacher';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}