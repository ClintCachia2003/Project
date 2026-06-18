"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { authFetch } from "@/lib/api";

export default function WorkerLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [workerInfo, setWorkerInfo] = useState<{ tradeName: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== "worker")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && user.role === "worker") {
      authFetch("/api/worker/profile")
        .then((r) => r.json())
        .then((d) => {
          if (d.worker) setWorkerInfo({ tradeName: d.worker.trade?.name || "" });
        })
        .catch(() => {});
    }
  }, [user]);

  if (loading || !user || user.role !== "worker") return null;

  const navItems = [
    { href: "/worker", label: "Dashboard", icon: "📊" },
    { href: "/worker/jobs", label: "My Jobs", icon: "🔧" },
    { href: "/worker/availability", label: "Availability", icon: "📅" },
    { href: "/worker/earnings", label: "Earnings", icon: "💰" },
    { href: "/worker/profile", label: "My Profile", icon: "👤" },
  ];

  const sidebar = (
    <aside className="w-56 bg-gray-900 text-white flex flex-col flex-shrink-0 h-full">
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">T</span>
          </div>
          <div>
            <p className="font-bold text-sm">Verifix</p>
            <p className="text-xs text-gray-400">Worker Panel</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-2">
            <span className="text-white font-bold text-lg">{user.name[0].toUpperCase()}</span>
          </div>
          <p className="text-sm font-semibold text-white truncate">{user.name}</p>
          {workerInfo?.tradeName && (
            <p className="text-xs text-gray-400 truncate">{workerInfo.tradeName}</p>
          )}
        </div>
      </div>

      <nav className="flex-1 p-3">
        <p className="text-xs text-gray-500 uppercase tracking-wider px-3 mb-2 mt-2">Menu</p>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-1 ${
              pathname === item.href
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-800">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <span>🏠</span> Back to Site
        </Link>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col">{sidebar}</div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="flex flex-col w-56">{sidebar}</div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile header */}
        <div className="md:hidden flex items-center gap-3 p-4 bg-white border-b border-gray-100">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-bold text-gray-900">Worker Panel</span>
        </div>
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
