import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { bookingId } = await req.json();

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    if (booking.customerId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (booking.status !== "confirmed") return NextResponse.json({ error: "Booking must be confirmed to pay" }, { status: 400 });

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-11-20.acacia" as any });
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(booking.totalAmount * 100),
      currency: "usd",
      metadata: { bookingId },
    });

    return NextResponse.json({ clientSecret: intent.client_secret });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 });
  }
}
