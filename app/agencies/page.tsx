import type { Metadata } from "next";
import Link from "next/link";

import { channelPhrase, fetchAgencyRegister } from "@/lib/agency-registry";

export const metadata: Metadata = {
  title: "Agency application requirements",
  description:
    "What each agency actually asks for in an application — shot lists, file limits and eligibility, researched from their own published pages and dated. Pholio is not affiliated with any agency listed.",
};

export const revalidate = 1800;

/**
 * The register.
 *
 * This is a list of documents, not a grid of cards. The page argues one thing —
 * that Pholio writes down what agencies actually ask for and says when it last
 * checked — and a card grid would argue that there are a lot of them, which is
 * neither true nor the point. Six hand-verified entries presented as a register
 * is a stronger claim than six entries presented as a catalogue.
 *
 * The dates are the argument. Every competitor in this space publishes
 * requirements with no indication of when they were true, which is how a page
 * ends up telling someone to email an address that stopped working a year ago.
 */
export default async function AgenciesPage() {
  const agencies = await fetchAgencyRegister();

  return (
    <main className="min-h-mobile-screen bg-[#FAF7F2]">
      <div className="px-6 pt-40 pb-32">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-editorial text-5xl md:text-7xl text-[#050505] leading-[1.05]">
            What agencies
            <br />
            actually ask for.
          </h1>

          <p className="mt-8 max-w-xl font-sans text-base font-light leading-relaxed text-[#050505]/65">
            Application requirements are real and mostly invisible. They live in the
            form&rsquo;s markup: one agency silently rejects the format an iPhone shoots by
            default, another caps every file at a megabyte, a third asks for a shot nobody
            outside the industry has heard of. Below is what Pholio has read on each
            agency&rsquo;s own pages, when it was last read, and where it came from.
          </p>

          <p className="mt-5 max-w-xl font-sans text-base font-light leading-relaxed text-[#050505]/65">
            Pholio is not affiliated with any agency listed here and cannot submit on
            anyone&rsquo;s behalf. Every entry links to the agency&rsquo;s own page, which
            is the authority if the two ever disagree.
          </p>

          {agencies === null ? (
            /* Not "no agencies" — that is a different and false sentence, and it
               would sit in the CDN for half an hour after the app came back. */
            <p className="mt-16 font-sans text-base font-light leading-relaxed text-[#050505]/55">
              The register cannot be reached at the moment. It should return shortly.
            </p>
          ) : agencies.length === 0 ? (
            <p className="mt-16 font-sans text-base font-light leading-relaxed text-[#050505]/55">
              Pholio holds no verified entries right now. Only hand-checked agencies are
              listed, so this says what has been verified, not what exists.
            </p>
          ) : (
            <ul className="mt-16 border-t border-[#050505]/10">
              {agencies.map((agency) => (
                <li key={agency.seriesId} className="border-b border-[#050505]/10">
                  <Link
                    href={`/agencies/${encodeURIComponent(agency.seriesId)}`}
                    className="group block py-7 transition-colors duration-200"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                      <h2 className="font-editorial text-2xl md:text-3xl font-light text-[#050505] transition-colors duration-200 group-hover:text-[#A8894E]">
                        {agency.organization.name}
                      </h2>
                      {/* Mono on real data only: this is a date, not a label
                          announcing that design happened. */}
                      {agency.checked.reviewedOn && (
                        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#050505]/40">
                          Checked {agency.checked.reviewedOn}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 font-sans text-sm font-light text-[#050505]/60">
                      {[agency.office?.name || agency.market.city, `Applications by ${channelPhrase(agency.channel.type)}`]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
