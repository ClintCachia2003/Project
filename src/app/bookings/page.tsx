"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency, formatDate, formatTime, getStatusColor, getStatusLabel } from "@/lib/utils";

interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  totalAmount: number;
  description: string;
  address: string;
  city: string;
  customer: { name: string; avatar?: string; phone?: string };
  worker: {
    id: string;
    user: { name: string; avatar?: string; phone?: string };
    trade: { name: string; icon: string };
  };
  review?: { rating: number };
}

const STATUS_FILTERS = ["all", "pending", "confirmed", "completed", "cancelled"];

export default function BookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

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

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        {user.role === "customer" && (
          <Link href="/trades" className="bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors">
            + New Booking
          </Link>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-colors ${
              filter === s
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {s === "all" ? "All" : getStatusLabel(s)}
            <span className={`ml-1.5 text-xs ${filter === s ? "opacity-75" : "text-gray-400"}`}>
              ({s === "all" ? bookings.length : bookings.filter((b) => b.status === s).length})
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-4xl mb-3">📋</p>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No bookings found</h3>
          {filter !== "all" && (
            <p className="text-gray-500 text-sm">Try selecting a different filter</p>
          )}
          {filter === "all" && user.role === "customer" && (
            <Link href="/trades" className="inline-block mt-4 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700">
              Book a Pro
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => (
            <Link
              key={booking.id}
              href={`/bookings/${booking.id}`}
              className="block bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all hover:-translate-y-0.5 duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {booking.worker.trade.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-gray-900">
                        {user.role === "worker" ? booking.customer.name : booking.worker.user.name}
                      </p>
                      <p className="text-sm text-gray-500">{booking.worker.trade.name}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(booking.status)}`}>
                      {getStatusLabel(booking.status)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                    <span>📅 {formatDate(booking.date)}</span>
                    <span>🕐 {formatTime(booking.startTime)} – {formatTime(booking.endTime)}</span>
                    <span>📍 {booking.city}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-gray-500 truncate max-w-xs">{booking.description}</p>
                    <p className="text-sm font-bold text-gray-900 flex-shrink-0">{formatCurrency(booking.totalAmount)}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
