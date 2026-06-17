import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (user.role === "admin") {
      const disputes = await prisma.dispute.findMany({
        include: {
          booking: {
            include: {
              customer: { select: { id: true, name: true, email: true } },
              worker: { include: { user: { select: { id: true, name: true } }, trade: true } },
            },
          },
          openedBy: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ disputes });
    } else {
      const disputes = await prisma.dispute.findMany({
        where: { openedById: user.id },
        include: {
          booking: {
            include: {
              worker: { include: { user: { select: { id: true, name: true } }, trade: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ disputes });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch disputes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { bookingId, reason, description } = await req.json();

    if (!bookingId || !reason || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    if (booking.customerId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Check if dispute already exists
    const existing = await prisma.dispute.findUnique({ where: { bookingId } });
    if (existing) return NextResponse.json({ error: "Dispute already exists for this booking" }, { status: 409 });

    const dispute = await prisma.dispute.create({
      data: {
        bookingId,
        openedById: user.id,
        reason,
        description,
      },
    });

    return NextResponse.json({ dispute }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create dispute" }, { status: 500 });
  }
}
