
import { prisma } from '@/app/utils/prisma';
import { NextResponse } from 'next/server';



export async function GET() {
  try {
    const classes = await prisma.class.findMany();
    return NextResponse.json(classes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Class name is required' }, { status: 400 });
    }
    const newClass = await prisma.class.create({
      data: { name },
    });
    return NextResponse.json(newClass);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create class' }, { status: 500 });
  }
}