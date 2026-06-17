import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [users, workers, bookings, trades, revenue] = await Promise.all([
    prisma.user.count({ where: { role: "customer" } }),
    prisma.worker.count(),
    prisma.booking.count(),
    prisma.trade.count(),
    prisma.payment.aggregate({ where: { status: "paid" }, _sum: { amount: true } }),
  ]);

  const recentBookings = await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { name: true } },
      worker: { include: { user: { select: { name: true } }, trade: { select: { name: true, icon: true } } } },
    },
  });

  return NextResponse.json({
    stats: { users, workers, bookings, trades, revenue: revenue._sum.amount || 0 },
    recentBookings,
  });
}
