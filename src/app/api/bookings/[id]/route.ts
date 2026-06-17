import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { sendNotificationToUser } from "@/app/api/notifications/stream/route";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        customer: { select: { id: true, name: true, email: true, avatar: true, phone: true } },
        worker: {
          include: {
            user: { select: { id: true, name: true, avatar: true, phone: true } },
            trade: true,
          },
        },
        review: { include: { author: { select: { name: true, avatar: true } } } },
        payment: true,
        dispute: true,
        quote: true,
      },
    });

    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    return NextResponse.json({ booking });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { status, cancelReason } = await req.json();

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { worker: { include: { user: true } } },
    });

    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    const updated = await prisma.booking.update({
      where: { id },
      data: { status, cancelReason },
    });

    // Notifications for status changes
    if (status === "confirmed") {
      const notif = await prisma.notification.create({
        data: {
          userId: booking.customerId,
          title: "Booking Confirmed!",
          message: `Your booking has been confirmed. See you soon!`,
          type: "booking_confirmed",
          link: `/bookings/${id}`,
        },
      });
      sendNotificationToUser(booking.customerId, { type: "notification", notification: notif });
    } else if (status === "cancelled") {
      const notif = await prisma.notification.create({
        data: {
          userId: booking.customerId,
          title: "Booking Cancelled",
          message: `Your booking has been cancelled. ${cancelReason || ""}`,
          type: "booking_cancelled",
          link: `/bookings/${id}`,
        },
      });
      sendNotificationToUser(booking.customerId, { type: "notification", notification: notif });
    } else if (status === "completed") {
      const notif = await prisma.notification.create({
        data: {
          userId: booking.customerId,
          title: "Job Completed",
          message: `Your service is complete! Please leave a review.`,
          type: "booking_confirmed",
          link: `/bookings/${id}`,
        },
      });
      sendNotificationToUser(booking.customerId, { type: "notification", notification: notif });
      // Mark payment as paid
      await prisma.payment.updateMany({
        where: { bookingId: id },
        data: { status: "paid", paidAt: new Date() },
      });
    }

    return NextResponse.json({ booking: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
