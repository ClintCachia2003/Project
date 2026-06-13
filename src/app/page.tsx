"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Trade {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  _count: { workers: number };
}

const stats = [
  { label: "Verified Pros", value: "500+" },
  { label: "Happy Customers", value: "10,000+" },
  { label: "Jobs Completed", value: "25,000+" },
  { label: "Cities Covered", value: "50+" },
];

const testimonials = [
  { name: "Jennifer A.", rating: 5, text: "Found an amazing electrician within minutes. He was professional, on time, and did a fantastic job upgrading my panel.", trade: "Electrical" },
  { name: "Robert M.", rating: 5, text: "The HVAC tech was incredible. Fixed my AC in under an hour and explained everything. Will definitely use TradePro again.", trade: "HVAC" },
  { name: "Sarah K.", rating: 5, text: "Booked a plumber for an emergency leak at 9pm. He arrived within the hour. Lifesaver! The booking process was so easy.", trade: "Plumbing" },
];

export default function HomePage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/trades")
      .then((r) => r.json())
      .then((d) => { setTrades(d.trades || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/trades?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/trades");
    }
  }

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-blue-300 text-sm font-medium">Trusted by 10,000+ homeowners</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Find the Right Pro
              <span className="block text-blue-400">For Any Trade Job</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              Book verified carpenters, electricians, plumbers, HVAC technicians, and more — all on your schedule. No phone calls, no hassle.
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="flex-1 relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What trade do you need? (e.g. plumber)"
                  className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/15 transition-all text-sm"
                />
              </div>
              <button
                type="submit"
                className="px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-2xl transition-colors shadow-lg hover:shadow-blue-500/25 text-sm whitespace-nowrap"
              >
                Find a Pro
              </button>
            </form>

            <div className="flex flex-wrap gap-2 mt-4">
              {["Electrician", "Plumber", "Carpenter", "HVAC"].map((t) => (
                <Link
                  key={t}
                  href={`/trades/${t.toLowerCase()}`}
                  className="text-xs bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white px-3 py-1.5 rounded-full border border-white/10 transition-colors"
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-blue-600">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trades Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Browse by Trade</h2>
          <p className="text-gray-500 text-lg">Choose from our wide range of professional services</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-36 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {trades.map((trade) => (
              <Link
                key={trade.id}
                href={`/trades/${trade.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${trade.color}15` }}
                >
                  {trade.icon}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">{trade.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{trade._count.workers} pros available</p>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link href="/trades" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors">
            View all trades
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">How TradePro Works</h2>
            <p className="text-gray-500 text-lg">Book a pro in 3 easy steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", icon: "🔍", title: "Choose a Trade", desc: "Browse from 12+ trade categories and find the service you need." },
              { step: "2", icon: "👷", title: "Pick Your Pro", desc: "View profiles, ratings, and availability. Choose the best pro for you." },
              { step: "3", icon: "📅", title: "Book & Relax", desc: "Select a time slot, confirm your booking, and leave the rest to the pros." },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="relative inline-block mb-5">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl mx-auto group-hover:bg-blue-100 transition-colors">
                    {item.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/trades" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-2xl transition-colors shadow-sm">
              Book a Pro Now
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">What Our Customers Say</h2>
          <p className="text-gray-500">Real reviews from real homeowners</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{t.name[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.trade} Service</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 text-lg mb-8">Join thousands of homeowners who trust TradePro for their home service needs.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-white text-blue-600 font-semibold px-8 py-3.5 rounded-2xl hover:bg-blue-50 transition-colors shadow-sm">
              Create Account
            </Link>
            <Link href="/trades" className="border-2 border-white/50 text-white font-semibold px-8 py-3.5 rounded-2xl hover:bg-white/10 transition-colors">
              Browse Trades
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
