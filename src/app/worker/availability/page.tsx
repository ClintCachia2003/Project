"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/api";

const DAYS = [
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
  { label: "Sunday", value: 0 },
];

function generateTimeOptions() {
  const options: { label: string; value: string }[] = [];
  for (let h = 6; h <= 22; h++) {
    for (const m of [0, 30]) {
      if (h === 22 && m > 0) break;
      const val = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      const ampm = h >= 12 ? "PM" : "AM";
      const h12 = h % 12 || 12;
      const label = `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
      options.push({ label, value: val });
    }
  }
  return options;
}

const TIME_OPTIONS = generateTimeOptions();

interface SlotState {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export default function WorkerAvailabilityPage() {
  const [slots, setSlots] = useState<SlotState[]>(
    DAYS.map((d) => ({
      dayOfWeek: d.value,
      startTime: "09:00",
      endTime: "17:00",
      isActive: d.value >= 1 && d.value <= 5,
    }))
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    authFetch("/api/worker/availability")
      .then((r) => r.json())
      .then((d) => {
        if (d.availability && d.availability.length > 0) {
          const map: Record<number, SlotState> = {};
          for (const a of d.availability) {
            map[a.dayOfWeek] = { dayOfWeek: a.dayOfWeek, startTime: a.startTime, endTime: a.endTime, isActive: a.isActive };
          }
          setSlots(DAYS.map((day) => map[day.value] || {
            dayOfWeek: day.value,
            startTime: "09:00",
            endTime: "17:00",
            isActive: day.value >= 1 && day.value <= 5,
          }));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function updateSlot(dayOfWeek: number, field: keyof SlotState, value: string | boolean) {
    setSlots((prev) =>
      prev.map((s) => (s.dayOfWeek === dayOfWeek ? { ...s, [field]: value } : s))
    );
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const res = await authFetch("/api/worker/availability", {
      method: "PUT",
      body: JSON.stringify({ slots }),
    });
    if (res.ok) {
      setMessage({ type: "success", text: "Availability saved successfully!" });
    } else {
      setMessage({ type: "error", text: "Failed to save availability. Please try again." });
    }
    setSaving(false);
  }

  return (
    <div className="animate-fadeIn max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Availability</h1>
        <p className="text-gray-500 mt-1">Set your working hours for each day of the week</p>
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

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {DAYS.map((day) => {
              const slot = slots.find((s) => s.dayOfWeek === day.value)!;
              return (
                <div key={day.value} className="flex items-center gap-4 p-4">
                  {/* Toggle */}
                  <button
                    onClick={() => updateSlot(day.value, "isActive", !slot.isActive)}
                    className={`relative inline-flex w-10 h-6 rounded-full transition-colors flex-shrink-0 ${
                      slot.isActive ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        slot.isActive ? "translate-x-4" : ""
                      }`}
                    />
                  </button>

                  {/* Day name */}
                  <span className={`w-24 text-sm font-medium ${slot.isActive ? "text-gray-900" : "text-gray-400"}`}>
                    {day.label}
                  </span>

                  {/* Time pickers */}
                  <div className={`flex items-center gap-2 flex-1 ${!slot.isActive ? "opacity-40 pointer-events-none" : ""}`}>
                    <select
                      value={slot.startTime}
                      onChange={(e) => updateSlot(day.value, "startTime", e.target.value)}
                      className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      {TIME_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    <span className="text-gray-400 text-sm">to</span>
                    <select
                      value={slot.endTime}
                      onChange={(e) => updateSlot(day.value, "endTime", e.target.value)}
                      className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      {TIME_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
