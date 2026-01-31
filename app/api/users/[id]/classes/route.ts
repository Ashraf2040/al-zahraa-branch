// app/api/users/[id]/classes/route.ts
import { prisma } from '@/app/utils/prisma';
import { NextResponse } from 'next/server';


export async function GET(
  req: Request,
  // 1. Update the type definition to indicate params is a Promise
  { params }: { params: Promise<{ id: string }> }
) {
  // 2. Await params before destructuring
  const { id } = await params;

  const classes = await prisma.class.findMany({
    where: { teachers: { some: { id } } },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(classes);
} 