"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { EditorialVerticalDivider } from "@/components/EditorialVerticalDivider";

const ease = [0.22, 1, 0.36, 1] as const;

export function AboutHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.25]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const ghostY = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative z-0 flex min-h-mobile-screen w-full items-center justify-center overflow-visible bg-[#050505] px-6"
    >
      {/* ── BACKGROUND LAYER ─────────────────────────────────── */}
      
      {/* Cinematic Background Image */}
      
      <motion.div 
        className="absolute inset-x-0 bottom-[-24dvh] top-0 z-0"
        style={{ 
          y: imageY, 
          scale: imageScale,
          opacity: 0.65 
        }}
      >
        <Image 
          src="/images/vooglam-eyewear-QSb7IMnUoGo-unsplash.jpg" 
          alt="" 
          fill
          sizes="100vw"
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-transparent to-[#050505]" />
      </motion.div>

      {/* Ambient Base Glow */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(201, 165, 90, 0.15) 0%, transparent 80%)",
        }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Film Grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2] mix-blend-soft-light"
        style={{
          opacity: 0.03,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "150px 150px",
        }}
      />

      {/* ── CONTENT LAYER ────────────────────────────────────── */}

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <motion.div
          style={{ y: textY, opacity }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease }}
        >
          <motion.span 
            className="text-[10px] uppercase tracking-[0.4em] text-gold mb-10 block font-semibold"
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.4em" }}
            transition={{ duration: 1.2, delay: 0.2, ease }}
          >
            ESTABLISHED 2024
          </motion.span>
          
          <h1 className="font-editorial text-[13vw] sm:text-[11vw] md:text-[9vw] lg:text-[7.5vw] leading-[0.95] text-white tracking-tighter">
            The <span className="font-editorial-italic text-gold italic">Architecture</span> <br />
            of Human <br />
            Discovery.
          </h1>

          <motion.p
            className="mt-12 text-white/40 font-sans text-sm md:text-base tracking-wide max-w-xl mx-auto font-light leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Moving beyond the noise of digital surface, <br className="hidden md:block" />
            we build for depth, signal, and the pursuit of truth.
          </motion.p>
        </motion.div>
      </div>

      {/* ── SCROLL CUE ────────────────────────────────────────── */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <span className="text-[8px] uppercase tracking-[0.3em] text-white/20 whitespace-nowrap">Explore our manifesto</span>
          <EditorialVerticalDivider />
        </motion.div>
      </div>
    </section>
  );
}
