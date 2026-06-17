import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== "worker") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const worker = await prisma.worker.findUnique({
      where: { userId: user.id },
      include: {
        trade: true,
        user: { select: { name: true, email: true, phone: true, avatar: true } },
      },
    });
    if (!worker) return NextResponse.json({ error: "Worker not found" }, { status: 404 });

    return NextResponse.json({ worker });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== "worker") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const worker = await prisma.worker.findUnique({ where: { userId: user.id } });
    if (!worker) return NextResponse.json({ error: "Worker not found" }, { status: 404 });

    const { bio, hourlyRate, yearsExperience, licenseNumber, skills, isAvailable } = await req.json();

    const updated = await prisma.worker.update({
      where: { id: worker.id },
      data: {
        ...(bio !== undefined && { bio }),
        ...(hourlyRate !== undefined && { hourlyRate: Number(hourlyRate) }),
        ...(yearsExperience !== undefined && { yearsExperience: Number(yearsExperience) }),
        ...(licenseNumber !== undefined && { licenseNumber }),
        ...(skills !== undefined && { skills }),
        ...(isAvailable !== undefined && { isAvailable }),
      },
      include: { trade: true, user: { select: { name: true, email: true } } },
    });

    return NextResponse.json({ worker: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
