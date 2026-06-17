import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== "worker") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const worker = await prisma.worker.findUnique({ where: { userId: user.id } });
    if (!worker) return NextResponse.json({ error: "Worker not found" }, { status: 404 });

    const availability = await prisma.availability.findMany({
      where: { workerId: worker.id },
      orderBy: { dayOfWeek: "asc" },
    });

    return NextResponse.json({ availability });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== "worker") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const worker = await prisma.worker.findUnique({ where: { userId: user.id } });
    if (!worker) return NextResponse.json({ error: "Worker not found" }, { status: 404 });

    const { slots } = await req.json();

    await prisma.availability.deleteMany({ where: { workerId: worker.id } });

    const created = await prisma.availability.createMany({
      data: slots.map((slot: { dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }) => ({
        workerId: worker.id,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isActive: slot.isActive,
      })),
    });

    return NextResponse.json({ success: true, count: created.count });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update availability" }, { status: 500 });
  }
}
