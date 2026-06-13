import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const worker = await prisma.worker.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true, phone: true, createdAt: true } },
        trade: true,
        availability: { orderBy: { dayOfWeek: "asc" } },
        reviews: {
          include: {
            author: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!worker) {
      return NextResponse.json({ error: "Worker not found" }, { status: 404 });
    }

    return NextResponse.json({ worker });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch worker" }, { status: 500 });
  }
}
