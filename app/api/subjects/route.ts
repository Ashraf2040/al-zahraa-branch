
import { prisma } from '@/app/utils/prisma';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    const classes = await prisma.subject.findMany();
    return NextResponse.json(classes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch subjects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Subject name is required' }, { status: 400 });
    }
    const newClass = await prisma.subject.create({
      data: { name },
    });
    return NextResponse.json(newClass);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create class' }, { status: 500 });
  }
}