"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Scissors, Star, Chrome, Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase";

type EaseCubicBezier = [number, number, number, number];
const EASE_OUT: EaseCubicBezier = [0.16, 1, 0.3, 1];

export default function AuthPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Capture booking state from URL to pass through OAuth
  const bookingParams = {
    service: searchParams.get("service") || "",
    stylist: searchParams.get("stylist") || "",
    slot: searchParams.get("slot") || "",
    price: searchParams.get("price") || "",
    duration: searchParams.get("duration") || "",
  };
  const hasBookingState = Boolean(bookingParams.service);

  useEffect(() => {
    // If already logged in, redirect to booking confirmation or dashboard
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        if (hasBookingState) {
          const params = new URLSearchParams(bookingParams as Record<string, string>);
          router.replace(`/book?${params.toString()}&step=3`);
        } else {
          router.replace("/dashboard");
        }
      } else {
        setCheckingSession(false);
      }
    });
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);

    // Build the callback URL — include booking state so it survives OAuth redirect
    const callbackBase = `${window.location.origin}/auth/callback`;
    const redirectTo = hasBookingState
      ? `${callbackBase}?${new URLSearchParams(bookingParams as Record<string, string>).toString()}`
      : callbackBase;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
    // On success, browser redirects to Google → then to /auth/callback
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(245,158,11,0.08),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_40%,rgba(0,0,0,0.5)_100%)]" />
      <div className="absolute right-10 top-10 opacity-[0.04] pointer-events-none">
        <Scissors className="w-96 h-96 text-amber-400 rotate-[-15deg]" strokeWidth={0.4} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <a href="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Scissors className="w-5 h-5 text-zinc-950" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white font-serif">
              Hair<span className="text-amber-400">xpert</span>
            </span>
          </a>

          {/* Booking context — show what they're about to confirm */}
          {hasBookingState ? (
            <div>
              <p className="text-zinc-400 text-sm mb-2">Sign in to confirm your booking</p>
              <div className="inline-flex flex-col items-center gap-1 px-5 py-3 rounded-2xl bg-amber-500/8 border border-amber-500/20 mt-2">
                <span className="text-amber-300 text-sm font-semibold">{bookingParams.service}</span>
                {bookingParams.stylist && (
                  <span className="text-zinc-500 text-xs">with {bookingParams.stylist}</span>
                )}
                {bookingParams.slot && (
                  <span className="text-zinc-500 text-xs">{bookingParams.slot}</span>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-black text-white font-serif mb-2">Welcome back</h1>
              <p className="text-zinc-500 text-sm">Sign in to manage your bookings</p>
            </div>
          )}
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
          {/* Google OAuth button */}
          <motion.button
            onClick={signInWithGoogle}
            disabled={loading}
            whileHover={!loading ? { scale: 1.02, boxShadow: "0 0 30px rgba(245,158,11,0.2)" } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border border-zinc-700 bg-zinc-800 hover:border-zinc-600 hover:bg-zinc-700/80 text-white font-semibold text-base transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {loading ? "Redirecting to Google..." : "Continue with Google"}
          </motion.button>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-zinc-600 text-xs">secure sign in</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-6">
            {[
              { icon: Star, text: "5-star rated" },
              { icon: Chrome, text: "Google secured" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-zinc-600 text-xs">
                <Icon className="w-3.5 h-3.5 text-amber-500/60" />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Back link */}
        <p className="text-center mt-6 text-zinc-600 text-sm">
          <a href="/" className="hover:text-amber-400 transition-colors">
            ← Back to Hairxpert
          </a>
        </p>
      </motion.div>
    </div>
  );
}
