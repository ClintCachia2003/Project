import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where: Record<string, unknown> =
      user.role === "worker"
        ? { worker: { userId: user.id } }
        : { customerId: user.id };

    if (status) where.status = status;

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        customer: { select: { id: true, name: true, email: true, avatar: true, phone: true } },
        worker: {
          include: {
            user: { select: { id: true, name: true, avatar: true, phone: true } },
            trade: true,
          },
        },
        review: true,
        payment: true,
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { workerId, date, startTime, description, address, city, notes } = await req.json();

    if (!workerId || !date || !startTime || !description || !address || !city) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const worker = await prisma.worker.findUnique({ where: { id: workerId } });
    if (!worker) return NextResponse.json({ error: "Worker not found" }, { status: 404 });

    const [h] = startTime.split(":").map(Number);
    const endTime = `${(h + 1).toString().padStart(2, "0")}:00`;
    const totalAmount = worker.hourlyRate;

    const booking = await prisma.booking.create({
      data: {
        customerId: user.id,
        workerId,
        date: new Date(date),
        startTime,
        endTime,
        status: "pending",
        totalAmount,
        description,
        address,
        city,
        notes,
      },
      include: {
        worker: {
          include: {
            user: { select: { name: true } },
            trade: true,
          },
        },
      },
    });

    // Create notifications
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "Booking Submitted",
        message: `Your booking with ${booking.worker.user.name} has been submitted and is pending confirmation.`,
        type: "booking_confirmed",
        link: `/bookings/${booking.id}`,
      },
    });

    await prisma.notification.create({
      data: {
        userId: booking.worker.userId,
        title: "New Booking Request",
        message: `You have a new booking request from a customer for ${booking.worker.trade.name} service.`,
        type: "booking_confirmed",
        link: `/bookings/${booking.id}`,
      },
    });

    // Create pending payment
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: totalAmount,
        status: "pending",
        method: "card",
      },
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
