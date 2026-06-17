import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedDatabase } from "@/lib/seed";

export async function GET(req: NextRequest) {
  return POST(req);
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const reset = searchParams.get("reset") === "true";

    if (reset) {
      // Wipe all data in correct order
      await prisma.notification.deleteMany();
      await prisma.payment.deleteMany();
      await prisma.review.deleteMany();
      await prisma.booking.deleteMany();
      await prisma.availability.deleteMany();
      await prisma.worker.deleteMany();
      await prisma.trade.deleteMany();
      await prisma.user.deleteMany();
    }

    await seedDatabase();
    const trades = await prisma.trade.count();
    const workers = await prisma.worker.count();
    const users = await prisma.user.count();
    return NextResponse.json({ message: "Database seeded successfully", stats: { trades, workers, users } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Seed failed", detail: String(error) }, { status: 500 });
  }
}
