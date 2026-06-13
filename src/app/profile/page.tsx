"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ProfilePage() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
      });
    }
  }, [user]);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      await refreshUser();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      const data = await res.json();
      setError(data.error || "Failed to update profile");
    }
    setLoading(false);
  }

  if (authLoading || !user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-500 mt-1">Update your personal information</p>
      </div>

      {/* Avatar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center">
            <span className="text-white text-2xl font-bold">{user.name[0]}</span>
          </div>
          <div>
            <p className="font-bold text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="mt-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                user.role === "worker" ? "bg-purple-100 text-purple-700" :
                user.role === "admin" ? "bg-red-100 text-red-700" :
                "bg-blue-100 text-blue-700"
              }`}>
                {user.role === "worker" ? "Pro" : user.role === "admin" ? "Admin" : "Customer"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-5">Personal Information</h2>

        {success && (
          <div className="mb-4 p-3.5 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
            ✓ Profile updated successfully
          </div>
        )}

        {error && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="John Doe"
          />
          <Input
            label="Phone Number"
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+1 (555) 000-0000"
          />
          <Input
            label="Street Address"
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="123 Main St"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              placeholder="New York"
            />
            <Input
              label="State"
              value={form.state}
              onChange={(e) => update("state", e.target.value)}
              placeholder="NY"
            />
          </div>
          <Input
            label="ZIP Code"
            value={form.zipCode}
            onChange={(e) => update("zipCode", e.target.value)}
            placeholder="10001"
          />

          <Button type="submit" size="lg" className="w-full" loading={loading}>
            Save Changes
          </Button>
        </form>
      </div>

      {/* Account info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-5">
        <h2 className="font-bold text-gray-900 mb-4">Account</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Email Address</span>
            <span className="text-sm font-medium text-gray-900">{user.email}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Account Type</span>
            <span className="text-sm font-medium text-gray-900 capitalize">{user.role}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">Password</span>
            <button className="text-sm text-blue-600 hover:underline font-medium">Change Password</button>
          </div>
        </div>
      </div>
    </div>
  );
}
