"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { authFetch } from "@/lib/api";
import { formatCurrency, formatDate, formatTime, getStatusColor, getStatusLabel } from "@/lib/utils";

interface Booking {
  id: string;
  status: string;
  date: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  description: string;
  address: string;
  city: string;
  notes?: string;
  cancelReason?: string;
  customer: { id: string; name: string; email: string; phone?: string; avatar?: string };
}

const TABS = ["all", "pending", "confirmed", "completed", "cancelled"] as const;

function JobsContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("status") as typeof TABS[number]) || "all";
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>(initialTab);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [declineId, setDeclineId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    authFetch("/api/bookings")
      .then((r) => r.json())
      .then((d) => { setBookings(d.bookings || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: string, reason?: string) {
    setActionLoading(id);
    const res = await authFetch(`/api/bookings/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status, cancelReason: reason }),
    });
    if (res.ok) {
      const data = await res.json();
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...data.booking } : b)));
      setDeclineId(null);
      setDeclineReason("");
    }
    setActionLoading(null);
  }

  const filtered = activeTab === "all" ? bookings : bookings.filter((b) => b.status === activeTab);

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
        <p className="text-gray-500 mt-1">Manage your bookings and job requests</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
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
        <div className="py-20 text-center text-gray-400">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-medium text-gray-500">No {activeTab === "all" ? "" : activeTab} jobs found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === b.id ? null : b.id)}
                className="w-full text-left p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-lg flex-shrink-0">
                    {b.customer.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">{b.customer.name}</p>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(b.status)}`}>
                        {getStatusLabel(b.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{b.description}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                      <span>📅 {formatDate(b.date)}</span>
                      <span>🕐 {formatTime(b.startTime)} – {formatTime(b.endTime)}</span>
                      <span>📍 {b.address}, {b.city}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-900">{formatCurrency(b.totalAmount)}</p>
                    <p className="text-xs text-gray-400 mt-1">{expanded === b.id ? "▲" : "▼"}</p>
                  </div>
                </div>
              </button>

              {expanded === b.id && (
                <div className="border-t border-gray-100 p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Customer</p>
                      <p className="font-medium text-gray-900">{b.customer.name}</p>
                      <p className="text-gray-500">{b.customer.email}</p>
                      {b.customer.phone && <p className="text-gray-500">{b.customer.phone}</p>}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Address</p>
                      <p className="font-medium text-gray-900">{b.address}</p>
                      <p className="text-gray-500">{b.city}</p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Job Description</p>
                    <p className="text-gray-700">{b.description}</p>
                  </div>
                  {b.notes && (
                    <div className="text-sm">
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Notes</p>
                      <p className="text-gray-700">{b.notes}</p>
                    </div>
                  )}
                  {b.cancelReason && (
                    <div className="text-sm bg-red-50 rounded-xl p-3">
                      <p className="text-xs text-red-400 uppercase tracking-wider mb-1">Cancel Reason</p>
                      <p className="text-red-700">{b.cancelReason}</p>
                    </div>
                  )}

                  {/* Actions */}
                  {b.status === "pending" && (
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        onClick={() => updateStatus(b.id, "confirmed")}
                        disabled={actionLoading === b.id}
                        className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {actionLoading === b.id ? "..." : "Accept"}
                      </button>
                      <button
                        onClick={() => setDeclineId(declineId === b.id ? null : b.id)}
                        className="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  )}

                  {declineId === b.id && (
                    <div className="bg-red-50 rounded-xl p-4 space-y-3">
                      <p className="text-sm font-medium text-red-800">Reason for declining</p>
                      <textarea
                        value={declineReason}
                        onChange={(e) => setDeclineReason(e.target.value)}
                        rows={3}
                        placeholder="Explain why you're declining this job..."
                        className="w-full px-3 py-2 rounded-xl border border-red-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus(b.id, "cancelled", declineReason)}
                          disabled={actionLoading === b.id || !declineReason.trim()}
                          className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          Confirm Decline
                        </button>
                        <button
                          onClick={() => { setDeclineId(null); setDeclineReason(""); }}
                          className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {b.status === "confirmed" && (
                    <button
                      onClick={() => updateStatus(b.id, "completed")}
                      disabled={actionLoading === b.id}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {actionLoading === b.id ? "..." : "Mark as Complete"}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function WorkerJobsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-400">Loading...</div>}>
      <JobsContent />
    </Suspense>
  );
}
