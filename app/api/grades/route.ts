import { prisma } from '@/app/utils/prisma';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    const grades = await prisma.grade.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json(grades, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
