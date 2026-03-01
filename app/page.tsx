"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useInView,
  type Variants,
} from "framer-motion";

type EaseCubicBezier = [number, number, number, number];
import {
  Scissors,
  Sparkles,
  Palette,
  Wind,
  Dumbbell,
  Star,
  ChevronRight,
  ChevronLeft,
  Play,
  MapPin,
  Clock,
  Instagram,
  Twitter,
  Facebook,
  Phone,
  Calendar,
  Check,
  ArrowRight,
  Menu,
  X,
  User,
  Gem,
  Quote,
  ChevronDown,
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

// ─────────────────────────────────────────────────────────────
// DATA LAYER
// ─────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Stylists", href: "#stylists" },
  { label: "Gallery", href: "#gallery" },
];

const SERVICE_ICONS = [
  { icon: Scissors, label: "Precision Cuts" },
  { icon: Wind, label: "Beard Grooming" },
  { icon: Palette, label: "Hair Coloring" },
  { icon: Sparkles, label: "Luxury Treatments" },
  { icon: Dumbbell, label: "Body Massage" },
  { icon: Gem, label: "VIP Package" },
];

const FEATURED_SERVICES = [
  {
    name: "Signature Haircut",
    price: "₦15,000",
    duration: "45 mins",
    icon: Scissors,
    description: "Precision tailored to your face structure and personal style vision.",
    tag: "Most Popular",
  },
  {
    name: "Beard Sculpt & Shave",
    price: "₦8,000",
    duration: "30 mins",
    icon: Wind,
    description: "Expert shaping, hot-towel shave and beard conditioning ritual.",
    tag: null,
  },
  {
    name: "Luxury Hair Color",
    price: "₦25,000",
    duration: "90 mins",
    icon: Palette,
    description: "From bold statements to natural balayage — your canvas awaits.",
    tag: "Premium",
  },
  {
    name: "Royal Treatment",
    price: "₦35,000",
    duration: "120 mins",
    icon: Gem,
    description: "The full Hairxpert experience: cut, color, treatment and massage.",
    tag: "Exclusive",
  },
];

const STYLISTS = [
  {
    name: "Adewale Obi",
    specialty: "Master Barber",
    years: 12,
    initials: "AO",
    accentFrom: "from-amber-700",
    accentTo: "to-stone-900",
    clients: "1.2k+",
  },
  {
    name: "Chioma Eze",
    specialty: "Color Specialist",
    years: 8,
    initials: "CE",
    accentFrom: "from-rose-900",
    accentTo: "to-zinc-900",
    clients: "900+",
  },
  {
    name: "Tunde Bello",
    specialty: "Luxury Treatments",
    years: 10,
    initials: "TB",
    accentFrom: "from-teal-900",
    accentTo: "to-zinc-950",
    clients: "1.0k+",
  },
  {
    name: "Ngozi Amara",
    specialty: "Precision Cuts",
    years: 6,
    initials: "NA",
    accentFrom: "from-violet-900",
    accentTo: "to-zinc-900",
    clients: "800+",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Hairxpert delivers the most professional grooming experience in Lagos. Every visit feels like a luxury ritual I genuinely look forward to.",
    author: "Emeka Chukwu",
    role: "CEO, Primus Capital",
    initials: "EC",
  },
  {
    quote:
      "The precision and atmosphere at Hairxpert is unmatched anywhere in Nigeria. My go-to studio for three consecutive years.",
    author: "Funmi Adeyemi",
    role: "Creative Director, LVMH Lagos",
    initials: "FA",
  },
  {
    quote:
      "I've never walked out feeling less than extraordinary. These stylists understand their craft at a level that's genuinely rare.",
    author: "Rotimi Olatunji",
    role: "Entrepreneur & Investor",
    initials: "RO",
  },
];

const BOOKING_STEPS = ["Service", "Stylist", "Date & Time", "Confirm"];

const AVAILABLE_SLOTS = [
  "Monday, Mar 3 · 10:00 AM",
  "Monday, Mar 3 · 2:00 PM",
  "Tuesday, Mar 4 · 11:00 AM",
  "Tuesday, Mar 4 · 3:30 PM",
  "Wednesday, Mar 5 · 9:00 AM",
  "Wednesday, Mar 5 · 4:00 PM",
];

// ─────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────

const EASE_OUT: EaseCubicBezier = [0.16, 1, 0.3, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: i * 0.1, ease: EASE_OUT },
  }),
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, delay: i * 0.08 },
  }),
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

// ─────────────────────────────────────────────────────────────
// SHARED PRIMITIVES
// ─────────────────────────────────────────────────────────────

function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px 0px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <motion.p
      variants={fadeUp}
      className="flex items-center justify-center gap-3 text-amber-400 text-xs font-bold tracking-[0.25em] uppercase mb-3"
    >
      <span className="w-8 h-px bg-amber-400/50" />
      {children}
      <span className="w-8 h-px bg-amber-400/50" />
    </motion.p>
  );
}

function Heading({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.h2
      variants={fadeUp}
      custom={1}
      className={`text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight font-serif ${className}`}
    >
      {children}
    </motion.h2>
  );
}

// ─────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive: true });

    // Check auth state
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener("scroll", fn);
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-zinc-950/92 backdrop-blur-2xl border-b border-white/5 shadow-[0_4px_40px_rgba(0,0,0,0.5)]"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <a href="#" className="flex items-center gap-3" aria-label="Hairxpert">
            <motion.div
              whileHover={{ rotate: 45 }}
              transition={{ duration: 0.3 }}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20"
            >
              <Scissors className="w-4 h-4 text-zinc-950" />
            </motion.div>
            <span className="text-[22px] font-black tracking-tight text-white font-serif">
              Hair<span className="text-amber-400">xpert</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="relative text-zinc-400 hover:text-white text-sm font-medium tracking-wide transition-colors group"
              >
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-400 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
            {user ? (
              <div className="flex items-center gap-3">
                <a href="/dashboard" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700/60 text-zinc-300 hover:border-amber-500/40 hover:text-amber-400 text-sm font-medium transition-all">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span className="max-w-[100px] truncate text-xs">{user.user_metadata?.full_name?.split(" ")[0] || "Account"}</span>
                </a>
                <motion.a
                  href="/book"
                  whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(245,158,11,0.35)" }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 text-zinc-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Book Now
                </motion.a>
              </div>
            ) : (
              <motion.a
                href="/book"
                whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(245,158,11,0.35)" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 text-zinc-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Book Appointment
              </motion.a>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-zinc-700/60 text-zinc-300 hover:text-amber-400 hover:border-amber-500/40 transition-all"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            className="fixed top-[72px] inset-x-0 z-40 bg-zinc-950/98 backdrop-blur-2xl border-b border-white/5 md:hidden"
          >
            <div className="flex flex-col px-6 py-8 gap-1">
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between py-4 text-zinc-300 hover:text-amber-400 text-base font-medium border-b border-zinc-800/60 transition-colors"
                >
                  {label}
                  <ChevronRight className="w-4 h-4 text-zinc-600" />
                </a>
              ))}
              <a
                href="/book"
                onClick={() => setMenuOpen(false)}
                className="mt-5 flex items-center justify-center gap-2 py-4 rounded-full bg-amber-500 text-zinc-950 font-bold text-sm tracking-wide"
              >
                <Calendar className="w-4 h-4" />
                Book Appointment
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────

function Hero() {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 700], [0, 160]);
  const contentY = useTransform(scrollY, [0, 500], [0, 60]);
  const contentOpacity = useTransform(scrollY, [0, 380], [1, 0]);

  return (
    <section className="relative h-screen min-h-[720px] overflow-hidden flex items-center justify-center">
      {/* Parallax background layer */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 scale-[1.15]">
        {/* Hero photo — place /public/hero.jpg (barber at work) */}
        <img
          src="/hero.jpg"
          alt="Barber at work"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Dark base fallback if image hasn't loaded */}
        <div className="absolute inset-0 bg-zinc-950" style={{ zIndex: -1 }} />

        {/* Multi-layer overlay for cinematic readability */}
        {/* Layer 1 — deep dark base: 50% opacity black */}
        <div className="absolute inset-0 bg-black/50" />
        {/* Layer 2 — directional gradient: darker at top + bottom, lighter mid */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/20 to-zinc-950/90" />
        {/* Layer 3 — amber warm tint left-center for luxury feel */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_20%_65%,rgba(217,119,6,0.22),transparent)]" />
        {/* Layer 4 — vignette edges */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_50%,transparent_35%,rgba(0,0,0,0.75)_100%)]" />

        {/* Grain texture on top of image */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Thin gold horizontal line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/15 to-transparent" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-amber-500/22 bg-amber-500/7 text-amber-300 text-xs font-semibold tracking-[0.2em] uppercase mb-8 backdrop-blur-sm"
        >
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          Est. 2012 · Victoria Island, Lagos
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="visible"
          className="text-[clamp(3.2rem,9.5vw,8rem)] font-black text-white leading-[0.92] tracking-tight mb-3 font-serif"
        >
          Hair<span className="text-amber-400">xpert</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="visible"
          className="text-[clamp(1rem,2.8vw,1.8rem)] text-zinc-400 font-light tracking-[0.14em] uppercase mb-8"
        >
          Luxury Salon & Grooming
        </motion.p>

        {/* Divider */}
        <motion.div
          variants={fadeIn}
          custom={3}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-center gap-4 mb-8"
        >
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-500/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-500/60" />
        </motion.div>

        <motion.p
          variants={fadeUp}
          custom={4}
          initial="hidden"
          animate="visible"
          className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Precision Hair Styling.{" "}
          <span className="text-zinc-200 font-medium">Effortless Online Booking.</span>
          <br className="hidden md:block" />
          Where mastery meets the artistry of modern grooming.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          custom={5}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.a
            href="/book"
            whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(245,158,11,0.45)" }}
            whileTap={{ scale: 0.96 }}
            className="group flex items-center gap-3 px-8 py-4 rounded-full bg-amber-500 text-zinc-950 font-black text-base tracking-wide shadow-xl shadow-amber-500/25 transition-all duration-200"
          >
            <Calendar className="w-5 h-5" />
            Book Appointment
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          </motion.a>

          <motion.a
            href="/services"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-8 py-4 rounded-full border border-zinc-600/80 text-zinc-300 font-medium text-base tracking-wide hover:border-amber-500/50 hover:text-amber-400 hover:bg-amber-500/5 transition-all duration-200"
          >
            Explore Services
            <ChevronRight className="w-4 h-4" />
          </motion.a>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={fadeUp}
          custom={7}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-center gap-8 md:gap-14 mt-16 pt-10 border-t border-white/7"
        >
          {[
            { value: "3,500+", label: "Clients Served" },
            { value: "12+", label: "Years of Mastery" },
            { value: "4", label: "Expert Stylists" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl md:text-3xl font-black text-amber-400 leading-none font-serif">
                {value}
              </div>
              <div className="text-zinc-500 text-xs tracking-widest uppercase mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-zinc-600 text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        >
          <ChevronDown className="w-5 h-5 text-amber-500/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// SERVICE ICONS ROW
// ─────────────────────────────────────────────────────────────

function ServiceIconsRow() {
  return (
    <Section
      id="services"
      className="relative bg-zinc-950 py-20 px-6 border-y border-white/5 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(245,158,11,0.04),transparent)]" />
      <div className="relative max-w-5xl mx-auto">
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 lg:gap-14">
          {SERVICE_ICONS.map(({ icon: Icon, label }, i) => (
            <motion.div
              key={label}
              variants={fadeUp}
              custom={i}
              whileHover={{ scale: 1.1, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="group flex flex-col items-center gap-3 cursor-pointer"
            >
              <div className="relative w-20 h-20 rounded-full border border-zinc-700/60 bg-zinc-900 flex items-center justify-center transition-all duration-300 group-hover:border-amber-500/50 group-hover:bg-zinc-800 group-hover:shadow-[0_0_25px_rgba(245,158,11,0.12)]">
                <Icon className="w-8 h-8 text-zinc-500 group-hover:text-amber-400 transition-colors duration-300" />
                <div className="absolute inset-0 rounded-full border border-amber-400/0 group-hover:border-amber-400/20 scale-110 transition-all duration-300" />
              </div>
              <span className="text-zinc-500 group-hover:text-amber-400 text-[11px] font-semibold tracking-[0.15em] uppercase transition-colors duration-300 text-center max-w-[80px] leading-tight">
                {label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────
// ABOUT / BRAND STORY
// ─────────────────────────────────────────────────────────────

function About() {
  const [videoHover, setVideoHover] = useState(false);

  return (
    <Section
      id="gallery"
      className="relative bg-zinc-950 py-28 px-6 overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1/2 h-full bg-[radial-gradient(ellipse_80%_60%_at_0%_50%,rgba(245,158,11,0.05),transparent)]" />
      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Image collage */}
        <motion.div variants={fadeUp} className="relative h-[480px] md:h-[560px]">
          {/* Panel 1 — large, top-left: gallery1.jpg */}
          <div className="absolute left-0 top-0 w-[58%] h-[70%] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
            <img
              src="/gallery1.jpg"
              alt="Salon atmosphere"
              className="absolute inset-0 w-full h-full object-cover object-center"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
            {/* Dark overlay so icon stays visible */}
            <div className="absolute inset-0 bg-zinc-950/55" />
            {/* Icon on top */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Scissors className="w-24 h-24 text-amber-400/30 rotate-45 drop-shadow-lg" strokeWidth={0.8} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent" />
          </div>

          {/* Panel 2 — top-right: gallery2.jpg */}
          <div className="absolute right-0 top-0 w-[38%] h-[46%] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
            <img
              src="/gallery2.jpg"
              alt="Hair coloring"
              className="absolute inset-0 w-full h-full object-cover object-center"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
            <div className="absolute inset-0 bg-zinc-950/55" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-14 h-14 text-amber-400/30 drop-shadow-lg" />
            </div>
          </div>

          {/* Panel 3 — bottom-right: gallery3.jpg */}
          <div className="absolute right-0 bottom-0 w-[38%] h-[46%] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
            <img
              src="/gallery3.jpg"
              alt="Precision styling"
              className="absolute inset-0 w-full h-full object-cover object-center"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
            <div className="absolute inset-0 bg-zinc-950/55" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Palette className="w-14 h-14 text-amber-400/30 drop-shadow-lg" />
            </div>
          </div>

          {/* Panel 4 — bottom-left accent: gallery4.jpg */}
          <div className="absolute left-0 bottom-0 w-[38%] h-[26%] rounded-2xl overflow-hidden border border-amber-500/25 bg-zinc-900">
            <img
              src="/gallery4.jpg"
              alt="VIP treatment"
              className="absolute inset-0 w-full h-full object-cover object-center"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
            <div className="absolute inset-0 bg-zinc-950/60" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Gem className="w-10 h-10 text-amber-400/35 drop-shadow-lg" />
            </div>
          </div>

          {/* Play button */}
          <motion.button
            onHoverStart={() => setVideoHover(true)}
            onHoverEnd={() => setVideoHover(false)}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
            className="absolute top-[35%] left-[28%] -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center shadow-2xl shadow-amber-500/40"
          >
            <AnimatePresence>
              {videoHover && (
                <motion.div
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 rounded-full bg-amber-500"
                />
              )}
            </AnimatePresence>
            <Play className="w-6 h-6 text-zinc-950 fill-zinc-950 ml-1 relative z-10" />
          </motion.button>

          {/* Floating badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-4 -right-4 md:right-0 bg-amber-500 rounded-2xl px-6 py-4 shadow-2xl shadow-amber-500/30 z-10"
          >
            <div className="text-4xl font-black text-zinc-950 leading-none font-serif">12+</div>
            <div className="text-xs font-bold text-zinc-950/60 tracking-[0.15em] uppercase mt-1">
              Years of Mastery
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="absolute -top-4 -left-4 md:left-0 bg-zinc-900 border border-amber-500/30 rounded-xl px-4 py-3 shadow-xl z-10"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {STYLISTS.slice(0, 3).map(({ initials, accentFrom, accentTo }, i) => (
                  <div
                    key={i}
                    className={`w-7 h-7 rounded-full bg-gradient-to-br ${accentFrom} ${accentTo} border-2 border-zinc-900 flex items-center justify-center text-[9px] font-bold text-white`}
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="text-zinc-500 text-[10px] mt-0.5">Top Rated Studio</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Text content */}
        <div>
          <Label>Hairxpert by the best</Label>
          <Heading>
            You'll always leave{" "}
            <span className="text-amber-400">looking extraordinary.</span>
          </Heading>

          <motion.p variants={fadeUp} custom={2} className="text-zinc-400 text-lg leading-relaxed mt-6">
            At Hairxpert, we've cultivated a sanctuary for those who demand excellence. Every cut,
            color, and treatment is a carefully considered act of craftsmanship — tailored
            specifically to you.
          </motion.p>

          <motion.p variants={fadeUp} custom={3} className="text-zinc-500 leading-relaxed mt-4">
            Our master stylists bring decades of combined expertise to every appointment. We don't
            just cut hair — we architect confidence, one session at a time.
          </motion.p>

          {/* Feature list */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-3 pt-6"
          >
            {["Premium Products", "Hygiene Certified", "Private Suites", "Online Booking", "Loyalty Rewards", "Expert Stylists"].map(
              (feat, i) => (
                <motion.div key={feat} variants={fadeIn} custom={i} className="flex items-center gap-2.5 text-zinc-400 text-sm">
                  <div className="w-5 h-5 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-amber-400" />
                  </div>
                  {feat}
                </motion.div>
              )
            )}
          </motion.div>

          <motion.a
            variants={fadeUp}
            custom={6}
            href="/about"
            whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(245,158,11,0.18)" }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-zinc-700 text-zinc-300 font-semibold text-sm hover:border-amber-500/60 hover:text-amber-400 hover:bg-amber-500/5 transition-all duration-200 mt-8"
          >
            Discover Our Full Story <ArrowRight className="w-4 h-4" />
          </motion.a>
        </div>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────
// FEATURED SERVICES GRID
// ─────────────────────────────────────────────────────────────

function FeaturedServices() {
  return (
    <Section className="relative bg-zinc-900/40 py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(245,158,11,0.05),transparent)]" />
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Label>Our Services</Label>
          <Heading>
            Services We <span className="text-amber-400">Provide</span>
          </Heading>
          <motion.p variants={fadeUp} custom={2} className="text-zinc-500 max-w-xl mx-auto mt-4 leading-relaxed">
            Each service is designed as an experience — from the moment you sit down
            to the moment you walk out transformed.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURED_SERVICES.map(({ name, price, duration, icon: Icon, description, tag }, i) => (
            <motion.div
              key={name}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -8, borderColor: "rgba(245,158,11,0.35)" }}
              className="group relative flex flex-col p-7 rounded-2xl border border-zinc-700/40 bg-zinc-900 hover:bg-zinc-800/70 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/7 to-transparent rounded-bl-full group-hover:from-amber-500/14 transition-all duration-400" />

              {tag && (
                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-amber-500/14 border border-amber-500/30 text-amber-400 text-[10px] font-bold tracking-wide uppercase">
                  {tag}
                </div>
              )}

              <div className="w-12 h-12 rounded-xl bg-zinc-800 group-hover:bg-amber-500/15 border border-zinc-700/60 group-hover:border-amber-500/40 flex items-center justify-center mb-6 transition-all duration-300">
                <Icon className="w-5 h-5 text-zinc-500 group-hover:text-amber-400 transition-colors duration-300" />
              </div>

              <h3 className="text-white font-bold text-lg mb-2 group-hover:text-amber-50 transition-colors leading-snug">
                {name}
              </h3>
              <p className="text-zinc-600 text-sm leading-relaxed mb-5 flex-1">{description}</p>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-amber-400 font-black text-xl leading-none font-serif">{price}</div>
                  <div className="flex items-center gap-1.5 text-zinc-600 text-xs mt-1.5">
                    <Clock className="w-3 h-3" />
                    {duration}
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full border border-zinc-700 group-hover:border-amber-500/40 flex items-center justify-center text-zinc-600 group-hover:text-amber-400 transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeUp} custom={5} className="text-center mt-12">
          <motion.a
            href="/services"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-zinc-700/60 text-zinc-400 font-semibold text-sm hover:border-amber-500/50 hover:text-amber-400 transition-all duration-200"
          >
            View All Services <ChevronRight className="w-4 h-4" />
          </motion.a>
        </motion.div>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────
// STYLISTS
// ─────────────────────────────────────────────────────────────

function Stylists() {
  return (
    <Section id="stylists" className="relative bg-zinc-950 py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(245,158,11,0.05),transparent)]" />
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Label>The Team</Label>
          <Heading>
            Meet Our <span className="text-amber-400">Expert Stylists</span>
          </Heading>
          <motion.p variants={fadeUp} custom={2} className="text-zinc-500 max-w-lg mx-auto mt-4 leading-relaxed">
            Masters of their craft. Dedicated to your transformation.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {STYLISTS.map(({ name, specialty, years, initials, accentFrom, accentTo, clients }, i) => (
            <motion.div
              key={name}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -8 }}
              className="group relative rounded-2xl overflow-hidden border border-zinc-800/80 hover:border-amber-500/25 bg-zinc-900 transition-all duration-300 cursor-pointer"
            >
              <div className={`relative h-52 md:h-64 bg-gradient-to-br ${accentFrom} ${accentTo} overflow-hidden`}>
                {/* Decorative pattern behind initials */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(255,255,255,0.04),transparent)]" />
                {/* Large initials as visual identity */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[6rem] md:text-[7rem] font-black text-white/[0.12] select-none font-serif leading-none tracking-tighter">
                    {initials}
                  </span>
                </div>
                {/* Smaller styled initials badge — centered, prominent */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-xl">
                    <span className="text-2xl font-black text-white font-serif tracking-tight">
                      {initials}
                    </span>
                  </div>
                </div>
                {/* Bottom gradient for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent" />
                {/* Hover amber tint */}
                <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/8 transition-all duration-300" />
                {/* Clients badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-amber-400 text-[10px] font-bold tracking-wide">
                  {clients} clients
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-white font-bold text-base leading-snug">{name}</h3>
                <p className="text-amber-400 text-xs font-semibold tracking-wide mt-0.5 mb-3">{specialty}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-zinc-600 text-xs">{years}y exp.</span>
                </div>
                <motion.a
                  href={`/book?stylist=${encodeURIComponent(name)}&step=0`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-4 block text-center w-full py-2.5 rounded-xl border border-zinc-700/60 text-zinc-400 text-xs font-semibold tracking-wide group-hover:border-amber-500/40 group-hover:text-amber-400 transition-all duration-200"
                >
                  Book with {name.split(" ")[0]}
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────
// BOOKING PREVIEW
// ─────────────────────────────────────────────────────────────

function BookingPreview() {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<{ service?: string; stylist?: string; slot?: string }>({});

  const pick = useCallback((key: "service" | "stylist" | "slot", val: string, next: number) => {
    setSelections((p) => ({ ...p, [key]: val }));
    setStep(next);
  }, []);

  return (
    <Section id="booking" className="relative bg-zinc-900/50 py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(245,158,11,0.04),transparent)]" />
      <div className="relative max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <Label>Easy Booking</Label>
          <Heading>
            Reserve in <span className="text-amber-400">4 Simple Steps</span>
          </Heading>
          <motion.p variants={fadeUp} custom={2} className="text-zinc-500 max-w-sm mx-auto mt-4 text-sm leading-relaxed">
            Select your service, pick your stylist, choose a time — done.
          </motion.p>
        </div>

        <motion.div
          variants={fadeUp}
          custom={3}
          className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl"
        >
          <div className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

          {/* Step bar */}
          <div className="flex items-start px-6 pt-5 pb-0 gap-2">
            {BOOKING_STEPS.map((label, i) => (
              <button
                key={label}
                onClick={() => { if (i < step) setStep(i); }}
                disabled={i > step}
                className="flex-1 flex flex-col items-center gap-1.5"
              >
                <div className={`w-full h-1 rounded-full transition-all duration-500 ${i <= step ? "bg-amber-500" : "bg-zinc-800"}`} />
                <span className={`text-[11px] font-semibold tracking-wide transition-colors hidden sm:block ${i === step ? "text-amber-400" : i < step ? "text-amber-700" : "text-zinc-700"}`}>
                  {label}
                </span>
              </button>
            ))}
          </div>

          <div className="p-7 pt-5 min-h-[320px]">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="s0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.28 }}
                >
                  <h3 className="text-white font-bold text-lg mb-5">Select a Service</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {FEATURED_SERVICES.map(({ name, price, duration }) => (
                      <motion.button
                        key={name}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => pick("service", name, 1)}
                        className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                          selections.service === name
                            ? "border-amber-500 bg-amber-500/10 text-amber-300"
                            : "border-zinc-700/60 bg-zinc-800/50 text-zinc-300 hover:border-zinc-600"
                        }`}
                      >
                        <div className="font-semibold text-sm">{name}</div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-amber-400 text-xs font-bold">{price}</span>
                          <span className="text-zinc-600 text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {duration}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="s1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.28 }}
                >
                  <h3 className="text-white font-bold text-lg mb-5">Choose Your Stylist</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {STYLISTS.map(({ name, specialty, initials, accentFrom, accentTo }) => (
                      <motion.button
                        key={name}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => pick("stylist", name, 2)}
                        className={`text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                          selections.stylist === name
                            ? "border-amber-500 bg-amber-500/10"
                            : "border-zinc-700/60 bg-zinc-800/50 hover:border-zinc-600"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${accentFrom} ${accentTo} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                          {initials}
                        </div>
                        <div>
                          <div className={`font-semibold text-sm ${selections.stylist === name ? "text-amber-300" : "text-zinc-200"}`}>
                            {name.split(" ")[0]}
                          </div>
                          <div className="text-zinc-600 text-xs mt-0.5">{specialty}</div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="s2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.28 }}
                >
                  <h3 className="text-white font-bold text-lg mb-5">Pick Date &amp; Time</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {AVAILABLE_SLOTS.map((slot) => (
                      <motion.button
                        key={slot}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => pick("slot", slot, 3)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all duration-200 ${
                          selections.slot === slot
                            ? "border-amber-500 bg-amber-500/10 text-amber-300"
                            : "border-zinc-700/60 bg-zinc-800/50 text-zinc-300 hover:border-zinc-600"
                        }`}
                      >
                        <span className="font-medium">{slot}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="s3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.28 }}
                >
                  <h3 className="text-white font-bold text-lg mb-5">Confirm Booking</h3>
                  <div className="rounded-xl border border-zinc-700/60 overflow-hidden mb-5">
                    {[["Service", selections.service || "—"], ["Stylist", selections.stylist || "—"], ["Date & Time", selections.slot || "—"]].map(
                      ([label, val], i) => (
                        <div key={label} className={`flex justify-between items-center px-5 py-3.5 text-sm ${i < 2 ? "border-b border-zinc-800" : ""}`}>
                          <span className="text-zinc-500">{label}</span>
                          <span className="text-zinc-200 font-medium text-right max-w-[60%]">{val}</span>
                        </div>
                      )
                    )}
                  </div>
                  <div className="p-4 rounded-xl bg-amber-500/7 border border-amber-500/20 text-amber-300/80 text-xs text-center mb-5">
                    You'll be asked to sign in to complete your booking.
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03, boxShadow: "0 0 35px rgba(245,158,11,0.3)" }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-4 rounded-xl bg-amber-500 text-zinc-950 font-black text-sm tracking-wide flex items-center justify-center gap-2.5 shadow-lg shadow-amber-500/20"
                  >
                    <Check className="w-4 h-4" />
                    Confirm &amp; Sign In to Book
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────────

function Testimonials() {
  const [idx, setIdx] = useState(0);
  const prev = useCallback(() => setIdx((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length), []);
  const next = useCallback(() => setIdx((i) => (i + 1) % TESTIMONIALS.length), []);

  return (
    <Section className="relative bg-zinc-950 py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(245,158,11,0.04),transparent)]" />
      <div className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-none select-none">
        <Quote className="w-64 h-64 text-amber-500/4" strokeWidth={0.5} />
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <Label>Client Stories</Label>
          <Heading>
            What They <span className="text-amber-400">Say</span>
          </Heading>
        </div>

        <motion.div variants={fadeUp} custom={2}>
          <div className="relative rounded-3xl border border-zinc-800/80 bg-zinc-900 overflow-hidden p-10 md:p-14">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(245,158,11,0.04),transparent)]" />
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
                className="relative"
              >
                <div className="flex justify-center gap-1 mb-8">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="text-zinc-200 text-xl md:text-2xl lg:text-3xl text-center leading-relaxed font-light italic mb-10 font-serif">
                  "{TESTIMONIALS[idx].quote}"
                </blockquote>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-600 to-stone-900 flex items-center justify-center text-sm font-bold text-white mb-2">
                    {TESTIMONIALS[idx].initials}
                  </div>
                  <div className="text-white font-bold text-sm">{TESTIMONIALS[idx].author}</div>
                  <div className="text-amber-400/70 text-xs tracking-wide">{TESTIMONIALS[idx].role}</div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-5 mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prev}
              className="w-11 h-11 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-500 hover:border-amber-500/60 hover:text-amber-400 transition-all"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <div className="flex items-center gap-2.5">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`rounded-full transition-all duration-300 ${i === idx ? "w-7 h-2.5 bg-amber-400" : "w-2.5 h-2.5 bg-zinc-700 hover:bg-zinc-500"}`}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={next}
              className="w-11 h-11 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-500 hover:border-amber-500/60 hover:text-amber-400 transition-all"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────
// FINAL CTA
// ─────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <Section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-amber-950/20 to-zinc-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,rgba(245,158,11,0.12),transparent)]" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1/4 pointer-events-none opacity-[0.04]">
        <Scissors className="w-[500px] h-[500px] text-amber-300 rotate-[-20deg]" strokeWidth={0.3} />
      </div>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-1/4 pointer-events-none opacity-[0.04]">
        <Scissors className="w-[400px] h-[400px] text-amber-300 rotate-[20deg]" strokeWidth={0.3} />
      </div>

      <div className="relative max-w-3xl mx-auto text-center">
        <Label>The Next Step</Label>
        <motion.h2
          variants={fadeUp}
          custom={1}
          className="text-5xl md:text-7xl font-black text-white leading-[0.95] tracking-tight mb-6 font-serif"
        >
          Ready for your{" "}
          <span className="text-amber-400">next look?</span>
        </motion.h2>
        <motion.p variants={fadeUp} custom={2} className="text-zinc-400 text-xl mb-12 max-w-xl mx-auto leading-relaxed">
          Reserve your Hairxpert appointment today and experience grooming elevated to an art form.
        </motion.p>

        <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.a
            href="/book"
            whileHover={{ scale: 1.06, boxShadow: "0 0 60px rgba(245,158,11,0.5)" }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-amber-500 text-zinc-950 font-black text-lg tracking-wide shadow-2xl shadow-amber-500/30 transition-all duration-200"
          >
            <Calendar className="w-6 h-6" />
            Book Appointment
            <ArrowRight className="w-5 h-5" />
          </motion.a>
          <motion.a
            href="tel:+2348001234567"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center gap-2 px-8 py-5 rounded-full border border-zinc-600/80 text-zinc-400 font-semibold text-base hover:border-amber-500/50 hover:text-amber-400 transition-all duration-200"
          >
            <Phone className="w-5 h-5" />
            Call Us
          </motion.a>
        </motion.div>

        <motion.div variants={fadeUp} custom={4} className="flex flex-wrap justify-center gap-6 mt-14 pt-10 border-t border-white/7">
          {[
            { icon: Check, text: "No cancellation fees" },
            { icon: Star, text: "5-star rated" },
            { icon: Clock, text: "Instant confirmation" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-zinc-500 text-sm">
              <Icon className="w-4 h-4 text-amber-500/70" />
              {text}
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="relative bg-zinc-950 border-t border-white/5">
      <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Scissors className="w-4 h-4 text-zinc-950 rotate-45" />
              </div>
              <span className="text-[22px] font-black tracking-tight text-white font-serif">
                Hair<span className="text-amber-400">xpert</span>
              </span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6 max-w-xs">
              Premium grooming for those who demand excellence. Where precision meets luxury.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Instagram, label: "Instagram" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Facebook, label: "Facebook" },
              ].map(({ Icon, label }) => (
                <motion.a
                  key={label}
                  href="#"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-600 hover:text-amber-400 hover:border-amber-500/40 transition-all duration-200"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-5 tracking-wide uppercase">Visit Us</h4>
            <div className="space-y-4">
              {[
                { icon: MapPin, text: "14 Luxury Lane, Victoria Island\nLagos, Nigeria" },
                { icon: Clock, text: "Mon – Sat: 9:00 AM – 8:00 PM\nSunday: 10:00 AM – 5:00 PM" },
                { icon: Phone, text: "+234 800 123 4567" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <span className="text-zinc-500 text-sm leading-relaxed whitespace-pre-line">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-5 tracking-wide uppercase">Quick Links</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {[
                { label: "Services", href: "/services" },
                { label: "Our Stylists", href: "/stylists" },
                { label: "Book Now", href: "/book" },
                { label: "Gallery", href: "/gallery" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Careers", href: "#" },
                { label: "Gift Cards", href: "#" },
              ].map(({ label, href }) => (
                  <a key={label} href={href}
                    className="text-zinc-600 hover:text-amber-400 text-sm transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <ChevronRight className="w-3 h-3 text-zinc-800 group-hover:text-amber-500/60 transition-colors" />
                    {label}
                  </a>
                )
              )}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-800/60 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-zinc-700 text-xs">© 2026 Hairxpert Luxury Salon. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {[{label:"Privacy Policy",href:"/privacy"},{label:"Terms of Service",href:"/terms"}].map(({label,href}) => (
              <a key={label} href={href} className="text-zinc-700 hover:text-zinc-500 text-xs transition-colors">
                {label}
              </a>
            ))}
          </div>
          <p className="text-zinc-800 text-xs">Crafted with precision.</p>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────
// ROOT PAGE EXPORT
// ─────────────────────────────────────────────────────────────

export default function HairxpertLanding() {
  return (
    <div className="bg-zinc-950 min-h-screen antialiased scroll-smooth">
      <style>{`
        .font-serif { font-family: 'Georgia', 'Times New Roman', serif; }
      `}</style>
      <Navbar />
      <Hero />
      <ServiceIconsRow />
      <About />
      <FeaturedServices />
      <Stylists />
      <BookingPreview />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  );
  }
