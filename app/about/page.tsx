"use client";
import React from "react";
import { motion } from "framer-motion";
import { Scissors, Check, ArrowLeft, Calendar } from "lucide-react";

export default function AboutPage() {
  const values = [
    { title: "Precision", desc: "Every cut, every line — executed with intentional mastery." },
    { title: "Luxury", desc: "Premium products and an atmosphere that sets the standard." },
    { title: "Community", desc: "Built in Lagos, for Lagos. We know our clients by name." },
    { title: "Excellence", desc: "We don't do mediocre. Every visit, every time." },
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_30%_40%,rgba(245,158,11,0.06),transparent)] pointer-events-none" />
      <div className="relative max-w-4xl mx-auto px-6 py-20">
        <a href="/" className="inline-flex items-center gap-2 text-zinc-600 hover:text-amber-400 text-sm transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </a>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-amber-400 text-xs font-bold tracking-[0.25em] uppercase mb-3 flex items-center gap-2">
            <span className="w-8 h-px bg-amber-400/50" /> Our Story <span className="w-8 h-px bg-amber-400/50" />
          </p>
          <h1 className="text-5xl md:text-6xl font-black text-white font-serif mb-6 leading-tight">
            Built on <span className="text-amber-400">Craft.</span><br />Driven by <span className="text-amber-400">Excellence.</span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed mb-6 max-w-2xl">
            Hairxpert was founded in 2012 with a single belief: that grooming is not just maintenance — it's identity. Rooted in Victoria Island, Lagos, we've spent over a decade perfecting our approach to luxury personal care.
          </p>
          <p className="text-zinc-500 leading-relaxed mb-14 max-w-2xl">
            Our stylists are trained to international standards, our products are curated from the world's finest suppliers, and our studio is designed as a sanctuary — a space where you can exhale and trust that you're in expert hands.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-14">
            {values.map(({ title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.3 }}
                className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900"
              >
                <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/25 flex items-center justify-center mb-4">
                  <Check className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="text-white font-bold text-base mb-1">{title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-4 p-6 rounded-2xl bg-amber-500/8 border border-amber-500/20">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shrink-0">
              <Scissors className="w-5 h-5 text-zinc-950" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold">Ready to experience Hairxpert?</h3>
              <p className="text-zinc-500 text-sm">Book your first appointment and see the difference.</p>
            </div>
            <a href="/book" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 text-zinc-950 font-bold text-sm shrink-0">
              <Calendar className="w-4 h-4" /> Book Now
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
