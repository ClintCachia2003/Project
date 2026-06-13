import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { bookingId, rating, comment } = await req.json();

    if (!bookingId || !rating || !comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { review: true },
    });

    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    if (booking.customerId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (booking.status !== "completed") return NextResponse.json({ error: "Can only review completed bookings" }, { status: 400 });
    if (booking.review) return NextResponse.json({ error: "Already reviewed" }, { status: 409 });

    const review = await prisma.review.create({
      data: {
        bookingId,
        workerId: booking.workerId,
        authorId: user.id,
        rating,
        comment,
      },
    });

    // Update worker rating
    const allReviews = await prisma.review.findMany({ where: { workerId: booking.workerId } });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.worker.update({
      where: { id: booking.workerId },
      data: { rating: Math.round(avgRating * 10) / 10, reviewCount: allReviews.length },
    });

    // Notify worker
    await prisma.notification.create({
      data: {
        userId: (await prisma.worker.findUnique({ where: { id: booking.workerId }, select: { userId: true } }))!.userId,
        title: "New Review",
        message: `You received a ${rating}-star review!`,
        type: "new_review",
        link: `/profile`,
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
