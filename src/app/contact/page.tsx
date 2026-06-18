"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <div className="animate-fadeIn">
      <section className="bg-gradient-to-br from-gray-900 to-blue-900 text-white py-14">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-blue-200 text-lg">Questions, feedback, or need help with a booking — we&apos;re here.</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {submitted ? (
          <div className="text-center py-16 animate-fadeIn">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Message sent</h2>
            <p className="text-gray-500 mb-6">We&apos;ll get back to you at <strong>{form.email}</strong> within 1 working day.</p>
            <Link href="/" className="text-blue-600 font-medium hover:underline">Back to Home</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Email</h3>
                <p className="text-sm text-gray-600">hello@verifix.mt</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Tradespeople applying</h3>
                <p className="text-sm text-gray-600 mb-2">Use the dedicated application form for the fastest response.</p>
                <Link href="/apply" className="text-sm text-blue-600 font-medium hover:underline">Apply to join →</Link>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Response time</h3>
                <p className="text-sm text-gray-600">Within 1 working day for all enquiries.</p>
              </div>
            </div>

            <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                    <input required type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Maria Borg" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="you@example.com" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                  <select value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">Select a topic...</option>
                    <option>I have a question about a booking</option>
                    <option>I want to report a problem</option>
                    <option>I&apos;m a tradesperson with a question</option>
                    <option>General enquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                  <textarea required rows={5} value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} placeholder="Tell us how we can help..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-2xl transition-colors disabled:opacity-50 text-sm">
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
