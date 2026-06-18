"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password, phone: form.phone });
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
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
            <span className="font-bold text-2xl text-gray-900">Verifix</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-1">Find and book vetted tradespeople across Malta</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {error && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Maria Borg"
              required
            />
            <Input
              label="Email address"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@example.com"
              required
            />
            <Input
              label="Phone Number"
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="+356 9900 0000"
            />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="Min 8 characters"
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => update("confirmPassword", e.target.value)}
              placeholder="Repeat your password"
              required
            />

            <p className="text-xs text-gray-400">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
            </p>

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Create Account
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
            Sign in
          </Link>
        </p>

        {/* Tradesperson CTA — separate and prominent */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-5 text-center">
          <p className="text-sm font-semibold text-blue-900 mb-1">Are you a tradesperson?</p>
          <p className="text-xs text-blue-700 mb-3">This form is for customers only. Tradespeople join through a separate vetting application.</p>
          <Link
            href="/apply"
            className="inline-block bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Apply to Join as a Pro →
          </Link>
        </div>
      </div>
    </div>
  );
}
