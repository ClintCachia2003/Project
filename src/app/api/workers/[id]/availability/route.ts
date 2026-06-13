import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date");

    if (!dateStr) {
      return NextResponse.json({ error: "Date required" }, { status: 400 });
    }

    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();

    const availability = await prisma.availability.findFirst({
      where: { workerId: id, dayOfWeek, isActive: true },
    });

    if (!availability) {
      return NextResponse.json({ slots: [] });
    }

    // Get existing bookings for this worker on this date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBookings = await prisma.booking.findMany({
      where: {
        workerId: id,
        date: { gte: startOfDay, lte: endOfDay },
        status: { notIn: ["cancelled"] },
      },
      select: { startTime: true, endTime: true },
    });

    // Generate 1-hour slots
    const slots: { time: string; available: boolean }[] = [];
    const [startH] = availability.startTime.split(":").map(Number);
    const [endH] = availability.endTime.split(":").map(Number);

    for (let h = startH; h < endH; h++) {
      const time = `${h.toString().padStart(2, "0")}:00`;
      const endTime = `${(h + 1).toString().padStart(2, "0")}:00`;

      const isBooked = existingBookings.some(
        (b) => b.startTime === time || (b.startTime < time && b.endTime > time)
      );

      slots.push({ time, available: !isBooked });
    }

    return NextResponse.json({ slots, availability });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }
}
