import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();

  const updated = await prisma.worker.update({
    where: { id },
    data: {
      hourlyRate: body.hourlyRate !== undefined ? parseFloat(body.hourlyRate) : undefined,
      yearsExperience: body.yearsExperience !== undefined ? parseInt(body.yearsExperience) : undefined,
      licenseNumber: body.licenseNumber !== undefined ? body.licenseNumber : undefined,
      isVerified: body.isVerified !== undefined ? body.isVerified : undefined,
      isAvailable: body.isAvailable !== undefined ? body.isAvailable : undefined,
      bio: body.bio !== undefined ? body.bio : undefined,
      skills: body.skills !== undefined
        ? JSON.stringify(Array.isArray(body.skills) ? body.skills : body.skills.split(",").map((s: string) => s.trim()))
        : undefined,
    },
    include: { user: true, trade: true },
  });

  return NextResponse.json({ worker: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const worker = await prisma.worker.findUnique({ where: { id }, select: { userId: true } });
  if (!worker) return NextResponse.json({ error: "Worker not found" }, { status: 404 });

  // Cascade delete — clear bookings/reviews first
  const bookingIds = (await prisma.booking.findMany({ where: { workerId: id }, select: { id: true } })).map(b => b.id);
  await prisma.review.deleteMany({ where: { bookingId: { in: bookingIds } } });
  await prisma.payment.deleteMany({ where: { bookingId: { in: bookingIds } } });
  await prisma.booking.deleteMany({ where: { workerId: id } });
  await prisma.review.deleteMany({ where: { workerId: id } });
  await prisma.availability.deleteMany({ where: { workerId: id } });
  await prisma.worker.delete({ where: { id } });
  await prisma.user.delete({ where: { id: worker.userId } });

  return NextResponse.json({ message: "Worker removed" });
}
