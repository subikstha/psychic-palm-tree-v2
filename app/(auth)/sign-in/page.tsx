"use client";

import { useState } from "react";

export default function SignInPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md">
        {/* Glassmorphic Card */}
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 blur-[80px]" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 blur-[80px]" />

          <div className="relative">
            <h1 className="text-3xl font-bold text-white mb-2 text-center">
              {isLogin ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-zinc-400 text-center mb-8">
              {isLogin
                ? "Enter your details to sign in"
                : "Fill in the form to get started"}
            </p>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-300 mb-1.5"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="name@example.com"
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-zinc-300 mb-1.5"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>

              {!isLogin && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-zinc-300 mb-1.5"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    placeholder="••••••••"
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg mt-4 transition-colors shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
              >
                {isLogin ? "Sign In" : "Register"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-zinc-400 text-sm">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-white font-medium hover:underline hover:text-indigo-400 transition-colors"
                >
                  {isLogin ? "Create account" : "Log in"}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <p className="mt-8 text-center text-zinc-500 text-xs">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
