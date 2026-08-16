"use client";

import Image from "next/image";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

function RevealSection({ children, className = "", delay = 0, y = 40 }: { children: React.ReactNode; className?: string; delay?: number; y?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function MissionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 0.2, 0.72, 1], [120, 0, -30, -92]);
  const sideY = useTransform(scrollYProgress, [0, 0.2, 0.72, 1], [176, 0, -18, -76]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.12, 0.78, 1], [0.1, 1, 1, 0]);
  const ghostY = useTransform(scrollYProgress, [0, 0.45, 1], [130, 0, -150]);
  const ghostOpacity = useTransform(scrollYProgress, [0, 0.18, 0.72, 1], [0, 0.035, 0.035, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[112dvh] items-center overflow-hidden px-6 py-40 md:px-14 md:py-56"
      aria-labelledby="mission-title"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-[#050505]/90" />

      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute right-[-0.08em] top-[18%] select-none font-editorial text-[30vw] leading-none tracking-[-0.08em] text-gold"
        style={reduceMotion ? undefined : { y: ghostY, opacity: ghostOpacity }}
      >
        Human
      </motion.span>

      <div className="relative z-10 mx-auto w-full max-w-[1440px]">
        <motion.div
          style={reduceMotion ? undefined : { y: contentY, opacity: contentOpacity }}
          className="grid grid-cols-1 items-end gap-20 lg:grid-cols-[55fr_45fr] lg:gap-32"
        >
          <div className="relative">
            <h2
              id="mission-title"
              className="font-editorial max-w-[11ch] text-5xl leading-[0.95] tracking-tight md:text-7xl lg:text-[5.5rem]"
            >
              We are building a more <br />
              <span className="font-editorial-italic italic text-gold">human</span> way to be seen.
            </h2>
          </div>

          <motion.div
            style={reduceMotion ? undefined : { y: sideY }}
            className="flex flex-col gap-10 border-l border-white/5 pb-2 lg:pl-20"
          >
            <p className="max-w-lg font-sans text-lg font-light leading-relaxed text-white/60 md:text-xl">
              Pholio began with a simple disagreement: that creative people should have to become louder, more available, or more legible to a feed in order to be taken seriously.
            </p>
            <p className="max-w-md font-editorial-italic text-2xl italic leading-snug text-gold/80 md:text-3xl">
              A person is more than the first thing a system can measure.
            </p>
            <p className="max-w-sm font-sans text-base font-light leading-relaxed text-white/40">
              We are making room for work and identity to arrive before the noise does, and for recognition to start with a fuller view of the person.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function PointOfViewSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const titleY = useTransform(scrollYProgress, [0, 0.22, 0.72, 1], [110, 0, -28, -82]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.14, 0.78, 1], [0, 1, 1, 0]);
  const oneX = useTransform(scrollYProgress, [0, 0.2, 0.72, 1], [-90, 0, 38, 82]);
  const twoX = useTransform(scrollYProgress, [0, 0.2, 0.72, 1], [90, 0, -34, -76]);
  const threeX = useTransform(scrollYProgress, [0, 0.2, 0.72, 1], [-52, 0, 28, 66]);
  const oneY = useTransform(scrollYProgress, [0, 0.2, 0.72, 1], [88, 0, -24, -70]);
  const twoY = useTransform(scrollYProgress, [0, 0.2, 0.72, 1], [120, 0, -36, -94]);
  const threeY = useTransform(scrollYProgress, [0, 0.2, 0.72, 1], [148, 0, -48, -116]);
  const principlesOpacity = useTransform(scrollYProgress, [0, 0.14, 0.78, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative -mt-[14dvh] min-h-[126dvh] overflow-hidden bg-[#050505] px-6 pb-40 pt-[calc(14dvh+10rem)] md:px-14 md:pb-64 md:pt-[calc(14dvh+16rem)]"
      aria-labelledby="point-of-view-title"
    >
      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          style={reduceMotion ? undefined : { y: titleY, opacity: titleOpacity }}
          className="mb-32"
        >
          <h2
            id="point-of-view-title"
            className="font-editorial text-5xl leading-[0.9] tracking-tight md:text-7xl lg:text-8xl"
          >
            The standard we are here <br />
            <span className="font-editorial-italic italic text-gold">to change.</span>
          </h2>
        </motion.div>

        <div className="relative grid grid-cols-1 gap-28 md:grid-cols-[0.7fr_1fr] md:gap-x-32 md:gap-y-40">
          <motion.div
            style={reduceMotion ? undefined : { x: oneX, y: oneY, opacity: principlesOpacity }}
            className="md:col-start-2"
          >
            <span className="font-editorial text-7xl opacity-[0.06] md:text-9xl">01</span>
            <h3 className="mt-5 font-editorial text-3xl leading-tight md:text-4xl">Recognition should begin with context.</h3>
            <p className="mt-7 max-w-lg font-sans text-lg font-light leading-relaxed text-white/50">
              The first impression should be accurate enough to matter. We care about the person behind the image, the work behind the profile, and the life that gives both their meaning.
            </p>
          </motion.div>

          <motion.div
            style={reduceMotion ? undefined : { x: twoX, y: twoY, opacity: principlesOpacity }}
            className="md:col-start-1 md:row-start-2"
          >
            <span className="font-editorial text-7xl opacity-[0.06] md:text-9xl">02</span>
            <h3 className="mt-5 font-editorial text-3xl leading-tight md:text-4xl">Access should follow the work.</h3>
            <p className="mt-7 max-w-lg font-sans text-lg font-light leading-relaxed text-white/50">
              A meaningful opportunity should not depend on knowing the right person, mastering the right feed, or performing confidence on command. The work deserves a fairer route into the room.
            </p>
          </motion.div>

          <motion.div
            style={reduceMotion ? undefined : { x: threeX, y: threeY, opacity: principlesOpacity }}
            className="md:col-start-2 md:row-start-3"
          >
            <span className="font-editorial text-7xl opacity-[0.06] md:text-9xl">03</span>
            <h3 className="mt-5 font-editorial text-3xl leading-tight md:text-4xl">Technology should know when to step back.</h3>
            <p className="mt-7 max-w-lg font-sans text-lg font-light leading-relaxed text-white/50">
              The platform is only successful when the person becomes clearer. We build the structure, then leave space for human judgment, curiosity, and the beginning of a real conversation.
            </p>
          </motion.div>
        </div>
      </div>

    </section>
  );
}

function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 0.28, 0.7, 1], [0, 0, -80, -140]);
  const imageScale = useTransform(scrollYProgress, [0, 0.28, 0.7, 1], [1.16, 1.06, 1, 0.94]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.18, 0.58, 0.84], [0.96, 0.9, 0.48, 0]);

  return (
    <section ref={sectionRef} className="relative -mt-[14dvh] overflow-hidden bg-[#FAF7F2] pb-48 pt-[calc(14dvh+12rem)] text-[#050505] md:pb-72 md:pt-[calc(14dvh+18rem)]">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[42dvh] overflow-hidden"
        style={reduceMotion ? undefined : { y: imageY, scale: imageScale, opacity: imageOpacity }}
      >
        <Image
          src="/images/vooglam-eyewear-QSb7IMnUoGo-unsplash.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[center_38%]"
        />
        <div className="absolute inset-0 bg-[#050505]/35" />
      </motion.div>

      <div className="absolute inset-0 z-0 flex select-none items-center justify-center overflow-hidden opacity-[0.03] pointer-events-none">
        <span className="font-editorial text-[80vw] leading-none text-[#C9A55A] italic">P</span>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <RevealSection className="mb-0 text-center">
          <span className="text-label mb-12 block text-[#C9A55A]">THE MANIFESTO</span>

          <div className="font-editorial text-5xl font-light uppercase leading-[0.85] tracking-[ -0.04em] sm:text-7xl md:text-8xl lg:text-[7rem]">
            <div className="flex flex-col gap-2 items-center text-center">
              <motion.div
                initial={{ x: -40, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 1.2, ease }}
                className="mb-2"
              >
                Curation is
              </motion.div>
              <motion.div
                initial={{ x: 40, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 1.4, delay: 0.2, ease }}
                className="font-editorial-italic italic text-[#C9A55A]"
              >
                Our Compass
              </motion.div>
              <motion.div
                initial={{ x: -40, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.4, ease }}
              >
                Quality is
              </motion.div>
              <motion.div
                initial={{ x: 40, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 1.4, delay: 0.6, ease }}
                className="font-editorial-italic italic text-[#C9A55A]"
              >
                Our Currency
              </motion.div>
            </div>
          </div>
        </RevealSection>
      </div>

      <div className="absolute bottom-0 left-[15%] top-0 hidden w-px bg-[#C9A55A]/10 lg:block" />
      <div className="absolute bottom-0 right-[15%] top-0 hidden w-px bg-[#C9A55A]/10 lg:block" />

    </section>
  );
}

export function AboutContent() {
  return (
    <div className="pb-40 text-white">
      
      <MissionSection />

      {/* ── 02. THE MANIFESTO — Cream Break ─────────────────────────────── */}
      <ManifestoSection />

      <PointOfViewSection />

      {/* ── 04. THE COLLECTIVE — Team Section ────────────────────────── */}
      <section className="relative -mt-[14dvh] overflow-hidden bg-[#FAF7F2] pb-40 pt-[calc(14dvh+10rem)] text-[#050505] md:pb-64 md:pt-[calc(14dvh+16rem)]">
        <div className="relative z-10 mx-auto max-w-[1440px] px-6">
          <RevealSection className="mb-24 text-center">
            <span className="text-label text-[#C9A55A] mb-8 block">THE COLLECTIVE</span>
            <h3 className="font-editorial text-5xl md:text-7xl leading-[0.95] mb-8 tracking-tight">
              Engineered by <br className="hidden md:block" />
              <span className="font-editorial-italic italic text-[#C9A55A]">Visionaries.</span>
            </h3>
            <p className="text-black/60 font-sans text-lg font-light leading-relaxed max-w-2xl mx-auto">
              Pholio is a convergence of editorial minds, technical engineers, and industry veterans committed to building the next standard for human identity.
            </p>
          </RevealSection>

          <div className="flex flex-col gap-16 mt-16 w-full">
            
            {/* Team Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {/* Leul Enquanhone */}
              <RevealSection className="group cursor-pointer">
                <div className="aspect-[4/5] overflow-hidden rounded-[2px] shadow-xl mb-8 relative bg-white">
                  <Image src="/assets/Leul_Portrait.PNG" alt="Leul Enquanhone" width={1200} height={1500} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700"></div>
                </div>
                <div className="text-center md:text-left flex flex-col items-center md:items-start">
                  <p className="text-[10px] tracking-[0.2em] font-bold uppercase text-[#C9A55A] mb-3">Co-Founder & Head of Engineering</p>
                  <h4 className="font-editorial text-4xl lg:text-5xl">Leul <span className="text-[#C9A55A] italic font-editorial-italic">Enquanhone</span></h4>
                  <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out opacity-0 group-hover:opacity-100">
                    <div className="overflow-hidden">
                      <p className="font-sans text-base text-black/60 font-light leading-relaxed max-w-sm pt-4">
                        A native of Ethiopia, Leul architects the technical foundation of Pholio. Specializing in cryptographic identity infrastructure and systems engineering, he translates complex verification models into the high-fidelity platform that powers our discovery engine.
                      </p>
                    </div>
                  </div>
                </div>
              </RevealSection>

              {/* Natan Getahun */}
              <RevealSection delay={0.1} className="group cursor-pointer">
                <div className="aspect-[4/5] overflow-hidden rounded-[2px] shadow-xl mb-8 relative bg-white">
                  <Image src="/assets/Natan_Portrait.png" alt="Natan Getahun" width={1200} height={1500} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700"></div>
                </div>
                <div className="text-center md:text-left flex flex-col items-center md:items-start">
                  <p className="text-[10px] tracking-[0.2em] font-bold uppercase text-[#C9A55A] mb-3">Co-Founder & Head of Business</p>
                  <h4 className="font-editorial text-4xl lg:text-5xl">Natan <span className="text-[#C9A55A] italic font-editorial-italic">Getahun</span></h4>
                  <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out opacity-0 group-hover:opacity-100">
                    <div className="overflow-hidden">
                      <p className="font-sans text-base text-black/60 font-light leading-relaxed max-w-sm pt-4">
                        A native of Ethiopia and the CEO of PXI LABS—Pholio&apos;s parent company—Natan specializes in scaling event-driven technologies. He drives the strategic vision for Pholio, forging the global partnerships necessary to connect emerging talent with premier agencies.
                      </p>
                    </div>
                  </div>
                </div>
              </RevealSection>

              {/* Alex Rieder */}
              <RevealSection delay={0.2} className="group cursor-pointer">
                <div className="aspect-[4/5] overflow-hidden rounded-[2px] shadow-xl mb-8 relative bg-white">
                  <Image src="/assets/Alex_Portrait.jpg" alt="Alex Rieder" width={1200} height={1500} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700"></div>
                </div>
                <div className="text-center md:text-left flex flex-col items-center md:items-start">
                  <p className="text-[10px] tracking-[0.2em] font-bold uppercase text-[#C9A55A] mb-3">Industry Advisor & FWB</p>
                  <h4 className="font-editorial text-4xl lg:text-5xl">Alex <span className="text-[#C9A55A] italic font-editorial-italic">Rieder</span></h4>
                  <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out opacity-0 group-hover:opacity-100">
                    <div className="overflow-hidden">
                      <p className="font-sans text-base text-black/60 font-light leading-relaxed max-w-sm pt-4">
                        Leveraging deep industry expertise to curate talent and align Pholio&apos;s standards with the pinnacle of the fashion world.
                      </p>
                    </div>
                  </div>
                </div>
              </RevealSection>
            </div>

          </div>
        </div>
      </section>

      {/* ── 05. CLOSING — High Impact ────────────────────────────────── */}
      <section className="relative -mt-[12dvh] overflow-hidden border-t border-white/5 bg-[#050505] pb-48 pt-[calc(12dvh+12rem)] text-center md:pb-72 md:pt-[calc(12dvh+18rem)]">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.7\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />
        
        <RevealSection className="px-6 relative z-10">
          <div className="font-editorial text-4xl sm:text-5xl md:text-7xl mb-16 max-w-5xl mx-auto leading-[1.05] tracking-tight">
            Building the next <span className="italic font-editorial-italic text-gold">standard</span> for <br className="hidden md:block" /> identity in the digital age.
          </div>
          <motion.div 
            className="w-16 h-16 border border-gold/20 rounded-full mx-auto flex items-center justify-center mb-10"
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
             <span className="font-editorial text-gold text-2xl">P.</span>
          </motion.div>
          <p className="text-[10px] uppercase tracking-[0.5em] text-white/20 font-medium">Pholio Studio Established 2024</p>
        </RevealSection>
      </section>

    </div>
  );
}
