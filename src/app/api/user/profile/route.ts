import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, phone, address, city, state, zipCode } = await req.json();

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { name, phone, address, city, state, zipCode },
      select: { id: true, name: true, email: true, role: true, avatar: true, phone: true, address: true, city: true, state: true, zipCode: true },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
