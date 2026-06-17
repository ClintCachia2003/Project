"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/api";

interface MisconductFee {
  id: string;
  amount: number;
  reason: string;
  isPaid: boolean;
  bookingId?: string;
  createdAt: string;
  worker: { id: string; user: { name: string; email: string } };
}

interface Worker {
  id: string;
  user: { name: string; email: string };
}

export default function AdminMisconductPage() {
  const [fees, setFees] = useState<MisconductFee[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ workerId: "", bookingId: "", reason: "" });
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState<"all" | "unpaid" | "paid">("all");

  useEffect(() => {
    Promise.all([
      authFetch("/api/admin/misconduct").then(r => r.json()),
      authFetch("/api/admin/workers").then(r => r.json()),
    ]).then(([feesData, workersData]) => {
      setFees(feesData.fees || []);
      setWorkers(workersData.workers || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.workerId || !form.reason) return;
    setSubmitting(true);
    const res = await authFetch("/api/admin/misconduct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workerId: form.workerId, bookingId: form.bookingId || undefined, reason: form.reason }),
    });
    if (res.ok) {
      const data = await res.json();
      setFees(prev => [data.fee, ...prev]);
      setForm({ workerId: "", bookingId: "", reason: "" });
      setShowForm(false);
    }
    setSubmitting(false);
  }

  const filtered = fees.filter(f => {
    if (filter === "unpaid") return !f.isPaid;
    if (filter === "paid") return f.isPaid;
    return true;
  });

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Misconduct Fees</h1>
          <p className="text-gray-500 mt-1">Issue and track €20 fees for policy violations</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          ⚠️ Issue Fee
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-red-200 p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">Issue Misconduct Fee</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Worker</label>
              <select
                value={form.workerId}
                onChange={e => setForm(p => ({ ...p, workerId: e.target.value }))}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
              >
                <option value="">Select a worker...</option>
                {workers.map(w => (
                  <option key={w.id} value={w.id}>{w.user.name} ({w.user.email})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Booking ID (optional)</label>
              <input
                type="text"
                value={form.bookingId}
                onChange={e => setForm(p => ({ ...p, bookingId: e.target.value }))}
                placeholder="Leave blank if not related to a specific booking"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason</label>
              <textarea
                value={form.reason}
                onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}
                required
                rows={3}
                placeholder="e.g. Suspected cash payment — customer reported worker requested cash instead of online payment"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
              />
            </div>
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-700">
              ⚠️ This will charge the worker <strong>€20.00</strong> and send them an immediate notification.
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
              >
                {submitting ? "Issuing..." : "Issue €20 Fee"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-5 w-fit">
        {(["all", "unpaid", "paid"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {f} {f === "all" ? `(${fees.length})` : f === "unpaid" ? `(${fees.filter(x => !x.isPaid).length})` : `(${fees.filter(x => x.isPaid).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
          <p className="text-3xl mb-2">✅</p>
          <p className="text-gray-500">No misconduct fees found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Worker</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Reason</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Amount</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Date</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(fee => (
                <tr key={fee.id} className={!fee.isPaid ? "bg-red-50/30" : ""}>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-900">{fee.worker.user.name}</p>
                    <p className="text-xs text-gray-400">{fee.worker.user.email}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-700 max-w-xs">
                    <p className="truncate">{fee.reason}</p>
                    {fee.bookingId && <p className="text-xs text-gray-400 mt-0.5">Booking: {fee.bookingId.slice(0, 8)}...</p>}
                  </td>
                  <td className="px-5 py-4 font-bold text-red-600">€{fee.amount.toFixed(2)}</td>
                  <td className="px-5 py-4 text-gray-500 text-xs">{new Date(fee.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      fee.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {fee.isPaid ? "Paid" : "Unpaid"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
