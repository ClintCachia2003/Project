"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import StarRating from "@/components/ui/StarRating";
import Badge from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";

interface Worker {
  id: string;
  bio: string;
  hourlyRate: number;
  yearsExperience: number;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  skills: string;
  user: { id: string; name: string; avatar?: string };
  trade: { name: string; icon: string; color: string };
}

export default function TradePage() {
  const { slug } = useParams();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [trade, setTrade] = useState<{ name: string; icon: string; description: string; color: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("rating");
  const [maxRate, setMaxRate] = useState("");
  const [minRating, setMinRating] = useState("");

  useEffect(() => {
    loadWorkers();
  }, [slug, sortBy, maxRate, minRating]);

  async function loadWorkers() {
    setLoading(true);
    const params = new URLSearchParams({ trade: slug as string, sortBy });
    if (maxRate) params.set("maxRate", maxRate);
    if (minRating) params.set("minRating", minRating);

    const res = await fetch(`/api/workers?${params}`);
    if (res.ok) {
      const data = await res.json();
      setWorkers(data.workers || []);
      if (data.workers?.[0]?.trade) setTrade(data.workers[0].trade);
    }
    setLoading(false);
  }

  // Fetch trade info even if no workers
  useEffect(() => {
    fetch("/api/trades")
      .then((r) => r.json())
      .then((d) => {
        const t = d.trades?.find((tr: { slug: string; name: string; icon: string; description: string; color: string }) => tr.slug === slug);
        if (t) setTrade(t);
      });
  }, [slug]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-700">Home</Link>
        <span>/</span>
        <Link href="/trades" className="hover:text-gray-700">Trades</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{trade?.name || slug}</span>
      </div>

      {/* Trade header */}
      {trade && (
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ backgroundColor: `${trade.color}18` }}>
            {trade.icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{trade.name} Professionals</h1>
            <p className="text-gray-500 mt-1">{trade.description}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="rating">Top Rated</option>
            <option value="price">Lowest Price</option>
            <option value="experience">Most Experienced</option>
            <option value="jobs">Most Jobs</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Max rate:</label>
          <select
            value={maxRate}
            onChange={(e) => setMaxRate(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Any</option>
            <option value="50">Up to $50/hr</option>
            <option value="75">Up to $75/hr</option>
            <option value="100">Up to $100/hr</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Min rating:</label>
          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Any</option>
            <option value="4">4.0+</option>
            <option value="4.5">4.5+</option>
            <option value="4.8">4.8+</option>
          </select>
        </div>

        <span className="ml-auto text-sm text-gray-500">{workers.length} pros found</span>
      </div>

      {/* Workers list */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : workers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-4xl mb-3">👷</p>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No professionals found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {workers.map((worker) => {
            const skills = JSON.parse(worker.skills || "[]") as string[];
            return (
              <Link
                key={worker.id}
                href={`/workers/${worker.id}`}
                className="group block bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl font-bold">{worker.user.name[0]}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{worker.user.name}</h3>
                          {worker.isVerified && (
                            <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <div className="flex items-center gap-1">
                            <StarRating rating={worker.rating} size="sm" />
                            <span className="text-sm font-semibold text-gray-900">{worker.rating.toFixed(1)}</span>
                            <span className="text-xs text-gray-400">({worker.reviewCount})</span>
                          </div>
                          <span className="text-gray-200">|</span>
                          <span className="text-xs text-gray-500">{worker.yearsExperience} yrs experience</span>
                          <span className="text-gray-200">|</span>
                          <span className="text-xs text-gray-500">{worker.completedJobs} jobs done</span>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(worker.hourlyRate)}</p>
                        <p className="text-xs text-gray-400">per hour</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{worker.bio}</p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {skills.slice(0, 4).map((skill) => (
                        <Badge key={skill} variant="info">{skill}</Badge>
                      ))}
                      {skills.length > 4 && (
                        <Badge variant="default">+{skills.length - 4}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
