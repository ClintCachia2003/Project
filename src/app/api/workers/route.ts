import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tradeSlug = searchParams.get("trade");
    const tradeId = searchParams.get("tradeId");
    const search = searchParams.get("search");
    const minRating = searchParams.get("minRating");
    const maxRate = searchParams.get("maxRate");
    const sortBy = searchParams.get("sortBy") || "rating";

    const where: Record<string, unknown> = { isAvailable: true };

    if (tradeId) where.tradeId = tradeId;
    if (tradeSlug) {
      const trade = await prisma.trade.findUnique({ where: { slug: tradeSlug } });
      if (trade) where.tradeId = trade.id;
    }
    if (minRating) where.rating = { gte: parseFloat(minRating) };
    if (maxRate) where.hourlyRate = { lte: parseFloat(maxRate) };
    if (search) {
      where.user = { name: { contains: search } };
    }

    const orderBy: Record<string, string> =
      sortBy === "price" ? { hourlyRate: "asc" } :
      sortBy === "experience" ? { yearsExperience: "desc" } :
      sortBy === "jobs" ? { completedJobs: "desc" } :
      { rating: "desc" };

    const workers = await prisma.worker.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true, phone: true } },
        trade: true,
        availability: true,
        _count: { select: { reviews: true } },
      },
      orderBy,
    });

    return NextResponse.json({ workers });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch workers" }, { status: 500 });
  }
}
