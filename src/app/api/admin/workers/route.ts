import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const workers = await prisma.worker.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, createdAt: true } },
      trade: true,
      _count: { select: { bookings: true, reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ workers });
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const {
      name, email, phone, tradeId, bio, hourlyRate,
      yearsExperience, licenseNumber, skills, isVerified,
    } = await req.json();

    if (!name || !email || !tradeId || !bio || !hourlyRate || !yearsExperience || !skills) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash("Worker@TradePro1", 10);

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, phone: phone || null, role: "worker" },
    });

    const worker = await prisma.worker.create({
      data: {
        userId: newUser.id,
        tradeId,
        bio,
        hourlyRate: parseFloat(hourlyRate),
        yearsExperience: parseInt(yearsExperience),
        licenseNumber: licenseNumber || null,
        isVerified: isVerified === true,
        isAvailable: true,
        rating: 0,
        reviewCount: 0,
        completedJobs: 0,
        skills: JSON.stringify(Array.isArray(skills) ? skills : skills.split(",").map((s: string) => s.trim())),
      },
      include: { user: true, trade: true },
    });

    // Default availability: Mon–Fri 9am–5pm
    for (let day = 1; day <= 5; day++) {
      await prisma.availability.create({
        data: { workerId: worker.id, dayOfWeek: day, startTime: "09:00", endTime: "17:00", isActive: true },
      });
    }

    return NextResponse.json({ worker }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create worker" }, { status: 500 });
  }
}
