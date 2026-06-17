"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authFetch } from "@/lib/api";
import { formatCurrency, formatDate, formatTime, getStatusColor, getStatusLabel } from "@/lib/utils";

interface Stats {
  completedJobs: number;
  pendingJobs: number;
  thisWeekEarnings: number;
  rating: number;
  reviewCount: number;
  nextJob: {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    customerName: string;
    address: string;
    city: string;
    description: string;
  } | null;
  recentActivity: {
    id: string;
    status: string;
    date: string;
    totalAmount: number;
    customerName: string;
    description: string;
  }[];
}

export default function WorkerDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch("/api/worker/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const statCards = stats
    ? [
        { label: "Completed Jobs", value: stats.completedJobs, icon: "✅", color: "bg-green-50 text-green-600" },
        { label: "Pending Requests", value: stats.pendingJobs, icon: "⏳", color: "bg-yellow-50 text-yellow-600" },
        { label: "This Week's Earnings", value: formatCurrency(stats.thisWeekEarnings), icon: "💰", color: "bg-blue-50 text-blue-600" },
        {
          label: "Rating",
          value: stats.rating > 0 ? `${stats.rating.toFixed(1)} ★` : "No reviews",
          icon: "⭐",
          color: "bg-purple-50 text-purple-600",
        },
      ]
    : [];

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Worker Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here&apos;s your overview.</p>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Job */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-900 mb-4">Next Job</h2>
          {loading ? (
            <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
          ) : stats?.nextJob ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>📅</span>
                <span>{formatDate(stats.nextJob.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>🕐</span>
                <span>{formatTime(stats.nextJob.startTime)} – {formatTime(stats.nextJob.endTime)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>👤</span>
                <span>{stats.nextJob.customerName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>📍</span>
                <span>{stats.nextJob.address}, {stats.nextJob.city}</span>
              </div>
              <p className="text-sm text-gray-500 border-t border-gray-100 pt-3 mt-3">{stats.nextJob.description}</p>
              <Link
                href={`/worker/jobs`}
                className="block text-center mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                View Job
              </Link>
            </div>
          ) : (
            <div className="py-10 text-center text-gray-400">
              <p className="text-3xl mb-2">📭</p>
              <p className="text-sm">No upcoming jobs</p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Recent Activity</h2>
            <Link href="/worker/jobs" className="text-sm text-blue-600 hover:underline font-medium">
              View all
            </Link>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : !stats?.recentActivity.length ? (
            <div className="py-12 text-center text-gray-400">No activity yet</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {stats.recentActivity.map((b) => (
                <div key={b.id} className="flex items-center gap-4 p-4">
                  <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                    👤
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{b.customerName}</p>
                    <p className="text-xs text-gray-500 truncate">{b.description} · {formatDate(b.date)}</p>
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

      {/* Quick Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/worker/jobs?status=pending"
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
        >
          View Pending Jobs
        </Link>
        <Link
          href="/worker/availability"
          className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
        >
          Update Availability
        </Link>
      </div>
    </div>
  );
}
