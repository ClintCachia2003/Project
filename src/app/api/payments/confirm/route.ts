import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendNotificationToUser } from "@/app/api/notifications/stream/route";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { bookingId } = await req.json();

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { worker: { include: { user: true } }, trade: true },
    });
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    if (booking.customerId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const amount = booking.totalAmount;
    const platformFee = parseFloat((amount * 0.15).toFixed(2));
    const workerPayout = parseFloat((amount * 0.85).toFixed(2));

    await prisma.payment.upsert({
      where: { bookingId },
      update: { status: "completed", paidAt: new Date() },
      create: { bookingId, amount, status: "completed", method: "card", paidAt: new Date() },
    });

    await prisma.booking.update({ where: { id: bookingId }, data: { status: "paid" } });

    const notification = await prisma.notification.create({
      data: {
        userId: booking.worker.userId,
        title: "Payment Received!",
        message: `€${amount.toFixed(2)} paid for your ${booking.trade.name} job. Your payout: €${workerPayout.toFixed(2)} (after 15% platform fee).`,
        type: "payment",
        link: `/worker/earnings`,
      },
    });
    try { sendNotificationToUser(booking.worker.userId, { type: "notification", notification }); } catch {}

    return NextResponse.json({ success: true, amount, platformFee, workerPayout });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to confirm payment" }, { status: 500 });
  }
}
