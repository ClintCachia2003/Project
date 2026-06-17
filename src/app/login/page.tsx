"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const TEST_ACCOUNTS = [
  { label: "Customer Demo", email: "demo@tradepro.com", password: "demo1234", role: "customer", color: "bg-blue-50 border-blue-200 text-blue-700" },
  { label: "Admin", email: "admin@tradepro.com", password: "Admin@TradePro1", role: "admin", color: "bg-purple-50 border-purple-200 text-purple-700" },
];

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  async function quickLogin(acc: typeof TEST_ACCOUNTS[0]) {
    setError("");
    setQuickLoading(acc.role);
    try {
      await login(acc.email, acc.password);
      router.push(acc.role === "admin" ? "/admin" : "/dashboard");
    } catch {
      setError("Quick login failed. Please run the seed first.");
    } finally {
      setQuickLoading(null);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md animate-fadeIn">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="font-bold text-2xl text-gray-900">TradePro</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 mt-1">Sign in to your account</p>
        </div>

        {/* Quick login cards */}
        <div className="mb-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 text-center">Quick Access</p>
          <div className="grid grid-cols-2 gap-2">
            {TEST_ACCOUNTS.map((acc) => (
              <button
                key={acc.role}
                onClick={() => quickLogin(acc)}
                disabled={!!quickLoading}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all hover:opacity-80 disabled:opacity-50 ${acc.color}`}
              >
                <span className="text-xs font-bold mb-0.5">{acc.label}</span>
                <span className="text-xs opacity-75">{acc.email}</span>
                {quickLoading === acc.role && <span className="text-xs mt-1">Signing in...</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 bg-gray-50 text-sm text-gray-400">or sign in manually</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {error && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}
