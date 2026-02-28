"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
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
  Gem,
} from "lucide-react";

// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
// DATA
// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

const SERVICES = [
  { icon: Scissors, label: "Haircuts", desc: "Precision cuts tailored to your face shape and style." },
  { icon: Wind, label: "Beard Grooming", desc: "Expert shaping, trimming & sculpting." },
  { icon: Palette, label: "Hair Coloring", desc: "Bold, natural or balayage \u2014 your canvas." },
  { icon: Sparkles, label: "Luxury Treatments", desc: "Deep conditioning & scalp revival rituals." },
  { icon: Dumbbell, label: "Body Massage", desc: "Full-body relaxation and muscle recovery." },
];

const FEATURED_SERVICES = [
  { name: "Signature Haircut", price: "\u20a615,000", duration: "45 mins", icon: Scissors },
  { name: "Beard Sculpt & Shave", price: "\u20a68,000", duration: "30 mins", icon: Wind },
  { name: "Luxury Hair Color", price: "\u20a625,000", duration: "90 mins", icon: Palette },
  { name: "Royal Treatment", price: "\u20a635,000", duration: "120 mins", icon: Gem },
];

const STYLISTS = [
  { name: "Adewale Obi", specialty: "Master Barber", years: 12, initials: "AO", color: "from-amber-600 to-amber-900" },
  { name: "Chioma Eze", specialty: "Color Specialist", years: 8, initials: "CE", color: "from-stone-600 to-stone-900" },
  { name: "Tunde Bello", specialty: "Luxury Treatments", years: 10, initials: "TB", color: "from-zinc-600 to-zinc-900" },
  { name: "Ngozi Amara", specialty: "Precision Cuts", years: 6, initials: "NA", color: "from-amber-700 to-stone-900" },
];

const TESTIMONIALS = [
  {
    quote: "Hairxpert delivers the most professional grooming experience in Lagos. Every visit feels like a luxury ritual.",
    author: "Emeka Chukwu",
    role: "Business Executive",
  },
  {
    quote: "The precision, attention to detail, and atmosphere at Hairxpert is unmatched. My go-to salon for 3 years.",
    author: "Funmi Adeyemi",
    role: "Creative Director",
  },
  {
    quote: "I've never walked out feeling less than extraordinary. The stylists here truly understand their craft.",
    author: "Rotimi Olatunji",
    role: "Entrepreneur",
  },
];

const BOOKING_STEPS = ["Select Service", "Choose Stylist", "Pick Date & Time", "Confirm"];

// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
// ANIMATIONS
// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
// NAVBAR
// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = ["Services", "Stylists", "Gallery", "Book Appointment"];

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800/60 shadow-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center">
              <Scissors className="w-4 h-4 text-zinc-950 rotate-45" />
            </div>
            <span className="text-xl font-black tracking-tight text-white font-serif">
              Hair<span className="text-amber-400">xpert</span>
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) =>
              link === "Book Appointment" ? (
                <motion.a
                  key={link}
                  href="#booking"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-5 py-2.5 rounded-full bg-amber-500 text-zinc-950 font-bold text-sm tracking-wide hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
                >
                  {link}
                </motion.a>
              ) : (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="text-zinc-300 hover:text-amber-400 text-sm font-medium tracking-wide transition-colors relative group"
                >
                  {link}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-amber-400 group-hover:w-full transition-all duration-300" />
                </a>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-zinc-300 hover:text-amber-400 transition-colors"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-0 right-0 z-40 bg-zinc-950/98 backdrop-blur-xl border-b border-zinc-800 md:hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {links.map((link) =>
                link === "Book Appointment" ? (
                  <a
                    key={link}
                    href="#booking"
                    onClick={() => setMenuOpen(false)}
                    className="text-center px-5 py-3 rounded-full bg-amber-500 text-zinc-950 font-bold text-sm tracking-wide"
                  >
                    {link}
                  </a>
                ) : (
                  <a
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    onClick={() => setMenuOpen(false)}
                    className="text-zinc-300 hover:text-amber-400 text-sm font-medium tracking-wide transition-colors py-2 border-b border-zinc-800/50"
                  >
                    {link}
                  </a>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
// HERO
// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 120]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden flex items-center justify-center">
      {/* Parallax bg */}
      <motion.div style={{ y }} className="absolute inset-0 scale-110">
        {/* Gradient mesh background (no external images) */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-stone-900 to-zinc-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(180,130,40,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_70%,rgba(100,80,40,0.1),transparent_50%)]" />
        {/* Decorative scissors watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
          <Scissors className="w-[600px] h-[600px] text-amber-400 rotate-45" />
        </div>
        {/* Grain overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold tracking-widest uppercase mb-6"
        >
          <Star className="w-3 h-3 fill-amber-400" />
          Premium Grooming Experience
          <Star className="w-3 h-3 fill-amber-400" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="visible"
          className="text-6xl md:text-8xl font-black text-white leading-none tracking-tight mb-6 font-serif"
        >
          Hair<span className="text-amber-400">xpert</span>
          <br />
          <span className="text-4xl md:text-5xl font-light text-zinc-300 tracking-wide">
            Luxury Salon
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="visible"
          className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Precision Hair Styling.{" "}
          <span className="text-zinc-200 font-medium">Effortless Online Booking.</span>
          <br />
          Where excellence meets the artistry of grooming.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          custom={3}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.a
            href="#booking"
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(245,158,11,0.4)" }}
            whileTap={{ scale: 0.97 }}
            className="group flex items-center gap-3 px-8 py-4 rounded-full bg-amber-500 text-zinc-950 font-bold text-base tracking-wide shadow-xl shadow-amber-500/25 transition-all"
          >
            <Calendar className="w-5 h-5" />
            Book Appointment
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.a>
          <motion.a
            href="#services"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-8 py-4 rounded-full border border-zinc-600 text-zinc-300 font-medium text-base tracking-wide hover:border-amber-500/50 hover:text-amber-400 transition-all"
          >
            Explore Services
            <ChevronRight className="w-4 h-4" />
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-12 bg-gradient-to-b from-amber-400/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}

// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
// SERVICE ICONS ROW
// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

function ServiceIcons() {
  return (
    <Section id="services" className="bg-zinc-950 py-16 px-6 border-b border-zinc-800/50">
      <div className="max-w-5xl mx-auto">
        <motion.div variants={stagger} className="flex flex-wrap justify-center gap-6 md:gap-10">
          {SERVICES.map(({ icon: Icon, label }, i) => (
            <motion.div
              key={label}
              variants={fadeUp}
              custom={i}
              whileHover={{ scale: 1.08 }}
              className="group flex flex-col items-center gap-3 cursor-pointer"
            >
              <div className="w-20 h-20 rounded-full border border-zinc-700/60 bg-zinc-900 flex items-center justify-center group-hover:border-amber-500/60 group-hover:bg-zinc-800 transition-all duration-300 shadow-lg group-hover:shadow-amber-500/10">
                <Icon className="w-8 h-8 text-zinc-400 group-hover:text-amber-400 transition-colors" />
              </div>
              <span className="text-zinc-400 group-hover:text-amber-400 text-xs font-semibold tracking-widest uppercase transition-colors">
                {label}
              </span>
            </motion.div>
          ))}
        