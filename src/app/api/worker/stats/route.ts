import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== "worker") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const worker = await prisma.worker.findUnique({
      where: { userId: user.id },
    });
    if (!worker) return NextResponse.json({ error: "Worker not found" }, { status: 404 });

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const [completedCount, pendingCount, weekBookings, nextJobRaw, recentActivityRaw] =
      await Promise.all([
        prisma.booking.count({ where: { workerId: worker.id, status: "completed" } }),
        prisma.booking.count({ where: { workerId: worker.id, status: "pending" } }),
        prisma.booking.findMany({
          where: { workerId: worker.id, status: "completed", date: { gte: startOfWeek } },
          select: { totalAmount: true },
        }),
        prisma.booking.findFirst({
          where: { workerId: worker.id, status: "confirmed", date: { gte: now } },
          orderBy: { date: "asc" },
          include: {
            customer: { select: { name: true } },
          },
        }),
        prisma.booking.findMany({
          where: { workerId: worker.id },
          orderBy: { updatedAt: "desc" },
          take: 5,
          include: {
            customer: { select: { name: true } },
          },
        }),
      ]);

    const thisWeekEarnings = weekBookings.reduce((s, b) => s + b.totalAmount, 0);

    return NextResponse.json({
      completedJobs: completedCount,
      pendingJobs: pendingCount,
      thisWeekEarnings,
      rating: worker.rating,
      reviewCount: worker.reviewCount,
      nextJob: nextJobRaw
        ? {
            id: nextJobRaw.id,
            date: nextJobRaw.date,
            startTime: nextJobRaw.startTime,
            endTime: nextJobRaw.endTime,
            customerName: nextJobRaw.customer.name,
            address: nextJobRaw.address,
            city: nextJobRaw.city,
            description: nextJobRaw.description,
          }
        : null,
      recentActivity: recentActivityRaw.map((b) => ({
        id: b.id,
        status: b.status,
        date: b.date,
        totalAmount: b.totalAmount,
        customerName: b.customer.name,
        description: b.description,
      })),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
