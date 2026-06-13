"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

interface Booking {
  id: string;
  date: string;
  startTime: string;
  status: string;
  totalAmount: number;
  description: string;
  customer: { name: string; avatar?: string };
  worker: {
    user: { name: string; avatar?: string };
    trade: { name: string; icon: string };
  };
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetch("/api/bookings")
        .then((r) => r.json())
        .then((d) => { setBookings(d.bookings || []); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [user]);

  if (authLoading || !user) return null;

  const upcoming = bookings.filter((b) => ["pending", "confirmed"].includes(b.status));
  const recent = bookings.slice(0, 5);

  const stats = [
    { label: "Total Bookings", value: bookings.length, icon: "📋" },
    { label: "Upcoming", value: upcoming.length, icon: "📅" },
    { label: "Completed", value: bookings.filter((b) => b.status === "completed").length, icon: "✅" },
    {
      label: user.role === "worker" ? "Total Earned" : "Total Spent",
      value: formatCurrency(bookings.filter((b) => b.status === "completed").reduce((s, b) => s + b.totalAmount, 0)),
      icon: "💰",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.name.split(" ")[0]}! 👋
          </h1>
          <p className="text-gray-500 mt-1">
            {user.role === "worker" ? "Manage your bookings and schedule" : "Here&apos;s your service overview"}
          </p>
        </div>
        {user.role === "customer" && (
          <Link
            href="/trades"
            className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-sm"
          >
            + Book a Pro
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Recent Bookings</h2>
          <Link href="/bookings" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="divide-y divide-gray-100">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-5 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-4xl mb-3">📋</p>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No bookings yet</h3>
            <p className="text-gray-500 text-sm mb-4">Book a professional to get started</p>
            <Link href="/trades" className="inline-block bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors">
              Find a Pro
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recent.map((booking) => (
              <Link
                key={booking.id}
                href={`/bookings/${booking.id}`}
                className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">
                  {booking.worker.trade.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900">
                    {user.role === "worker" ? booking.customer.name : booking.worker.user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {booking.worker.trade.name} · {formatDate(booking.date)}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {getStatusLabel(booking.status)}
                  </span>
                  <span className="text-sm font-semibold text-gray-900 hidden sm:block">
                    {formatCurrency(booking.totalAmount)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      {user.role === "customer" && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "🔨", label: "Book a Carpenter", href: "/trades/carpentry" },
            { icon: "⚡", label: "Find an Electrician", href: "/trades/electrical" },
            { icon: "🔧", label: "Hire a Plumber", href: "/trades/plumbing" },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm hover:border-blue-200 transition-all"
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-sm font-semibold text-gray-700">{action.label}</span>
              <svg className="w-4 h-4 text-gray-300 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
