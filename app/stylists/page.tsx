"use client";
import React from "react";
import { motion, type Variants } from "framer-motion";
import { Star, ArrowLeft } from "lucide-react";
import { STYLISTS } from "@/lib/data";

type EaseCubicBezier = [number, number, number, number];
const EASE_OUT: EaseCubicBezier = [0.16, 1, 0.3, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: EASE_OUT },
  }),
};

export default function StylistsPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(245,158,11,0.06),transparent)] pointer-events-none" />
      <div className="relative max-w-5xl mx-auto px-6 py-20">
        <a href="/" className="inline-flex items-center gap-2 text-zinc-600 hover:text-amber-400 text-sm transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </a>
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
          <motion.p variants={fadeUp} className="text-amber-400 text-xs font-bold tracking-[0.25em] uppercase mb-3 flex items-center gap-2">
            <span className="w-8 h-px bg-amber-400/50" /> The Team <span className="w-8 h-px bg-amber-400/50" />
          </motion.p>
          <motion.h1 variants={fadeUp} custom={1} className="text-5xl md:text-6xl font-black text-white font-serif mb-4">
            Meet Our <span className="text-amber-400">Expert Stylists</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-zinc-500 max-w-xl mb-16 leading-relaxed">
            Masters of their craft. Dedicated to your transformation.
          </motion.p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STYLISTS.map(({ name, specialty, years, initials, accentFrom, accentTo, clients, slug }, i) => (
              <motion.div
                key={slug} variants={fadeUp} custom={i + 3}
                whileHover={{ y: -8 }}
                className="group rounded-2xl overflow-hidden border border-zinc-800 hover:border-amber-500/25 bg-zinc-900 transition-all duration-300"
              >
                <div className={`relative h-56 bg-gradient-to-br ${accentFrom} ${accentTo} overflow-hidden`}>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(255,255,255,0.04),transparent)]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[6rem] font-black text-white/[0.08] select-none font-serif leading-none">{initials}</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-2xl font-black text-white font-serif">{initials}</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/7 transition-all" />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-amber-400 text-[10px] font-bold">{clients}</div>
                </div>
                <div className="p-5">
                  <h3 className="text-white font-bold text-base">{name}</h3>
                  <p className="text-amber-400 text-xs font-semibold tracking-wide mt-0.5 mb-3">{specialty}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-zinc-600 text-xs">{years}y exp.</span>
                  </div>
                  <a
                    href={`/book?stylist=${encodeURIComponent(name)}&step=0`}
                    className="block w-full py-2.5 rounded-xl border border-zinc-700/60 text-zinc-400 text-xs font-semibold text-center group-hover:border-amber-500/40 group-hover:text-amber-400 transition-all"
                  >
                    Book with {name.split(" ")[0]}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
