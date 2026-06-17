import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendNotificationToUser } from "@/app/api/notifications/stream/route";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== "worker") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { bookingId, amount, notes } = await req.json();
    if (!bookingId || !amount) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { worker: { include: { user: true } }, customer: true, trade: true },
    });

    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    if (booking.worker.userId !== user.id) return NextResponse.json({ error: "Not your booking" }, { status: 403 });
    if (booking.status !== "pending") return NextResponse.json({ error: "Booking is not pending" }, { status: 400 });

    const quote = await prisma.quote.create({
      data: { bookingId, amount: parseFloat(String(amount)), notes: notes || null },
    });

    await prisma.booking.update({ where: { id: bookingId }, data: { status: "quoted" } });

    const notification = await prisma.notification.create({
      data: {
        userId: booking.customerId,
        title: "New Quote Received",
        message: `${booking.worker.user.name} quoted €${parseFloat(String(amount)).toFixed(2)} for your ${booking.trade.name} booking.`,
        type: "quote",
        link: `/bookings/${bookingId}`,
      },
    });

    try { sendNotificationToUser(booking.customerId, { type: "notification", notification }); } catch {}

    return NextResponse.json({ quote });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create quote" }, { status: 500 });
  }
}
