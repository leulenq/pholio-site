import Link from "next/link";
import Image from "next/image";
import { INTRODUCTION, PLANS } from "@/components/pricing/content";
import { STUDIO_PLUS_PRICE_MONTHLY, STUDIO_PLUS_TRIAL_DAYS } from "@/lib/marketing-pricing";

/** A reader without JS gets the same product facts and real destinations. */
export default function HomeNoScript() {
  return <noscript>
    <style>{`.home-experience,.home-preloader{display:none!important}`}</style>
    <section className="bg-[#FAF7F2] px-6 pb-20 pt-40 text-[#050505]">
      <div className="mx-auto max-w-3xl">
        <Image src="/press/kit/wordmark/pholio-wordmark-velvet.svg" alt="Pholio" width={958} height={149} unoptimized className="mb-12 h-auto w-full" />
        <h1 className="font-editorial text-4xl leading-relaxed">Your book. Your applications.</h1>
        <p className="mt-8 font-sans text-base leading-relaxed">{INTRODUCTION}</p>
        <p className="mt-5 font-sans text-base leading-relaxed">Applying is free. Agencies are never charged. Studio+ adds premium comp-card themes, a portfolio website and 90-day analytics for ${STUDIO_PLUS_PRICE_MONTHLY} a month after a {STUDIO_PLUS_TRIAL_DAYS}-day trial.</p>
        <nav aria-label="Explore Pholio" className="mt-9 flex flex-wrap gap-x-8 gap-y-4 font-sans underline underline-offset-4">
          <Link href="/talent">For models</Link>
          <Link href="/agencies">Agency application requirements</Link>
          <Link href="/studio-plus">Studio+</Link>
          <a href={PLANS.free.cta.href}>Apply free</a>
        </nav>
      </div>
    </section>
  </noscript>;
}
