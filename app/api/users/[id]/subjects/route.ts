// app/api/users/[id]/subjects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
// Use the correct path for your project; absolute alias is recommended

import { prisma } from '@/app/utils/prisma';
import { authOptions } from '@/libs/auth';


export const runtime = 'nodejs';



// Next.js 15+ can pass params as a Promise; await it before use.
type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params; // await params per Next.js guidance
  if (session.user.id !== id && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Either fetch via user.include or directly via relation filter; both are valid.
  const user = await prisma.user.findUnique({
    where: { id },
    include: { subjects: true },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user.subjects, { status: 200 });
}
