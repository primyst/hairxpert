"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Scissors,
  Calendar,
  Clock,
  Users,
  TrendingUp,
  LogOut,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Bell,
  Star,
  ArrowLeft,
  Loader2,
  Filter,
  RefreshCw,
  DollarSign,
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

type EaseCubicBezier = [number, number, number, number];
const EASE_OUT: EaseCubicBezier = [0.16, 1, 0.3, 1];

type BookingStatus = "confirmed" | "cancelled" | "completed";

interface Booking {
  id: string;
  user_name: string;
  user_email: string;
  service: string;
  price: string;
  duration: string;
  stylist: string;
  slot: string;
  status: BookingStatus;
  created_at: string;
  updated_at?: string;
}

const STATUS_CONFIG: Record<BookingStatus, {
  label: string;
  color: string;
  bg: string;
  icon: typeof CheckCircle2;
}> = {
  confirmed: {
    label: "Confirmed",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/25",
    icon: CheckCircle2,
  },
  completed: {
    label: "Completed",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/25",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-zinc-500",
    bg: "bg-zinc-800/80 border-zinc-700",
    icon: XCircle,
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: EASE_OUT },
  }),
};

// ─── Helpers ──────────────────────────────────────────────────

function parsePriceValue(price: string): number {
  return Number(price.replace(/[₦,]/g, "")) || 0;
}

function formatRevenue(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Stat card ────────────────────────────────────────────────

function StatCard({
  label, value, sub, icon: Icon, color, index,
}: {
  label: string; value: string; sub: string;
  icon: typeof Calendar; color: string; index: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-2xl font-black text-white font-serif leading-none mb-1">{value}</div>
      <div className="text-zinc-500 text-xs font-medium tracking-wide mb-1">{label}</div>
      <div className="text-zinc-600 text-xs">{sub}</div>
    </motion.div>
  );
}

// ─── Booking card ─────────────────────────────────────────────

function BookingCard({
  booking,
  onStatusChange,
  updating,
}: {
  booking: Booking;
  onStatusChange: (id: string, status: BookingStatus) => void;
  updating: string | null;
}) {
  const status = STATUS_CONFIG[booking.status];
  const StatusIcon = status.icon;
  const isUpdating = updating === booking.id;

  const nextActions: { label: string; status: BookingStatus; icon: typeof CheckCircle2 }[] = [];
  if (booking.status === "confirmed") {
    nextActions.push({ label: "Complete", status: "completed", icon: CheckCircle2 });
    nextActions.push({ label: "Cancel", status: "cancelled", icon: XCircle });
  }
  if (booking.status === "cancelled") {
    nextActions.push({ label: "Restore", status: "confirmed", icon: RotateCcw });
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: EASE_OUT }}
      className={`p-5 rounded-2xl border bg-zinc-900 transition-all ${
        booking.status === "cancelled"
          ? "border-zinc-800 opacity-60"
          : "border-zinc-800 hover:border-zinc-700"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Service icon */}
        <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
          <Scissors className="w-5 h-5 text-amber-400" />
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-white font-bold text-sm">{booking.service}</h3>
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${status.bg} ${status.color}`}>
              <StatusIcon className="w-2.5 h-2.5" />
              {status.label}
            </div>
          </div>

          <p className="text-zinc-500 text-xs mb-2">with {booking.stylist}</p>

          <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-zinc-600" />
              {booking.slot}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-zinc-600" />
              {booking.duration}
            </span>
          </div>

          {/* Client info */}
          <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between flex-wrap gap-2">
            <div>
              <div className="text-zinc-300 text-xs font-medium">{booking.user_name}</div>
              <div className="text-zinc-600 text-[11px]">{booking.user_email}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-black text-sm font-serif">{booking.price}</span>
              <span className="text-zinc-700 text-[10px]">{timeAgo(booking.created_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      {nextActions.length > 0 && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-zinc-800">
          {nextActions.map(({ label, status: nextStatus, icon: ActionIcon }) => (
            <button
              key={label}
              onClick={() => onStatusChange(booking.id, nextStatus)}
              disabled={isUpdating}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-semibold transition-all disabled:opacity-50 ${
                nextStatus === "cancelled"
                  ? "border-zinc-700 text-zinc-500 hover:border-red-500/40 hover:text-red-400 hover:bg-red-500/5"
                  : nextStatus === "completed"
                  ? "border-zinc-700 text-zinc-400 hover:border-emerald-500/40 hover:text-emerald-400 hover:bg-emerald-500/5"
                  : "border-zinc-700 text-zinc-400 hover:border-amber-500/40 hover:text-amber-400 hover:bg-amber-500/5"
              }`}
            >
              {isUpdating ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <ActionIcon className="w-3 h-3" />
              )}
              {label}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Main admin page ──────────────────────────────────────────

function AdminInner() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | BookingStatus>("all");
  const [newCount, setNewCount] = useState(0);
  const [lastChecked, setLastChecked] = useState(Date.now());

  // Load user + verify admin access
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth"); return; }

      // Client-side admin check via API
      const res = await fetch("/api/admin/verify");
      if (!res.ok) { setAccessDenied(true); setLoading(false); return; }

      setUser(user);
      await loadBookings();
    };

    init();
  }, []);

  const loadBookings = useCallback(async () => {
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    setBookings(data || []);
    setLoading(false);
    setLastChecked(Date.now());
  }, []);

  // Supabase Realtime — live booking updates
  useEffect(() => {
    const channel = supabase
      .channel("admin-bookings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newBooking = payload.new as Booking;
            setBookings((prev) => [newBooking, ...prev]);
            setNewCount((n) => n + 1);
            // Browser notification if permitted
            if (Notification.permission === "granted") {
              new Notification("🗓 New Hairxpert Booking!", {
                body: `${newBooking.service} — ${newBooking.slot}`,
                icon: "/favicon.ico",
              });
            }
          }
          if (payload.eventType === "UPDATE") {
            const updated = payload.new as Booking;
            setBookings((prev) =>
              prev.map((b) => (b.id === updated.id ? updated : b))
            );
          }
        }
      )
      .subscribe();

    // Request browser notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleStatusChange = useCallback(async (id: string, status: BookingStatus) => {
    setUpdating(id);
    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Failed");
      // Realtime will update the UI automatically
    } catch (e) {
      alert("Failed to update booking. Try again.");
    } finally {
      setUpdating(null);
    }
  }, []);

  // ─── Stats ──────────────────────────────────────────────────

  const today = new Date().toDateString();
  const todayBookings = bookings.filter((b) =>
    new Date(b.created_at).toDateString() === today
  );
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const totalRevenue = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + parsePriceValue(b.price), 0);
  const topService = (() => {
    const counts: Record<string, number> = {};
    bookings.forEach((b) => { counts[b.service] = (counts[b.service] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
  })();

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  // ─── Access denied ───────────────────────────────────────────

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-black text-white font-serif mb-2">Access Denied</h1>
          <p className="text-zinc-500 text-sm mb-6">
            Your account doesn't have admin privileges. Contact the site owner.
          </p>
          <a href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-700 text-zinc-400 text-sm hover:border-amber-500/40 hover:text-amber-400 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_30%_at_50%_0%,rgba(245,158,11,0.05),transparent)] pointer-events-none" />

      {/* Header */}
      <header className="relative border-b border-zinc-800/60 bg-zinc-950/90 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center">
                <Scissors className="w-4 h-4 text-zinc-950" />
              </div>
              <span className="text-base font-black text-white font-serif">
                Hair<span className="text-amber-400">xpert</span>
              </span>
            </a>
            <div className="h-4 w-px bg-zinc-700" />
            <span className="text-zinc-500 text-xs font-semibold tracking-wider uppercase">Admin</span>
          </div>

          <div className="flex items-center gap-3">
            {/* New booking alert badge */}
            {newCount > 0 && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setNewCount(0)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold"
              >
                <Bell className="w-3.5 h-3.5" />
                {newCount} new
              </motion.button>
            )}

            <button
              onClick={loadBookings}
              className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-600 hover:text-amber-400 hover:border-amber-500/40 transition-all"
              title="Refresh"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={async () => { await supabase.auth.signOut(); router.push("/"); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-700 text-zinc-500 hover:text-amber-400 hover:border-amber-500/40 text-xs font-medium transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:block">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-6 py-10">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-amber-400 text-[11px] font-bold tracking-[0.25em] uppercase mb-1">
            Admin Dashboard
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-white font-serif">
            Booking Overview
          </h1>
          <p className="text-zinc-600 text-sm mt-1">
            Live updates · Last refreshed {timeAgo(new Date(lastChecked).toISOString())}
          </p>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
        >
          <StatCard
            label="Today's Bookings"
            value={String(todayBookings.length)}
            sub={`${todayBookings.filter(b => b.status === "confirmed").length} confirmed`}
            icon={Calendar}
            color="bg-amber-500/15 border border-amber-500/20 text-amber-400"
            index={0}
          />
          <StatCard
            label="Upcoming"
            value={String(confirmedBookings.length)}
            sub="awaiting service"
            icon={Clock}
            color="bg-blue-500/10 border border-blue-500/20 text-blue-400"
            index={1}
          />
          <StatCard
            label="Total Revenue"
            value={formatRevenue(totalRevenue)}
            sub="all time (non-cancelled)"
            icon={DollarSign}
            color="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
            index={2}
          />
          <StatCard
            label="Top Service"
            value={topService.split(" ").slice(0, 2).join(" ")}
            sub="most booked"
            icon={TrendingUp}
            color="bg-violet-500/10 border border-violet-500/20 text-violet-400"
            index={3}
          />
        </motion.div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <Filter className="w-4 h-4 text-zinc-600" />
          {(["all", "confirmed", "completed", "cancelled"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all capitalize ${
                filter === f
                  ? "bg-amber-500 text-zinc-950"
                  : "border border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
              }`}
            >
              {f === "all" ? `All (${bookings.length})` : `${f} (${bookings.filter(b => b.status === f).length})`}
            </button>
          ))}
        </div>

        {/* Bookings list */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 rounded-3xl border border-zinc-800 bg-zinc-900">
            <Calendar className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">No {filter !== "all" ? filter : ""} bookings yet</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onStatusChange={handleStatusChange}
                  updating={updating}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin" />
      </div>
    }>
      <AdminInner />
    </Suspense>
  );
}
