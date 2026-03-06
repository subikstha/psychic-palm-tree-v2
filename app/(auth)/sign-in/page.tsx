"use client";

import {
  signInWithCredentials,
  signUpWithCredentials,
} from "@/lib/actions/user.action";
import { useActionState, useState } from "react";

export default function SignInPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [signUpdata, signUpAction] = useActionState(signUpWithCredentials, {
    success: false,
    message: "",
  });
  const [signInData, signInAction] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md">
        {/* Glassmorphic Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          {/* Subtle Background Glow */}
          <div className="absolute -top-24 -right-24 h-48 w-48 bg-indigo-500/20 blur-[80px]" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 bg-purple-500/20 blur-[80px]" />

          <div className="relative">
            <h1 className="mb-2 text-center text-3xl font-bold text-white">
              {isLogin ? "Welcome back" : "Create account"}
            </h1>
            <p className="mb-8 text-center text-zinc-400">
              {isLogin
                ? "Enter your details to sign in"
                : "Fill in the form to get started"}
            </p>

            <form
              className="space-y-4"
              action={!isLogin ? signUpAction : signInAction}
            >
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium text-zinc-300"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Full Name"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-white transition-all placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-zinc-300"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-white transition-all placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-zinc-300"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-white transition-all placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
                />
              </div>

              {!isLogin && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label
                    htmlFor="confirm-password"
                    className="mb-1.5 block text-sm font-medium text-zinc-300"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    name="confirm-password"
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-white transition-all placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
                  />
                </div>
              )}

              <button
                type="submit"
                className="mt-4 w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 transition-colors hover:bg-indigo-500 active:scale-[0.98]"
              >
                {isLogin ? "Sign In" : "Register"}
              </button>

              {signUpdata.message && (
                <p
                  className={`mt-4 text-center text-sm ${
                    signUpdata.success ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {signUpdata.message}
                </p>
              )}
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-zinc-400">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-medium text-white transition-colors hover:text-indigo-400 hover:underline"
                >
                  {isLogin ? "Create account" : "Log in"}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <p className="mt-8 text-center text-xs text-zinc-500">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
