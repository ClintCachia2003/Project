import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const dispute = await prisma.dispute.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            customer: { select: { id: true, name: true, email: true } },
            worker: { include: { user: { select: { id: true, name: true } }, trade: true } },
          },
        },
        openedBy: { select: { id: true, name: true, email: true } },
      },
    });

    if (!dispute) return NextResponse.json({ error: "Dispute not found" }, { status: 404 });

    // Only admin or the opener can view
    if (user.role !== "admin" && dispute.openedById !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ dispute });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch dispute" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const { status, resolution } = await req.json();

    const resolvedAt = ["resolved", "closed"].includes(status) ? new Date() : undefined;

    const dispute = await prisma.dispute.update({
      where: { id },
      data: {
        status,
        resolution,
        ...(resolvedAt ? { resolvedAt } : {}),
      },
    });

    return NextResponse.json({ dispute });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update dispute" }, { status: 500 });
  }
}
