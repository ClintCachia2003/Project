"use client";

import { authFetch } from "@/lib/api";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency, formatDate, formatTime, getStatusColor, getStatusLabel } from "@/lib/utils";
import Button from "@/components/ui/Button";
import StarRating from "@/components/ui/StarRating";
import { Suspense } from "react";

interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  totalAmount: number;
  description: string;
  address: string;
  city: string;
  notes?: string;
  cancelReason?: string;
  createdAt: string;
  customer: { id: string; name: string; email: string; avatar?: string; phone?: string };
  worker: {
    id: string;
    hourlyRate: number;
    user: { id: string; name: string; avatar?: string; phone?: string };
    trade: { name: string; icon: string; color: string };
  };
  review?: { rating: number; comment: string; author: { name: string } };
  payment?: { status: string; amount: number; paidAt?: string };
  dispute?: { id: string; status: string; reason: string; description: string; resolution?: string };
}

function BookingDetailContent() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [disputeReason, setDisputeReason] = useState("Work not completed");
  const [disputeDescription, setDisputeDescription] = useState("");
  const [disputeLoading, setDisputeLoading] = useState(false);
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      authFetch(`/api/bookings/${id}`)
        .then((r) => r.json())
        .then((d) => { setBooking(d.booking); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [id, user]);

  async function updateStatus(status: string) {
    setActionLoading(true);
    const res = await authFetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, cancelReason: cancelReason || undefined }),
    });
    if (res.ok) {
      const data = await res.json();
      setBooking((prev) => prev ? { ...prev, status: data.booking.status, cancelReason: data.booking.cancelReason } : null);
      setShowCancelForm(false);
    }
    setActionLoading(false);
  }

  async function handleMarkAsPaid() {
    setPaymentLoading(true);
    const res = await authFetch("/api/payments/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: id }),
    });
    if (res.ok) {
      setPaymentSuccess(true);
      setShowPayment(false);
      setBooking((prev) => prev ? { ...prev, payment: { status: "completed", amount: prev.totalAmount } } : null);
    }
    setPaymentLoading(false);
  }

  async function submitDispute() {
    if (!disputeDescription.trim()) return;
    setDisputeLoading(true);
    const res = await authFetch("/api/disputes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: id, reason: disputeReason, description: disputeDescription }),
    });
    if (res.ok) {
      const data = await res.json();
      setBooking((prev) => prev ? { ...prev, dispute: data.dispute } : null);
      setDisputeSubmitted(true);
      setShowDisputeForm(false);
    }
    setDisputeLoading(false);
  }

  async function submitReview() {
    if (!reviewComment.trim()) return;
    setReviewLoading(true);
    const res = await authFetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: id, rating: reviewRating, comment: reviewComment }),
    });
    if (res.ok) {
      const data = await res.json();
      setBooking((prev) => prev ? { ...prev, review: { ...data.review, author: { name: user!.name } } } : null);
      setShowReviewForm(false);
    }
    setReviewLoading(false);
  }

  if (authLoading || !user || loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-100 rounded w-1/3" />
          <div className="h-48 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-3">😕</p>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Booking not found</h2>
        <Link href="/bookings" className="text-blue-600 hover:underline">Back to Bookings</Link>
      </div>
    );
  }

  const isCustomer = user.id === booking.customer.id;
  const isWorker = user.id === booking.worker.user.id;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 animate-fadeIn">
      {/* Success banner */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-green-800">Booking Submitted!</p>
            <p className="text-sm text-green-700">Your booking is pending confirmation. You&apos;ll be notified once confirmed.</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <Link href="/bookings" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Booking Details</h1>
        <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
          {getStatusLabel(booking.status)}
        </span>
      </div>

      {/* Worker / Customer info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
            {booking.worker.trade.icon}
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900">{isCustomer ? booking.worker.user.name : booking.customer.name}</p>
            <p className="text-sm text-gray-500">{booking.worker.trade.name}</p>
          </div>
          {!isWorker && (
            <Link href={`/workers/${booking.worker.id}`} className="text-sm text-blue-600 font-medium hover:underline">
              View Profile
            </Link>
          )}
        </div>
      </div>

      {/* Booking info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 space-y-4">
        <h3 className="font-bold text-gray-900">Appointment Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            { label: "Date", value: formatDate(booking.date) },
            { label: "Time", value: `${formatTime(booking.startTime)} – ${formatTime(booking.endTime)}` },
            { label: "Address", value: booking.address },
            { label: "City", value: booking.city },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
              <p className="font-medium text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>

        <div>
          <p className="text-xs text-gray-400 mb-0.5">Description</p>
          <p className="text-sm text-gray-700">{booking.description}</p>
        </div>

        {booking.notes && (
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Additional Notes</p>
            <p className="text-sm text-gray-700">{booking.notes}</p>
          </div>
        )}

        {booking.cancelReason && (
          <div className="p-3 bg-red-50 rounded-xl">
            <p className="text-xs text-red-400 mb-0.5">Cancellation Reason</p>
            <p className="text-sm text-red-700">{booking.cancelReason}</p>
          </div>
        )}
      </div>

      {/* Payment */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
        <h3 className="font-bold text-gray-900 mb-3">Payment</h3>
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-sm text-gray-500">Service Fee</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(booking.totalAmount)}</p>
          </div>
          <div className={`px-3 py-1.5 rounded-xl text-sm font-medium ${
            booking.payment?.status === "completed" || booking.payment?.status === "paid"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}>
            {booking.payment?.status === "completed" || booking.payment?.status === "paid"
              ? "✓ Paid"
              : "⏳ Pending"}
          </div>
        </div>

        {/* Pay Now section */}
        {isCustomer && booking.status === "confirmed" &&
          (!booking.payment || (booking.payment.status !== "completed" && booking.payment.status !== "paid")) && (
          <>
            {!showPayment ? (
              <Button className="w-full" variant="outline" onClick={() => setShowPayment(true)}>
                💳 Pay Now
              </Button>
            ) : (
              <div className="mt-3 p-4 bg-blue-50 rounded-xl border border-blue-200 space-y-3">
                <p className="text-sm font-semibold text-blue-900">Payment Integration</p>
                <p className="text-sm text-blue-700">
                  Payment integration ready. Add your Stripe keys to .env to enable live payments.
                </p>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={handleMarkAsPaid} loading={paymentLoading}>
                    Mark as Paid (Test)
                  </Button>
                  <Button variant="ghost" onClick={() => setShowPayment(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </>
        )}

        {paymentSuccess && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
            ✓ Payment recorded successfully
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {/* Worker actions */}
        {isWorker && booking.status === "pending" && (
          <div className="flex gap-3">
            <Button className="flex-1" onClick={() => updateStatus("confirmed")} loading={actionLoading}>
              Confirm Booking
            </Button>
            <Button variant="danger" className="flex-1" onClick={() => setShowCancelForm(true)}>
              Decline
            </Button>
          </div>
        )}

        {isWorker && booking.status === "confirmed" && (
          <Button className="w-full" onClick={() => updateStatus("completed")} loading={actionLoading}>
            Mark as Completed
          </Button>
        )}

        {/* Customer actions */}
        {isCustomer && ["pending", "confirmed"].includes(booking.status) && (
          <>
            {!showCancelForm ? (
              <Button variant="danger" className="w-full" onClick={() => setShowCancelForm(true)}>
                Cancel Booking
              </Button>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
                <p className="font-medium text-gray-900 text-sm">Reason for cancellation</p>
                <textarea
                  rows={2}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please provide a reason..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <div className="flex gap-2">
                  <Button variant="danger" className="flex-1" onClick={() => updateStatus("cancelled")} loading={actionLoading}>
                    Confirm Cancel
                  </Button>
                  <Button variant="ghost" onClick={() => setShowCancelForm(false)}>
                    Back
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Review */}
        {isCustomer && booking.status === "completed" && !booking.review && (
          <>
            {!showReviewForm ? (
              <Button variant="outline" className="w-full" onClick={() => setShowReviewForm(true)}>
                ⭐ Leave a Review
              </Button>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                <h3 className="font-bold text-gray-900">Leave a Review</h3>
                <div>
                  <p className="text-sm text-gray-700 mb-2">Your rating</p>
                  <StarRating rating={reviewRating} size="lg" interactive onRate={setReviewRating} />
                </div>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience with this professional..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={submitReview} loading={reviewLoading}>
                    Submit Review
                  </Button>
                  <Button variant="ghost" onClick={() => setShowReviewForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Existing review */}
        {booking.review && (
          <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4">
            <p className="text-xs text-yellow-600 font-medium mb-2">Your Review</p>
            <StarRating rating={booking.review.rating} size="sm" />
            <p className="text-sm text-gray-700 mt-2">{booking.review.comment}</p>
          </div>
        )}

        {/* Dispute section */}
        {isCustomer && ["completed", "cancelled"].includes(booking.status) && (
          <>
            {booking.dispute || disputeSubmitted ? (
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
                <p className="text-xs text-orange-600 font-medium mb-1">⚖️ Dispute Opened</p>
                <p className="text-sm text-gray-700">
                  Reason: {booking.dispute?.reason || disputeReason}
                </p>
                <p className="text-xs text-gray-500 mt-1 capitalize">
                  Status: {booking.dispute?.status || "open"}
                </p>
                {booking.dispute?.resolution && (
                  <p className="text-sm text-gray-700 mt-2">Resolution: {booking.dispute.resolution}</p>
                )}
              </div>
            ) : !showDisputeForm ? (
              <Button variant="outline" className="w-full" onClick={() => setShowDisputeForm(true)}>
                ⚖️ Open Dispute
              </Button>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                <h3 className="font-bold text-gray-900">Open a Dispute</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason</label>
                  <select
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {["Work not completed", "Poor quality", "No show", "Overcharged", "Other"].map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea
                    rows={3}
                    value={disputeDescription}
                    onChange={(e) => setDisputeDescription(e.target.value)}
                    placeholder="Describe the issue in detail..."
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={submitDispute} loading={disputeLoading}>
                    Submit Dispute
                  </Button>
                  <Button variant="ghost" onClick={() => setShowDisputeForm(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function BookingDetailPage() {
  return (
    <Suspense>
      <BookingDetailContent />
    </Suspense>
  );
}
