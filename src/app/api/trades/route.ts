import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const trades = await prisma.trade.findMany({
      include: {
        _count: { select: { workers: true } },
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ trades });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch trades" }, { status: 500 });
  }
}
