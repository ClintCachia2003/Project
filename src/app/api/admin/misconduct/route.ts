import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendNotificationToUser } from "@/app/api/notifications/stream/route";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const fees = await prisma.misconductFee.findMany({
    include: { worker: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ fees });
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { workerId, bookingId, reason } = await req.json();
  if (!workerId || !reason) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const fee = await prisma.misconductFee.create({
    data: { workerId, bookingId: bookingId || null, reason, amount: 20 },
    include: { worker: { include: { user: true } } },
  });

  const notification = await prisma.notification.create({
    data: {
      userId: fee.worker.userId,
      title: "Misconduct Fee Issued",
      message: `A €20 misconduct fee has been charged to your account. Reason: ${reason}`,
      type: "misconduct",
      link: `/worker/earnings`,
    },
  });
  try { sendNotificationToUser(fee.worker.userId, { type: "notification", notification }); } catch {}

  return NextResponse.json({ fee });
}
