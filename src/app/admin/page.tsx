"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";

interface Stats {
  users: number;
  workers: number;
  bookings: number;
  trades: number;
  revenue: number;
}

interface RecentBooking {
  id: string;
  status: string;
  totalAmount: number;
  date: string;
  customer: { name: string };
  worker: { user: { name: string }; trade: { name: string; icon: string } };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");

  async function handleSeed(reset: boolean) {
    setSeeding(true);
    setSeedMsg("");
    const res = await fetch(`/api/seed${reset ? "?reset=true" : ""}`, { method: "POST" });
    const data = await res.json();
    setSeedMsg(data.message || data.error || "Done");
    setSeeding(false);
    loadStats();
  }

  function loadStats() {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        setStats(d.stats);
        setRecentBookings(d.recentBookings || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  useEffect(() => {
    loadStats();
  }, []);

  const statCards = stats
    ? [
        { label: "Total Customers", value: stats.users, icon: "👤", color: "bg-blue-50 text-blue-600" },
        { label: "Active Workers", value: stats.workers, icon: "👷", color: "bg-green-50 text-green-600" },
        { label: "Total Bookings", value: stats.bookings, icon: "📋", color: "bg-purple-50 text-purple-600" },
        { label: "Total Revenue", value: formatCurrency(stats.revenue), icon: "💰", color: "bg-yellow-50 text-yellow-600" },
      ]
    : [];

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your TradePro platform</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSeed(false)}
            disabled={seeding}
            className="px-4 py-2 text-sm font-semibold bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors disabled:opacity-50"
          >
            {seeding ? "Seeding…" : "Seed Data"}
          </button>
          <button
            onClick={() => { if (confirm("This will WIPE all data and re-seed. Continue?")) handleSeed(true); }}
            disabled={seeding}
            className="px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors disabled:opacity-50"
          >
            Reset & Re-seed
          </button>
          <Link
            href="/admin/workers/new"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm"
          >
            + Add Worker
          </Link>
        </div>
      </div>
      {seedMsg && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          ✓ {seedMsg}
        </div>
      )}

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${card.color}`}>
                {card.icon}
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Recent Bookings</h2>
        </div>
        {recentBookings.length === 0 ? (
          <div className="py-12 text-center text-gray-400">No bookings yet</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentBookings.map((b) => (
              <div key={b.id} className="flex items-center gap-4 p-4">
                <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                  {b.worker.trade.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {b.customer.name} → {b.worker.user.name}
                  </p>
                  <p className="text-xs text-gray-500">{b.worker.trade.name} · {formatDate(b.date)}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(b.status)}`}>
                  {getStatusLabel(b.status)}
                </span>
                <span className="text-sm font-bold text-gray-900">{formatCurrency(b.totalAmount)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
