import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth";

// Global map of userId -> SSE controller
declare global {
  // eslint-disable-next-line no-var
  var notificationClients: Map<string, ReadableStreamDefaultController>;
}

if (!globalThis.notificationClients) {
  globalThis.notificationClients = new Map();
}

export function sendNotificationToUser(userId: string, data: object) {
  const controller = globalThis.notificationClients.get(userId);
  if (controller) {
    try {
      const message = `data: ${JSON.stringify(data)}\n\n`;
      controller.enqueue(new TextEncoder().encode(message));
    } catch {
      // Client disconnected
      globalThis.notificationClients.delete(userId);
    }
  }
}

export async function GET(req: NextRequest) {
  // EventSource can't set headers, so also accept token as query param
  const url = new URL(req.url);
  const queryToken = url.searchParams.get("token");
  let user = await getAuthUser(req);
  if (!user && queryToken) {
    // manually verify token from query param
    const { verifyToken } = await import("@/lib/auth");
    const { prisma } = await import("@/lib/prisma");
    const payload = verifyToken(queryToken);
    if (payload) {
      user = await prisma.user.findUnique({ where: { id: payload.userId } });
    }
  }
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = user.id;

  const stream = new ReadableStream({
    start(controller) {
      globalThis.notificationClients.set(userId, controller);

      // Send initial ping
      controller.enqueue(new TextEncoder().encode(`event: ping\ndata: connected\n\n`));

      // Keep-alive ping every 30s
      const interval = setInterval(() => {
        try {
          controller.enqueue(new TextEncoder().encode(`event: ping\ndata: ping\n\n`));
        } catch {
          clearInterval(interval);
          globalThis.notificationClients.delete(userId);
        }
      }, 30000);

      // Clean up on disconnect
      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        globalThis.notificationClients.delete(userId);
        try {
          controller.close();
        } catch {
          // already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
