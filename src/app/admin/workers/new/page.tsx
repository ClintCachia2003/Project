"use client";

import { authFetch } from "@/lib/api";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface Trade {
  id: string;
  name: string;
  icon: string;
}

export default function AddWorkerPage() {
  const router = useRouter();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    tradeId: "",
    bio: "",
    hourlyRate: "",
    yearsExperience: "",
    licenseNumber: "",
    skills: "",
    isVerified: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/trades")
      .then((r) => r.json())
      .then((d) => setTrades(d.trades || []));
  }, []);

  function update(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.tradeId) { setError("Please select a trade"); return; }
    if (!form.skills.trim()) { setError("Please enter at least one skill"); return; }

    setLoading(true);
    const res = await authFetch("/api/admin/workers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      }),
    });

    const data = await res.json();
    if (res.ok) {
      router.push("/admin/workers");
    } else {
      setError(data.error || "Failed to create worker");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl animate-fadeIn">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/workers" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Worker</h1>
          <p className="text-gray-500 text-sm mt-0.5">Create a professional profile on the platform</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        {error && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Personal Info */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">Personal Information</h2>
            <div className="space-y-4">
              <Input label="Full Name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="John Smith" required />
              <Input label="Email Address" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="john@example.com" required />
              <Input label="Phone Number" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+1 (555) 000-0000" />
            </div>
          </div>

          {/* Trade & Professional Info */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">Professional Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Trade <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.tradeId}
                  onChange={(e) => update("tradeId", e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select a trade...</option>
                  {trades.map((t) => (
                    <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Bio / Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => update("bio", e.target.value)}
                  placeholder="Describe the worker's experience and expertise..."
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Hourly Rate ($)" type="number" min="1" value={form.hourlyRate} onChange={(e) => update("hourlyRate", e.target.value)} placeholder="75" required />
                <Input label="Years of Experience" type="number" min="0" value={form.yearsExperience} onChange={(e) => update("yearsExperience", e.target.value)} placeholder="5" required />
              </div>

              <Input label="License Number (optional)" value={form.licenseNumber} onChange={(e) => update("licenseNumber", e.target.value)} placeholder="e.g. ELEC-2024-001" />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Skills <span className="text-red-500">*</span>
                  <span className="font-normal text-gray-400 ml-1">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={form.skills}
                  onChange={(e) => update("skills", e.target.value)}
                  placeholder="e.g. Wiring, Panel Upgrades, Lighting, EV Chargers"
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={form.isVerified}
                    onChange={(e) => update("isVerified", e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-10 h-6 rounded-full transition-colors ${form.isVerified ? "bg-blue-600" : "bg-gray-200"}`} />
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isVerified ? "translate-x-5" : "translate-x-1"}`} />
                </div>
                <span className="text-sm font-medium text-gray-700">Mark as Verified Pro</span>
              </label>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 text-sm text-blue-700">
            <strong>Note:</strong> The worker&apos;s default login password will be <code className="bg-blue-100 px-1.5 py-0.5 rounded font-mono">Worker@TradePro1</code>. They can change it after signing in.
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1" size="lg" loading={loading}>
              Create Worker Profile
            </Button>
            <Link
              href="/admin/workers"
              className="px-5 py-3 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
