"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Scissors,
  Clock,
  ChevronRight,
  Check,
  Calendar,
  ArrowLeft,
  Loader2,
  User,
  LogOut,
  Star,
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import { SERVICES, STYLISTS, AVAILABLE_SLOTS } from "@/lib/data";
import type { User as SupabaseUser } from "@supabase/supabase-js";

type EaseCubicBezier = [number, number, number, number];
const EASE_OUT: EaseCubicBezier = [0.16, 1, 0.3, 1];

const BOOKING_STEPS = ["Service", "Stylist", "Date & Time", "Confirm"];

const fadeSlide: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.28, ease: EASE_OUT } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

export default function BookPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  // Read initial state from URL params
  const [step, setStep] = useState(() => {
    const s = parseInt(searchParams.get("step") || "0");
    return isNaN(s) ? 0 : Math.min(s, 3);
  });

  const [selections, setSelections] = useState({
    service: searchParams.get("service") || "",
    price: searchParams.get("price") || "",
    duration: searchParams.get("duration") || "",
    stylist: searchParams.get("stylist") || "",
    slot: searchParams.get("slot") || "",
  });

  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoadingUser(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sync selections into URL so state survives refreshes and OAuth redirects
  const updateUrl = useCallback((newSelections: typeof selections, newStep: number) => {
    const params = new URLSearchParams();
    if (newSelections.service) params.set("service", newSelections.service);
    if (newSelections.price) params.set("price", newSelections.price);
    if (newSelections.duration) params.set("duration", newSelections.duration);
    if (newSelections.stylist) params.set("stylist", newSelections.stylist);
    if (newSelections.slot) params.set("slot", newSelections.slot);
    params.set("step", String(newStep));
    router.replace(`/book?${params.toString()}`, { scroll: false });
  }, [router]);

  const pick = useCallback(
    (field: keyof typeof selections, value: string, extras: Partial<typeof selections> = {}) => {
      const nextStep = step + 1;
      const newSelections = { ...selections, [field]: value, ...extras };
      setSelections(newSelections);
      setStep(nextStep);
      updateUrl(newSelections, nextStep);
    },
    [step, selections, updateUrl]
  );

  const goToStep = useCallback((s: number) => {
    setStep(s);
    updateUrl(selections, s);
  }, [selections, updateUrl]);

  // On confirm — if not logged in, redirect to auth with booking state
  const handleConfirm = async () => {
    if (!user) {
      const params = new URLSearchParams({
        service: selections.service,
        price: selections.price,
        duration: selections.duration,
        stylist: selections.stylist,
        slot: selections.slot,
      });
      router.push(`/auth?${params.toString()}`);
      return;
    }

    // Logged in — save booking to Supabase
    setSubmitting(true);
    setSubmitError(null);

    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      user_email: user.email,
      user_name: user.user_metadata?.full_name || user.email,
      service: selections.service,
      price: selections.price,
      duration: selections.duration,
      stylist: selections.stylist,
      slot: selections.slot,
      status: "confirmed",
      created_at: new Date().toISOString(),
    });

    if (error) {
      setSubmitError("Failed to save booking. Please try again.");
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (submitted) {
    return <BookingSuccess user={user} selections={selections} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Ambient bg */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_30%,rgba(245,158,11,0.06),transparent)]" />

      {/* Top bar */}
      <div className="relative border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center">
              <Scissors className="w-4 h-4 text-zinc-950" />
            </div>
            <span className="text-lg font-black text-white font-serif">
              Hair<span className="text-amber-400">xpert</span>
            </span>
          </a>

          {/* User pill */}
          {!loadingUser && (
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700/60">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <span className="text-zinc-300 text-xs font-medium max-w-[120px] truncate">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-600 hover:text-amber-400 hover:border-amber-500/40 transition-all"
                    title="Sign out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <a
                  href={`/auth?service=${encodeURIComponent(selections.service)}&stylist=${encodeURIComponent(selections.stylist)}&slot=${encodeURIComponent(selections.slot)}&step=${step}`}
                  className="text-zinc-500 hover:text-amber-400 text-xs font-medium transition-colors"
                >
                  Sign in
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="relative max-w-2xl mx-auto px-6 py-12">
        {/* Back to home */}
        <a
          href="/"
          className="inline-flex items-center gap-2 text-zinc-600 hover:text-amber-400 text-sm transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </a>

        <div className="mb-10">
          <p className="text-amber-400 text-xs font-bold tracking-[0.25em] uppercase mb-2">
            Book an appointment
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-white font-serif">
            Reserve Your <span className="text-amber-400">Experience</span>
          </h1>
        </div>

        {/* Card */}
        <div className="rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
          {/* Gold top accent */}
          <div className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

          {/* Step progress bar */}
          <div className="flex items-start px-6 pt-6 pb-0 gap-2">
            {BOOKING_STEPS.map((label, i) => (
              <button
                key={label}
                onClick={() => { if (i < step) goToStep(i); }}
                disabled={i >= step}
                className="flex-1 flex flex-col items-center gap-1.5 disabled:cursor-default"
              >
                <div className={`w-full h-1 rounded-full transition-all duration-500 ${
                  i < step ? "bg-amber-500" : i === step ? "bg-amber-400" : "bg-zinc-800"
                }`} />
                <span className={`text-[11px] font-semibold tracking-wide transition-colors hidden sm:block ${
                  i === step ? "text-amber-400" : i < step ? "text-amber-600" : "text-zinc-700"
                }`}>
                  {label}
                </span>
              </button>
            ))}
          </div>

          {/* Step content */}
          <div className="p-8 pt-6 min-h-[380px]">
            <AnimatePresence mode="wait">

              {/* STEP 0 — Select Service */}
              {step === 0 && (
                <motion.div key="s0" variants={fadeSlide} initial="hidden" animate="visible" exit="exit">
                  <h2 className="text-white font-bold text-xl mb-6">Select a Service</h2>
                  <div className="grid gap-3">
                    {SERVICES.map(({ name, price, duration, description, tag, icon: Icon, slug }) => (
                      <motion.button
                        key={slug}
                        whileHover={{ scale: 1.01, borderColor: "rgba(245,158,11,0.4)" }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => pick("service", name, { price, duration })}
                        className={`text-left p-5 rounded-2xl border transition-all duration-200 flex items-start gap-4 ${
                          selections.service === name
                            ? "border-amber-500 bg-amber-500/10"
                            : "border-zinc-700/60 bg-zinc-800/40 hover:border-zinc-600"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          selections.service === name ? "bg-amber-500/20" : "bg-zinc-700"
                        }`}>
                          <Icon className={`w-5 h-5 ${selections.service === name ? "text-amber-400" : "text-zinc-400"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-bold text-sm ${selections.service === name ? "text-amber-300" : "text-white"}`}>
                              {name}
                            </span>
                            {tag && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/14 border border-amber-500/30 text-amber-400 text-[10px] font-bold tracking-wide uppercase">
                                {tag}
                              </span>
                            )}
                          </div>
                          <p className="text-zinc-500 text-xs mt-1 leading-relaxed">{description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-amber-400 font-black text-sm font-serif">{price}</span>
                            <span className="text-zinc-600 text-xs flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {duration}
                            </span>
                          </div>
                        </div>
                        {selections.service === name && (
                          <Check className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 1 — Choose Stylist */}
              {step === 1 && (
                <motion.div key="s1" variants={fadeSlide} initial="hidden" animate="visible" exit="exit">
                  <h2 className="text-white font-bold text-xl mb-6">Choose Your Stylist</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {STYLISTS.map(({ name, specialty, years, initials, accentFrom, accentTo, clients, slug }) => (
                      <motion.button
                        key={slug}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => pick("stylist", name)}
                        className={`text-left p-5 rounded-2xl border transition-all duration-200 ${
                          selections.stylist === name
                            ? "border-amber-500 bg-amber-500/10"
                            : "border-zinc-700/60 bg-zinc-800/40 hover:border-zinc-600"
                        }`}
                      >
                        {/* Avatar */}
                        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${accentFrom} ${accentTo} flex items-center justify-center mb-3 relative`}>
                          <span className="text-xl font-black text-white/20 font-serif absolute">{initials}</span>
                          <div className="w-10 h-10 rounded-full border-2 border-white/20 bg-white/10 flex items-center justify-center">
                            <span className="text-sm font-black text-white font-serif">{initials}</span>
                          </div>
                        </div>
                        <div className={`font-bold text-sm mb-0.5 ${selections.stylist === name ? "text-amber-300" : "text-white"}`}>
                          {name.split(" ")[0]}
                        </div>
                        <div className="text-zinc-500 text-xs">{specialty}</div>
                        <div className="flex items-center gap-1 mt-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <div className="text-zinc-600 text-[11px] mt-1">{years}y · {clients}</div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 2 — Pick Date & Time */}
              {step === 2 && (
                <motion.div key="s2" variants={fadeSlide} initial="hidden" animate="visible" exit="exit">
                  <h2 className="text-white font-bold text-xl mb-6">Pick Date &amp; Time</h2>
                  <div className="grid gap-2.5">
                    {AVAILABLE_SLOTS.map((slot) => (
                      <motion.button
                        key={slot}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => pick("slot", slot)}
                        className={`flex items-center justify-between px-5 py-4 rounded-xl border text-sm transition-all duration-200 ${
                          selections.slot === slot
                            ? "border-amber-500 bg-amber-500/10 text-amber-300"
                            : "border-zinc-700/60 bg-zinc-800/40 text-zinc-300 hover:border-zinc-600"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Calendar className={`w-4 h-4 ${selections.slot === slot ? "text-amber-400" : "text-zinc-600"}`} />
                          <span className="font-medium">{slot}</span>
                        </div>
                        {selections.slot === slot
                          ? <Check className="w-4 h-4 text-amber-400" />
                          : <ChevronRight className="w-4 h-4 text-zinc-600" />
                        }
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 3 — Confirm */}
              {step === 3 && (
                <motion.div key="s3" variants={fadeSlide} initial="hidden" animate="visible" exit="exit">
                  <h2 className="text-white font-bold text-xl mb-6">Confirm Booking</h2>

                  {/* Summary */}
                  <div className="rounded-2xl border border-zinc-700/60 overflow-hidden mb-5">
                    {[
                      ["Service", `${selections.service}  ·  ${selections.price}`],
                      ["Duration", selections.duration],
                      ["Stylist", selections.stylist],
                      ["Date & Time", selections.slot],
                    ].map(([label, val], i, arr) => (
                      <div key={label} className={`flex justify-between items-center px-5 py-3.5 text-sm ${
                        i < arr.length - 1 ? "border-b border-zinc-800" : ""
                      }`}>
                        <span className="text-zinc-500">{label}</span>
                        <span className="text-zinc-200 font-medium text-right max-w-[55%]">{val || "—"}</span>
                      </div>
                    ))}
                  </div>

                  {/* Auth state */}
                  {loadingUser ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                    </div>
                  ) : user ? (
                    /* Logged in — show user + confirm */
                    <div>
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-zinc-800 border border-zinc-700/60 mb-5">
                        <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/25 flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-amber-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm font-semibold truncate">
                            {user.user_metadata?.full_name || "Guest"}
                          </div>
                          <div className="text-zinc-500 text-xs truncate">{user.email}</div>
                        </div>
                        <button
                          onClick={handleSignOut}
                          className="text-zinc-600 hover:text-amber-400 transition-colors"
                          title="Sign out"
                        >
                          <LogOut className="w-4 h-4" />
                        </button>
                      </div>

                      {submitError && (
                        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                          {submitError}
                        </div>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.03, boxShadow: "0 0 35px rgba(245,158,11,0.3)" }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleConfirm}
                        disabled={submitting}
                        className="w-full py-4 rounded-2xl bg-amber-500 text-zinc-950 font-black text-sm tracking-wide flex items-center justify-center gap-2.5 shadow-lg shadow-amber-500/20 disabled:opacity-70"
                      >
                        {submitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        {submitting ? "Confirming..." : "Confirm Appointment"}
                      </motion.button>
                    </div>
                  ) : (
                    /* Not logged in — sign in prompt */
                    <div>
                      <div className="p-4 rounded-xl bg-amber-500/7 border border-amber-500/20 text-amber-300/80 text-xs text-center mb-5 leading-relaxed">
                        Almost done! Sign in with Google to confirm your booking.
                        <br />
                        <span className="text-zinc-600">Your selections are saved — we'll bring you right back.</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(245,158,11,0.25)" }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleConfirm}
                        className="w-full py-4 rounded-2xl bg-amber-500 text-zinc-950 font-black text-sm tracking-wide flex items-center justify-center gap-2.5 shadow-lg shadow-amber-500/20"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Sign in with Google to Confirm
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Booking success screen ──────────────────────────────────
function BookingSuccess({
  user,
  selections,
}: {
  user: SupabaseUser | null;
  selections: { service: string; stylist: string; slot: string; price: string };
}) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-amber-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/30"
        >
          <Check className="w-10 h-10 text-zinc-950" strokeWidth={3} />
        </motion.div>

        <h1 className="text-3xl font-black text-white font-serif mb-2">
          You're all set!
        </h1>
        <p className="text-zinc-400 mb-8">
          Your appointment is confirmed,{" "}
          <span className="text-white font-medium">
            {user?.user_metadata?.full_name?.split(" ")[0] || "friend"}
          </span>
          .
        </p>

        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 mb-8 text-left space-y-3">
          {[
            ["Service", selections.service],
            ["Stylist", selections.stylist],
            ["When", selections.slot],
            ["Price", selections.price],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-zinc-500">{label}</span>
              <span className="text-zinc-200 font-medium">{val || "—"}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <a
            href="/dashboard"
            className="w-full py-4 rounded-2xl bg-amber-500 text-zinc-950 font-black text-sm flex items-center justify-center gap-2"
          >
            View My Bookings
          </a>
          <a
            href="/"
            className="w-full py-3.5 rounded-2xl border border-zinc-700 text-zinc-400 text-sm font-semibold hover:border-amber-500/40 hover:text-amber-400 transition-all"
          >
            Back to Home
          </a>
        </div>
      </motion.div>
    </div>
  );
}
