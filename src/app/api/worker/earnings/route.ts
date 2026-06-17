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
      include: { trade: true },
    });
    if (!worker) return NextResponse.json({ error: "Worker not found" }, { status: 404 });

    const completedBookings = await prisma.booking.findMany({
      where: { workerId: worker.id, status: "completed" },
      include: { customer: { select: { name: true } } },
      orderBy: { date: "desc" },
    });

    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonthDate = new Date(thisYear, thisMonth - 1, 1);

    let totalEarnings = 0;
    let thisMonthEarnings = 0;
    let lastMonthEarnings = 0;

    const monthMap: Record<string, { count: number; amount: number }> = {};

    for (const b of completedBookings) {
      totalEarnings += b.totalAmount;
      const d = new Date(b.date);
      const m = d.getMonth();
      const y = d.getFullYear();
      if (m === thisMonth && y === thisYear) thisMonthEarnings += b.totalAmount;
      if (m === lastMonthDate.getMonth() && y === lastMonthDate.getFullYear())
        lastMonthEarnings += b.totalAmount;

      const key = `${y}-${String(m + 1).padStart(2, "0")}`;
      if (!monthMap[key]) monthMap[key] = { count: 0, amount: 0 };
      monthMap[key].count++;
      monthMap[key].amount += b.totalAmount;
    }

    const monthlyBreakdown = Object.entries(monthMap)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([key, val]) => {
        const [y, m] = key.split("-");
        const date = new Date(Number(y), Number(m) - 1, 1);
        return {
          key,
          label: date.toLocaleString("default", { month: "long", year: "numeric" }),
          jobs: val.count,
          amount: val.amount,
        };
      });

    const avgPerJob = completedBookings.length > 0 ? totalEarnings / completedBookings.length : 0;

    return NextResponse.json({
      totalEarnings,
      thisMonthEarnings,
      lastMonthEarnings,
      avgPerJob,
      monthlyBreakdown,
      recentPayments: completedBookings.slice(0, 10).map((b) => ({
        id: b.id,
        customerName: b.customer.name,
        tradeName: worker.trade.name,
        date: b.date,
        amount: b.totalAmount,
        description: b.description,
      })),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch earnings" }, { status: 500 });
  }
}
