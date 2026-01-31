// app/api/classes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { prisma } from '@/app/utils/prisma';
import { authOptions } from '@/libs/auth';


export const runtime = 'nodejs';



export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const classes = await prisma.class.findMany({
    where: { teachers: { some: { id: session.user.id } } },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(classes, { status: 200 });
}
