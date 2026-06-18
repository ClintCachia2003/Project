"use client";

import { useState } from "react";
import Link from "next/link";

const TRADES = [
  "Plumber", "Electrician", "Carpenter", "AC / HVAC Engineer", "Painter",
  "Tiler", "Mason / Builder", "Welder", "Roofer", "Landscaper", "Other",
];

const vettingSteps = [
  { icon: "🪪", label: "Identity verification (government-issued ID)" },
  { icon: "📋", label: "Trade licence check with Maltese authority" },
  { icon: "🛡️", label: "Confirmation of active public liability insurance" },
  { icon: "👥", label: "Direct contact with your professional references" },
];

export default function ApplyPage() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", trade: "",
    yearsExperience: "", licenseNumber: "", bio: "",
    hasInsurance: false, agreeToVetting: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Simulate submission — wire to a real API endpoint or email service later
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center animate-fadeIn">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <span className="text-3xl">✅</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Application Received</h1>
          <p className="text-gray-600 mb-2">
            Thank you, <strong>{form.name}</strong>. We&apos;ve received your application to join as a verified tradesperson.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Our team personally reviews every application. We&apos;ll contact you at <strong>{form.email}</strong> within 2–3 working days to begin the vetting process.
          </p>
          <Link href="/" className="inline-block bg-blue-600 text-white font-semibold px-7 py-3 rounded-2xl hover:bg-blue-700 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-blue-900 text-white py-14">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-blue-300 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span>Apply as a Tradesperson</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Apply to Join the Platform</h1>
          <p className="text-blue-200 text-lg max-w-2xl">
            We&apos;re building Malta&apos;s most trusted marketplace for skilled tradespeople. If you&apos;re licensed, insured, and serious about quality work — we want you on board.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <h2 className="font-bold text-gray-900 mb-1">What happens next?</h2>
            <p className="text-sm text-gray-600 mb-4">Every applicant goes through our personal vetting process before being listed.</p>
            <ul className="space-y-3">
              {vettingSteps.map((step) => (
                <li key={step.label} className="flex gap-3 text-sm">
                  <span className="text-lg flex-shrink-0">{step.icon}</span>
                  <span className="text-gray-700">{step.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 mb-3">Why join?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {[
                "Verified badge builds instant trust with customers",
                "Consistent pipeline of serious job requests",
                "Transparent pricing — you set your own rates",
                "Reviews from real completed jobs build your reputation",
                "Get paid securely through the platform",
              ].map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="text-green-500 font-bold flex-shrink-0">✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-sm text-gray-500">
            <strong className="text-gray-700 block mb-1">Applications are reviewed personally</strong>
            This is not an automated system. A member of our team will contact you within 2–3 working days.
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Your Application</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Joseph Borg"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="joseph@example.com"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+356 9900 0000"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Trade <span className="text-red-500">*</span></label>
                  <select
                    required
                    value={form.trade}
                    onChange={(e) => update("trade", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select your trade...</option>
                    {TRADES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Years of Experience <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={form.yearsExperience}
                    onChange={(e) => update("yearsExperience", e.target.value)}
                    placeholder="e.g. 8"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Trade Licence Number</label>
                  <input
                    type="text"
                    value={form.licenseNumber}
                    onChange={(e) => update("licenseNumber", e.target.value)}
                    placeholder="e.g. MT-PLB-2019-0042"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">About You <span className="text-red-500">*</span></label>
                <textarea
                  required
                  rows={4}
                  value={form.bio}
                  onChange={(e) => update("bio", e.target.value)}
                  placeholder="Tell us about your experience, the type of work you specialise in, and why customers choose you..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={form.hasInsurance}
                    onChange={(e) => update("hasInsurance", e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-blue-600"
                  />
                  <span className="text-sm text-gray-700">
                    I confirm that I hold active <strong>public liability insurance</strong> for my trade work.
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={form.agreeToVetting}
                    onChange={(e) => update("agreeToVetting", e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-blue-600"
                  />
                  <span className="text-sm text-gray-700">
                    I understand and consent to the personal vetting process — including identity check, licence verification, insurance confirmation, and reference contact.
                  </span>
                </label>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                <strong>Important:</strong> Submitting this form does not guarantee listing on the platform. All applicants are reviewed by our team. Approval is at our discretion based on vetting results.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-2xl transition-colors shadow-sm disabled:opacity-60 text-sm"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
