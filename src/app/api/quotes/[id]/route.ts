import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendNotificationToUser } from "@/app/api/notifications/stream/route";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { action } = await req.json();

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: { booking: { include: { customer: true, worker: { include: { user: true } }, trade: true } } },
    });

    if (!quote) return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    if (quote.booking.customerId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    if (action === "approve") {
      await prisma.quote.update({ where: { id }, data: { status: "approved" } });
      await prisma.booking.update({
        where: { id: quote.bookingId },
        data: { status: "confirmed", totalAmount: quote.amount },
      });

      const notification = await prisma.notification.create({
        data: {
          userId: quote.booking.worker.userId,
          title: "Quote Approved!",
          message: `${quote.booking.customer.name} approved your quote of €${quote.amount.toFixed(2)}. They will pay online shortly.`,
          type: "quote_approved",
          link: `/worker/jobs`,
        },
      });
      try { sendNotificationToUser(quote.booking.worker.userId, { type: "notification", notification }); } catch {}

    } else if (action === "decline") {
      await prisma.quote.update({ where: { id }, data: { status: "declined" } });
      await prisma.booking.update({ where: { id: quote.bookingId }, data: { status: "cancelled" } });

      const notification = await prisma.notification.create({
        data: {
          userId: quote.booking.worker.userId,
          title: "Quote Declined",
          message: `${quote.booking.customer.name} declined your quote for the ${quote.booking.trade.name} booking.`,
          type: "quote_declined",
          link: `/worker/jobs`,
        },
      });
      try { sendNotificationToUser(quote.booking.worker.userId, { type: "notification", notification }); } catch {}
    }

    const updated = await prisma.quote.findUnique({ where: { id }, include: { booking: true } });
    return NextResponse.json({ quote: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update quote" }, { status: 500 });
  }
}
