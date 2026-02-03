import { prisma } from '@/app/utils/prisma';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const teachers = await prisma.user.findMany({
      where: { role: 'TEACHER' },
      include: { classes: true, subjects: true },
    });
    return NextResponse.json(teachers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch teachers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, name, arabicName, password, classIds, subjectIds, role } = body;

    if (!username || !name || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Optional: you can add more validation
    // if (role !== 'TEACHER') return NextResponse.json({ error: 'Invalid role' }, { status: 400 });

    const teacher = await prisma.user.create({
      data: {
        username,
        name,
        arabicName: arabicName?.trim() || null,  
        password,                                 
        role,
        ...(Array.isArray(classIds) && classIds.length
          ? { classes: { connect: classIds.map((id: string) => ({ id })) } }
          : {}),
        ...(Array.isArray(subjectIds) && subjectIds.length
          ? { subjects: { connect: subjectIds.map((id: string) => ({ id })) } }
          : {}),
      },
      include: { classes: true, subjects: true },
    });

    return NextResponse.json(teacher);
  } catch (error: any) {
    console.error(error);
    const message = error?.code === 'P2002'
      ? 'Username already exists'
      : 'Failed to create teacher';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}