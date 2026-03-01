"use client";
import React from "react";
import { motion, type Variants } from "framer-motion";
import { Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { SERVICES } from "@/lib/data";

type EaseCubicBezier = [number, number, number, number];
const EASE_OUT: EaseCubicBezier = [0.16, 1, 0.3, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: EASE_OUT },
  }),
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(245,158,11,0.06),transparent)] pointer-events-none" />
      <div className="relative max-w-5xl mx-auto px-6 py-20">
        <a href="/" className="inline-flex items-center gap-2 text-zinc-600 hover:text-amber-400 text-sm transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </a>
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
          <motion.p variants={fadeUp} className="text-amber-400 text-xs font-bold tracking-[0.25em] uppercase mb-3 flex items-center gap-2">
            <span className="w-8 h-px bg-amber-400/50" /> Our Services <span className="w-8 h-px bg-amber-400/50" />
          </motion.p>
          <motion.h1 variants={fadeUp} custom={1} className="text-5xl md:text-6xl font-black text-white font-serif mb-4">
            Services We <span className="text-amber-400">Provide</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-zinc-500 max-w-xl mb-16 leading-relaxed">
            Every service is crafted as an experience — from the moment you arrive to the moment you walk out transformed.
          </motion.p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ name, price, duration, description, tag, icon: Icon, slug }, i) => (
              <motion.div
                key={slug} variants={fadeUp} custom={i + 3}
                whileHover={{ y: -6, borderColor: "rgba(245,158,11,0.35)" }}
                className="group flex flex-col p-7 rounded-2xl border border-zinc-700/40 bg-zinc-900 hover:bg-zinc-800/70 transition-all duration-300 relative overflow-hidden"
              >
                {tag && (
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-amber-500/14 border border-amber-500/30 text-amber-400 text-[10px] font-bold tracking-wide uppercase">
                    {tag}
                  </div>
                )}
                <div className="w-12 h-12 rounded-xl bg-zinc-800 group-hover:bg-amber-500/15 border border-zinc-700/60 group-hover:border-amber-500/40 flex items-center justify-center mb-5 transition-all">
                  <Icon className="w-5 h-5 text-zinc-500 group-hover:text-amber-400 transition-colors" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{name}</h3>
                <p className="text-zinc-600 text-sm leading-relaxed mb-5 flex-1">{description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-amber-400 font-black text-xl font-serif">{price}</div>
                    <div className="flex items-center gap-1.5 text-zinc-600 text-xs mt-1">
                      <Clock className="w-3 h-3" />{duration}
                    </div>
                  </div>
                  <a
                    href={`/book?service=${encodeURIComponent(name)}&price=${encodeURIComponent(price)}&duration=${encodeURIComponent(duration)}&step=1`}
                    className="w-9 h-9 rounded-full border border-zinc-700 group-hover:border-amber-500/40 flex items-center justify-center text-zinc-600 group-hover:text-amber-400 transition-all"
                  >
                    <ArrowRight className="w-4 h-4" />
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
