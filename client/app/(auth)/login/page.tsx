"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter();


  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/api/v1/auth/login", formData);

      // store JWT in cookies
      document.cookie = `token=${res.data.token}; path=/; max-age=3600`; // 1 hour expiry
      // localStorage.setItem("token", res.data.token);

      // redirect after login
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-sm border border-gray-200"
      >
        <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-700">Login</h2>

        <div className="mb-5">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            autoComplete="email"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            autoComplete="current-password"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="text-black text-center mt-4">Don't have an Account ? <Link href="/register" className="text-blue-600">Register</Link></div>
      </form>



    </div>
  );
}
