"use client";

import { authFetch } from "@/lib/api";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import StarRating from "@/components/ui/StarRating";

interface Worker {
  id: string;
  hourlyRate: number;
  yearsExperience: number;
  isVerified: boolean;
  isAvailable: boolean;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  user: { id: string; name: string; email: string; phone?: string; createdAt: string };
  trade: { name: string; icon: string; color: string };
  _count: { bookings: number; reviews: number };
}

export default function AdminWorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tradeFilter, setTradeFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    loadWorkers();
  }, []);

  async function loadWorkers() {
    setLoading(true);
    const res = await authFetch("/api/admin/workers");
    if (res.ok) {
      const data = await res.json();
      setWorkers(data.workers || []);
    }
    setLoading(false);
  }

  async function handleToggleAvailable(worker: Worker) {
    await authFetch(`/api/admin/workers/${worker.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !worker.isAvailable }),
    });
    setWorkers((prev) =>
      prev.map((w) => (w.id === worker.id ? { ...w, isAvailable: !worker.isAvailable } : w))
    );
  }

  async function handleToggleVerified(worker: Worker) {
    await authFetch(`/api/admin/workers/${worker.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isVerified: !worker.isVerified }),
    });
    setWorkers((prev) =>
      prev.map((w) => (w.id === worker.id ? { ...w, isVerified: !worker.isVerified } : w))
    );
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const res = await authFetch(`/api/admin/workers/${id}`, { method: "DELETE" });
    if (res.ok) {
      setWorkers((prev) => prev.filter((w) => w.id !== id));
    }
    setDeletingId(null);
    setConfirmDelete(null);
  }

  const trades = [...new Set(workers.map((w) => w.trade.name))].sort();

  const filtered = workers.filter((w) => {
    const matchSearch =
      !search ||
      w.user.name.toLowerCase().includes(search.toLowerCase()) ||
      w.user.email.toLowerCase().includes(search.toLowerCase());
    const matchTrade = tradeFilter === "all" || w.trade.name === tradeFilter;
    return matchSearch && matchTrade;
  });

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workers</h1>
          <p className="text-gray-500 mt-1">{workers.length} professionals on the platform</p>
        </div>
        <Link
          href="/admin/workers/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm"
        >
          + Add Worker
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="flex-1 min-w-48 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <select
          value={tradeFilter}
          onChange={(e) => setTradeFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="all">All Trades</option>
          {trades.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
          <p className="text-3xl mb-2">👷</p>
          <p className="text-gray-500">No workers found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Worker</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Trade</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Rate</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Rating</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((worker) => (
                <tr key={worker.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 flex-shrink-0">
                        {worker.user.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{worker.user.name}</p>
                        <p className="text-xs text-gray-400">{worker.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1.5">
                      <span>{worker.trade.icon}</span>
                      <span className="text-gray-700">{worker.trade.name}</span>
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold text-gray-900">
                    {formatCurrency(worker.hourlyRate)}/hr
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <StarRating rating={worker.rating} size="sm" />
                      <span className="text-xs text-gray-500">({worker.reviewCount})</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => handleToggleAvailable(worker)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          worker.isAvailable
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {worker.isAvailable ? "✓ Available" : "✗ Unavailable"}
                      </button>
                      <button
                        onClick={() => handleToggleVerified(worker)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          worker.isVerified
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        }`}
                      >
                        {worker.isVerified ? "✓ Verified" : "⚠ Unverified"}
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/workers/${worker.id}`}
                        target="_blank"
                        className="text-xs text-blue-600 hover:underline font-medium"
                      >
                        View
                      </Link>
                      {confirmDelete === worker.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(worker.id)}
                            disabled={deletingId === worker.id}
                            className="text-xs bg-red-600 text-white px-2.5 py-1 rounded-lg hover:bg-red-700 disabled:opacity-50"
                          >
                            {deletingId === worker.id ? "..." : "Confirm"}
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="text-xs text-gray-500 hover:text-gray-700 px-1"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(worker.id)}
                          className="text-xs text-red-500 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </div>
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
