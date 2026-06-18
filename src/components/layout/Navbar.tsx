"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { authFetch } from "@/lib/api";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  interface Notification {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    link?: string;
  }

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("tradepro_token") : null;
    if (!token) return;

    const es = new EventSource(`/api/notifications/stream?token=${encodeURIComponent(token)}`);
    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "notification" && data.notification) {
          setUnreadCount((prev) => prev + 1);
          setNotifications((prev) => [data.notification, ...prev]);
        }
      } catch {
        // ignore parse errors
      }
    };
    return () => es.close();
  }, [user]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function fetchNotifications() {
    const res = await authFetch("/api/notifications");
    if (res.ok) {
      const data = await res.json();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    }
  }

  async function markAllRead() {
    await authFetch("/api/notifications", { method: "PATCH" });
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  const navLinks = [
    { href: "/trades", label: "Find a Tradesperson" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/apply", label: "Join as a Pro" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Verifix</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${pathname.startsWith(link.href) ? "text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) markAllRead(); }}
                    className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                        <span className="font-semibold text-gray-900">Notifications</span>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="text-center text-gray-500 py-6 text-sm">No notifications</p>
                        ) : (
                          notifications.map((n) => (
                            <div key={n.id} className={`px-4 py-3 border-b border-gray-50 last:border-0 ${!n.isRead ? "bg-blue-50/50" : ""}`}>
                              <p className="text-sm font-medium text-gray-900">{n.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{user.name[0].toUpperCase()}</span>
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700">{user.name.split(" ")[0]}</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">Dashboard</Link>
                        <Link href="/bookings" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">My Bookings</Link>
                        <Link href="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">Profile Settings</Link>
                        {user.role === "worker" && (
                          <Link href="/worker" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-green-700 font-medium hover:bg-green-50">
                            🔧 Worker Panel
                          </Link>
                        )}
                        {user.role === "admin" && (
                          <Link href="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-purple-700 font-medium hover:bg-purple-50">
                            ⚙️ Admin Panel
                          </Link>
                        )}
                        <hr className="my-1 border-gray-100" />
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors">
                  Sign In
                </Link>
                <Link href="/register" className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
