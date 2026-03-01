// app/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Scissors,
  Calendar,
  Clock,
  User,
  LogOut,
  Plus,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

type EaseCubicBezier = [number, number, number, number];
const EASE_OUT: EaseCubicBezier = [0.16, 1, 0.3, 1];

interface Booking {
  id: string;
  service: string;
  price: string;
  duration: string;
  stylist: string;
  slot: string;
  status: "confirmed" | "cancelled" | "completed";
  created_at: string;
}

const STATUS_CONFIG = {
  confirmed: { icon: CheckCircle2, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", label: "Confirmed" },
  completed: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", label: "Completed" },
  cancelled: { icon: XCircle, color: "text-zinc-500", bg: "bg-zinc-800 border-zinc-700", label: "Cancelled" },
};

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth");
        return;
      }

      setUser(user);

      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setBookings(data || []);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(245,158,11,0.05),transparent)] pointer-events-none" />

      {/* Header */}
      <header className="relative border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center">
              <Scissors className="w-4 h-4 text-zinc-950" />
            </div>
            <span className="text-lg font-black text-white font-serif">
              Hair<span className="text-amber-400">xpert</span>
            </span>
          </a>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-zinc-300 text-xs font-medium">
                {user?.user_metadata?.full_name || user?.email}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-700 text-zinc-500 hover:text-amber-400 hover:border-amber-500/40 text-xs font-medium transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:block">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative max-w-4xl mx-auto px-6 py-12">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className="mb-10 flex items-start justify-between gap-4 flex-wrap"
        >
          <div>
            <p className="text-amber-400 text-xs font-bold tracking-[0.25em] uppercase mb-1">
              My Account
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-white font-serif">
              Welcome back,{" "}
              <span className="text-amber-400">
                {user?.user_metadata?.full_name?.split(" ")[0] || "there"}
              </span>
            </h1>
            <p className="text-zinc-500 mt-1 text-sm">
              {bookings.length} booking{bookings.length !== 1 ? "s" : ""} in total
            </p>
          </div>

          <motion.a
            href="/book"
            whileHover={{ scale: 1.04, boxShadow: "0 0 25px rgba(245,158,11,0.3)" }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-amber-500 text-zinc-950 font-bold text-sm shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            New Booking
          </motion.a>
        </motion.div>

        {/* Bookings */}
        {bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-24 rounded-3xl border border-zinc-800 bg-zinc-900"
          >
            <AlertCircle className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-zinc-400 font-bold text-lg mb-2">No bookings yet</h3>
            <p className="text-zinc-600 text-sm mb-6">
              Ready for your next look? Book your first appointment.
            </p>
            <a
              href="/book"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 text-zinc-950 font-bold text-sm"
            >
              <Calendar className="w-4 h-4" />
              Book an Appointment
            </a>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, i) => {
              const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.confirmed;
              const StatusIcon = status.icon;
              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, ease: EASE_OUT }}
                  className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900 hover:border-zinc-700 transition-all"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                        <Scissors className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-base">{booking.service}</h3>
                        <p className="text-zinc-500 text-sm mt-0.5">with {booking.stylist}</p>
                        <div className="flex items-center gap-4 mt-2 flex-wrap">
                          <span className="text-zinc-400 text-xs flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                            {booking.slot}
                          </span>
                          <span className="text-zinc-400 text-xs flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-zinc-600" />
                            {booking.duration}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className="text-amber-400 font-black text-lg font-serif">{booking.price}</span>
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${status.bg} ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
