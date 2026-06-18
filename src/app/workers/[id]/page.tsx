"use client";

import { authFetch } from "@/lib/api";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import StarRating from "@/components/ui/StarRating";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatCurrency, formatDate, formatTime, DAY_NAMES, TIME_SLOTS } from "@/lib/utils";
import { addDays, format, startOfWeek, isSameDay, isPast, isToday } from "date-fns";

interface Worker {
  id: string;
  bio: string;
  hourlyRate: number;
  yearsExperience: number;
  licenseNumber?: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  serviceRadius: number;
  skills: string;
  availability: Array<{ dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }>;
  user: { id: string; name: string; email: string; avatar?: string; phone?: string; createdAt: string };
  trade: { name: string; icon: string; color: string; slug: string };
  reviews: Array<{ id: string; rating: number; comment: string; createdAt: string; author: { name: string; avatar?: string } }>;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export default function WorkerProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);

  // Booking state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingForm, setBookingForm] = useState({ description: "", address: "", city: "", notes: "" });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [activeTab, setActiveTab] = useState<"about" | "reviews" | "book">("about");

  // Calendar
  const today = new Date();
  const [calendarStart, setCalendarStart] = useState(startOfWeek(today, { weekStartsOn: 1 }));
  const calendarDays = Array.from({ length: 14 }, (_, i) => addDays(calendarStart, i));

  useEffect(() => {
    fetch(`/api/workers/${id}`)
      .then((r) => r.json())
      .then((d) => { setWorker(d.worker); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (selectedDate) loadSlots(selectedDate);
  }, [selectedDate]);

  async function loadSlots(date: Date) {
    setSlotsLoading(true);
    setSelectedSlot(null);
    const res = await authFetch(`/api/workers/${id}/availability?date=${format(date, "yyyy-MM-dd")}`);
    if (res.ok) {
      const data = await res.json();
      setSlots(data.slots || []);
    }
    setSlotsLoading(false);
  }

  function isDayAvailable(date: Date) {
    if (!worker) return false;
    if (isPast(date) && !isToday(date)) return false;
    const dayOfWeek = date.getDay();
    return worker.availability.some((a) => a.dayOfWeek === dayOfWeek && a.isActive);
  }

  async function handleBooking() {
    if (!user) { router.push("/login"); return; }
    if (!selectedDate || !selectedSlot) return;
    if (!bookingForm.description || !bookingForm.address || !bookingForm.city) {
      setBookingError("Please fill in all required fields");
      return;
    }

    setBookingLoading(true);
    setBookingError("");
    const res = await authFetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workerId: id,
        date: format(selectedDate, "yyyy-MM-dd"),
        startTime: selectedSlot,
        ...bookingForm,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      router.push(`/bookings/${data.booking.id}?success=true`);
    } else {
      setBookingError(data.error || "Booking failed");
      setBookingLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-48 bg-gray-100 rounded-2xl" />
          <div className="h-64 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-3">😕</p>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Worker not found</h2>
        <Link href="/trades" className="text-blue-600 hover:underline">Back to Trades</Link>
      </div>
    );
  }

  const skills = JSON.parse(worker.skills || "[]") as string[];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-700">Home</Link>
        <span>/</span>
        <Link href="/trades" className="hover:text-gray-700">Trades</Link>
        <span>/</span>
        <Link href={`/trades/${worker.trade.slug}`} className="hover:text-gray-700">{worker.trade.name}</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{worker.user.name}</span>
      </div>

      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-5">
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="w-20 h-20 rounded-2xl flex-shrink-0 shadow-lg overflow-hidden relative">
            {worker.user.avatar ? (
              <Image src={worker.user.avatar} alt={worker.user.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">{worker.user.name[0]}</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-gray-900">{worker.user.name}</h1>
                  {worker.isVerified && (
                    <span className="inline-flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified Pro
                    </span>
                  )}
                </div>
                <div
                  className="inline-flex items-center gap-1.5 mt-1 text-sm font-medium px-3 py-1 rounded-full"
                  style={{ backgroundColor: `${worker.trade.color}15`, color: worker.trade.color }}
                >
                  <span>{worker.trade.icon}</span>
                  {worker.trade.name}
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(worker.hourlyRate)}</p>
                <p className="text-sm text-gray-400">per hour</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <StarRating rating={worker.rating} size="md" />
                <span className="font-bold text-gray-900">{worker.rating.toFixed(1)}</span>
                <span className="text-sm text-gray-400">({worker.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>✅ {worker.completedJobs} jobs</span>
                <span>📅 {worker.yearsExperience} yrs exp</span>
                <span>📍 {worker.serviceRadius} mi radius</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification badges — most important trust signal */}
      {worker.isVerified && (
        <div className="bg-blue-950 rounded-2xl p-5 mb-5">
          <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-3">Verified by Verifix — all four checks passed</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: "🪪", label: "Identity Verified" },
              { icon: "📋", label: "Licence Confirmed" },
              { icon: "🛡️", label: "Insurance Checked" },
              { icon: "👥", label: "References Reviewed" },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-2 bg-blue-900/50 border border-blue-800/50 rounded-xl px-3 py-2.5">
                <span className="text-lg flex-shrink-0">{badge.icon}</span>
                <span className="text-xs font-semibold text-white">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-white rounded-2xl border border-gray-100 p-1 mb-5 overflow-x-auto">
        {[
          { key: "about", label: "About" },
          { key: "book", label: "📅 Book Now" },
          { key: "reviews", label: `Reviews (${worker.reviewCount})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as "about" | "reviews" | "book")}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* About tab */}
      {activeTab === "about" && (
        <div className="space-y-5 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-3">About</h3>
            <p className="text-gray-600 leading-relaxed">{worker.bio}</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-3">Skills & Specializations</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="info" className="text-sm px-3 py-1">{skill}</Badge>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Credentials</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Years of Experience", value: `${worker.yearsExperience} years` },
                { label: "Jobs Completed", value: worker.completedJobs.toString() },
                { label: "Licence Number", value: worker.licenseNumber || "Not provided" },
                { label: "Service Area", value: `${worker.serviceRadius} km radius` },
                { label: "Member Since", value: new Date(worker.user.createdAt).getFullYear().toString() },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">{item.label}</p>
                    <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Weekly Availability</h3>
            <div className="grid grid-cols-7 gap-2">
              {DAY_NAMES.map((day, i) => {
                const avail = worker.availability.find((a) => a.dayOfWeek === i);
                return (
                  <div key={day} className="text-center">
                    <p className="text-xs text-gray-400 mb-1">{day.slice(0, 3)}</p>
                    {avail?.isActive ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-1.5">
                        <p className="text-xs text-green-700 font-medium">{formatTime(avail.startTime)}</p>
                        <p className="text-xs text-green-600">–</p>
                        <p className="text-xs text-green-700 font-medium">{formatTime(avail.endTime)}</p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 border border-gray-100 rounded-lg p-1.5">
                        <p className="text-xs text-gray-400">Off</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Button className="w-full" size="lg" onClick={() => setActiveTab("book")}>
            📅 Book {worker.user.name.split(" ")[0]}
          </Button>
        </div>
      )}

      {/* Book tab */}
      {activeTab === "book" && (
        <div className="space-y-5 animate-fadeIn">
          {!user && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
              <p className="text-sm text-blue-700 font-medium mb-2">Sign in to book this professional</p>
              <Link href="/login" className="inline-block bg-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-blue-700 transition-colors">
                Sign In
              </Link>
            </div>
          )}

          {/* Calendar */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Select a Date</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCalendarStart(addDays(calendarStart, -7))}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCalendarStart(addDays(calendarStart, 7))}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <div key={i} className="text-center text-xs font-medium text-gray-400 pb-1">{d}</div>
              ))}
              {calendarDays.map((date) => {
                const available = isDayAvailable(date);
                const selected = selectedDate && isSameDay(date, selectedDate);
                const today2 = isToday(date);

                return (
                  <button
                    key={date.toISOString()}
                    disabled={!available}
                    onClick={() => { setSelectedDate(date); setShowBookingForm(false); setSelectedSlot(null); }}
                    className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-medium transition-all ${
                      selected
                        ? "bg-blue-600 text-white shadow-sm"
                        : today2 && available
                        ? "bg-blue-50 text-blue-600 border border-blue-200"
                        : available
                        ? "hover:bg-gray-100 text-gray-900 cursor-pointer"
                        : "text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    <span className="text-xs">{format(date, "d")}</span>
                    {available && !selected && (
                      <span className="w-1 h-1 bg-green-500 rounded-full mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-fadeIn">
              <h3 className="font-bold text-gray-900 mb-1">Available Times</h3>
              <p className="text-sm text-gray-500 mb-4">{formatDate(selectedDate)}</p>

              {slotsLoading ? (
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : slots.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No available time slots for this day</p>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot.time}
                      disabled={!slot.available}
                      onClick={() => { setSelectedSlot(slot.time); setShowBookingForm(true); }}
                      className={`py-2.5 text-sm font-medium rounded-xl transition-all ${
                        selectedSlot === slot.time
                          ? "bg-blue-600 text-white shadow-sm"
                          : slot.available
                          ? "bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
                          : "bg-gray-50 text-gray-300 cursor-not-allowed line-through"
                      }`}
                    >
                      {formatTime(slot.time)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Booking form */}
          {showBookingForm && selectedDate && selectedSlot && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-fadeIn">
              <h3 className="font-bold text-gray-900 mb-4">Booking Details</h3>

              <div className="bg-blue-50 rounded-xl p-4 mb-5 text-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-blue-900">{worker.user.name}</p>
                    <p className="text-blue-700">{formatDate(selectedDate)} at {formatTime(selectedSlot)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-900 text-lg">{formatCurrency(worker.hourlyRate)}</p>
                    <p className="text-blue-600 text-xs">estimated total</p>
                  </div>
                </div>
              </div>

              {bookingError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  {bookingError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Describe the work needed <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={bookingForm.description}
                    onChange={(e) => setBookingForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Please describe what needs to be done in detail..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bookingForm.address}
                      onChange={(e) => setBookingForm((p) => ({ ...p, address: e.target.value }))}
                      placeholder="e.g. 14, Triq il-Ħelsien"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bookingForm.city}
                      onChange={(e) => setBookingForm((p) => ({ ...p, city: e.target.value }))}
                      placeholder="e.g. Sliema, Naxxar, Valletta"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Additional Notes
                  </label>
                  <textarea
                    rows={2}
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm((p) => ({ ...p, notes: e.target.value }))}
                    placeholder="Any special instructions, gate codes, parking info..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleBooking}
                  loading={bookingLoading}
                  disabled={!user}
                >
                  Confirm Booking — {formatCurrency(worker.hourlyRate)}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reviews tab */}
      {activeTab === "reviews" && (
        <div className="space-y-4 animate-fadeIn">
          {worker.reviews.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <p className="text-3xl mb-2">⭐</p>
              <p className="text-gray-500">No reviews yet</p>
            </div>
          ) : (
            worker.reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">{review.author.name[0]}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-gray-900">{review.author.name}</span>
                      <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <StarRating rating={review.rating} size="sm" />
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
