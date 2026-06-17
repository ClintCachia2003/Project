"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";

interface EarningsData {
  totalEarnings: number;
  thisMonthEarnings: number;
  lastMonthEarnings: number;
  avgPerJob: number;
  monthlyBreakdown: { key: string; label: string; jobs: number; amount: number }[];
  recentPayments: { id: string; customerName: string; tradeName: string; date: string; amount: number; description: string }[];
}

export default function WorkerEarningsPage() {
  const [data, setData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch("/api/worker/earnings")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const maxMonthAmount = data?.monthlyBreakdown.reduce((m, r) => Math.max(m, r.amount), 0) || 1;

  const summaryCards = data
    ? [
        { label: "Total Earned", value: formatCurrency(data.totalEarnings), icon: "💰", color: "bg-blue-50 text-blue-600" },
        { label: "This Month", value: formatCurrency(data.thisMonthEarnings), icon: "📅", color: "bg-green-50 text-green-600" },
        { label: "Last Month", value: formatCurrency(data.lastMonthEarnings), icon: "📆", color: "bg-purple-50 text-purple-600" },
        { label: "Avg per Job", value: formatCurrency(data.avgPerJob), icon: "📊", color: "bg-yellow-50 text-yellow-600" },
      ]
    : [];

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
        <p className="text-gray-500 mt-1">Track your income and payment history</p>
      </div>

      {/* Summary cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {summaryCards.map((card) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly breakdown with bar chart */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Monthly Earnings</h2>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : !data?.monthlyBreakdown.length ? (
            <div className="py-12 text-center text-gray-400">No earnings yet</div>
          ) : (
            <>
              {/* Bar chart */}
              <div className="p-5 space-y-3">
                {data.monthlyBreakdown.slice(0, 6).map((row) => (
                  <div key={row.key}>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{row.label}</span>
                      <span>{formatCurrency(row.amount)}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${(row.amount / maxMonthAmount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div className="border-t border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Month</th>
                      <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Jobs</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.monthlyBreakdown.map((row) => (
                      <tr key={row.key}>
                        <td className="px-5 py-3 font-medium text-gray-900">{row.label}</td>
                        <td className="px-5 py-3 text-center text-gray-500">{row.jobs}</td>
                        <td className="px-5 py-3 text-right font-semibold text-gray-900">{formatCurrency(row.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Recent payments */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Recent Payments</h2>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : !data?.recentPayments.length ? (
            <div className="py-12 text-center text-gray-400">No payments yet</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {data.recentPayments.map((p) => (
                <div key={p.id} className="flex items-center gap-4 p-4">
                  <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center text-green-600 font-bold flex-shrink-0">
                    {p.customerName[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{p.customerName}</p>
                    <p className="text-xs text-gray-500">{p.tradeName} · {formatDate(p.date)}</p>
                  </div>
                  <span className="text-sm font-bold text-green-600">+{formatCurrency(p.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
