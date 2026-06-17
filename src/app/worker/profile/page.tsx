"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

interface WorkerProfile {
  id: string;
  bio: string;
  hourlyRate: number;
  yearsExperience: number;
  licenseNumber: string | null;
  skills: string;
  isAvailable: boolean;
  rating: number;
  reviewCount: number;
  trade: { name: string; icon: string };
  user: { name: string; email: string; phone?: string };
}

export default function WorkerProfilePage() {
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [skills, setSkills] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    authFetch("/api/worker/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.worker) {
          const w = d.worker;
          setProfile(w);
          setBio(w.bio || "");
          setHourlyRate(String(w.hourlyRate));
          setYearsExperience(String(w.yearsExperience));
          setLicenseNumber(w.licenseNumber || "");
          setSkills(w.skills || "");
          setIsAvailable(w.isAvailable);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const res = await authFetch("/api/worker/profile", {
      method: "PATCH",
      body: JSON.stringify({ bio, hourlyRate, yearsExperience, licenseNumber, skills, isAvailable }),
    });
    if (res.ok) {
      const data = await res.json();
      setProfile(data.worker);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } else {
      setMessage({ type: "error", text: "Failed to update profile. Please try again." });
    }
    setSaving(false);
  }

  const skillTags = skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (loading) {
    return (
      <div className="max-w-2xl space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="animate-fadeIn max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your worker profile and settings</p>
      </div>

      {message && (
        <div
          className={`mb-5 p-4 rounded-xl text-sm font-medium ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.type === "success" ? "✓" : "✕"} {message.text}
        </div>
      )}

      {/* Read-only info */}
      {profile && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5 flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-white">
            {profile.user.name[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900 text-lg">{profile.user.name}</p>
            <p className="text-sm text-gray-500">{profile.trade.icon} {profile.trade.name}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-yellow-500">
              {profile.rating > 0 ? profile.rating.toFixed(1) : "—"}
            </p>
            <p className="text-xs text-gray-400">{profile.reviewCount} review{profile.reviewCount !== 1 ? "s" : ""}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-5">
        {/* Availability toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">Available for jobs</p>
            <p className="text-sm text-gray-500">Toggle to show/hide on the platform</p>
          </div>
          <button
            onClick={() => setIsAvailable(!isAvailable)}
            className={`relative inline-flex w-12 h-6 rounded-full transition-colors ${isAvailable ? "bg-blue-600" : "bg-gray-200"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isAvailable ? "translate-x-6" : ""}`}
            />
          </button>
        </div>

        <hr className="border-gray-100" />

        {/* Bio */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bio / Description</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Tell customers about yourself and your experience..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Hourly rate + experience */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hourly Rate (USD)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="75.00"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Years of Experience</label>
            <input
              type="number"
              min="0"
              value={yearsExperience}
              onChange={(e) => setYearsExperience(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="5"
            />
          </div>
        </div>

        {/* License number */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">License Number (optional)</label>
          <input
            type="text"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="e.g. LIC-123456"
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Skills (comma-separated)</label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Plumbing, Pipe fitting, Drainage..."
          />
          {skillTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {skillTags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Read-only fields */}
        <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Read-only</p>
          <div className="flex justify-between">
            <span className="text-gray-600">Trade</span>
            <span className="font-medium text-gray-900">{profile?.trade.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Rating</span>
            <span className="font-medium text-gray-900">{profile?.rating.toFixed(1)} ★ ({profile?.reviewCount} reviews)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Current Rate</span>
            <span className="font-medium text-gray-900">{profile ? formatCurrency(profile.hourlyRate) : "—"}/hr</span>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
