"use client";

import { authFetch } from "@/lib/api";
import { useEffect, useState } from "react";

interface Dispute {
  id: string;
  reason: string;
  description: string;
  status: string;
  resolution?: string;
  resolvedAt?: string;
  createdAt: string;
  booking: {
    id: string;
    totalAmount: number;
    customer: { id: string; name: string; email: string };
    worker: { user: { id: string; name: string }; trade: { name: string; icon: string } };
  };
  openedBy: { id: string; name: string; email: string };
}

const STATUS_COLORS: Record<string, string> = {
  open: "bg-red-100 text-red-700",
  investigating: "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-600",
};

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updateForm, setUpdateForm] = useState<Record<string, { status: string; resolution: string }>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    authFetch("/api/disputes")
      .then((r) => r.json())
      .then((d) => { setDisputes(d.disputes || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function initForm(dispute: Dispute) {
    setUpdateForm((prev) => ({
      ...prev,
      [dispute.id]: { status: dispute.status, resolution: dispute.resolution || "" },
    }));
  }

  function toggle(id: string, dispute: Dispute) {
    if (expanded === id) {
      setExpanded(null);
    } else {
      setExpanded(id);
      if (!updateForm[id]) initForm(dispute);
    }
  }

  async function saveUpdate(id: string) {
    setSaving(id);
    const form = updateForm[id];
    const res = await authFetch(`/api/disputes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      setDisputes((prev) => prev.map((d) => d.id === id ? { ...d, ...data.dispute } : d));
    }
    setSaving(null);
  }

  const filtered = filterStatus === "all" ? disputes : disputes.filter((d) => d.status === filterStatus);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-gray-100 rounded-xl w-1/3" />
        {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dispute Resolution</h1>
        <p className="text-gray-500 mt-1">Review and resolve customer disputes</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "open", "investigating", "resolved", "closed"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${
              filterStatus === s
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s}
            {s !== "all" && (
              <span className="ml-1.5 text-xs opacity-75">
                ({disputes.filter((d) => d.status === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-3xl mb-2">⚖️</p>
          <p className="text-gray-500">No disputes found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((dispute) => (
            <div key={dispute.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Summary row */}
              <button
                className="w-full text-left p-5 hover:bg-gray-50 transition-colors"
                onClick={() => toggle(dispute.id, dispute)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[dispute.status] || "bg-gray-100 text-gray-600"}`}>
                        {dispute.status}
                      </span>
                      <span className="text-xs text-gray-400">#{dispute.id.slice(-8)}</span>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">{dispute.reason}</p>
                    <div className="text-xs text-gray-500 mt-0.5 flex flex-wrap gap-x-3">
                      <span>Customer: {dispute.booking.customer.name}</span>
                      <span>Worker: {dispute.booking.worker.user.name} ({dispute.booking.worker.trade.icon} {dispute.booking.worker.trade.name})</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-400">{new Date(dispute.createdAt).toLocaleDateString()}</p>
                    <svg
                      className={`w-4 h-4 text-gray-400 mt-1 ml-auto transition-transform ${expanded === dispute.id ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>

              {/* Expanded detail */}
              {expanded === dispute.id && (
                <div className="border-t border-gray-100 p-5 space-y-4 animate-fadeIn">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Description</p>
                    <p className="text-sm text-gray-700">{dispute.description}</p>
                  </div>

                  {dispute.resolution && (
                    <div className="p-3 bg-green-50 rounded-xl">
                      <p className="text-xs text-green-600 mb-1">Resolution</p>
                      <p className="text-sm text-gray-700">{dispute.resolution}</p>
                    </div>
                  )}

                  {/* Update form */}
                  {updateForm[dispute.id] && (
                    <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm font-semibold text-gray-900">Update Dispute</p>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Status</label>
                        <select
                          value={updateForm[dispute.id].status}
                          onChange={(e) => setUpdateForm((prev) => ({ ...prev, [dispute.id]: { ...prev[dispute.id], status: e.target.value } }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {["open", "investigating", "resolved", "closed"].map((s) => (
                            <option key={s} value={s} className="capitalize">{s}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Resolution Note</label>
                        <textarea
                          rows={2}
                          value={updateForm[dispute.id].resolution}
                          onChange={(e) => setUpdateForm((prev) => ({ ...prev, [dispute.id]: { ...prev[dispute.id], resolution: e.target.value } }))}
                          placeholder="Describe how this dispute was resolved..."
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>
                      <button
                        onClick={() => saveUpdate(dispute.id)}
                        disabled={saving === dispute.id}
                        className="w-full py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {saving === dispute.id ? "Saving..." : "Save Update"}
                      </button>
                    </div>
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
