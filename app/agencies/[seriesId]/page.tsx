import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  channelPhrase,
  eligibilityPhrase,
  fetchAgency,
  fetchAgencyRegister,
  fileRulePhrase,
  heicNote,
  modalityPhrase,
  type AgencyDetail,
} from "@/lib/agency-registry";

export const revalidate = 1800;

interface PageProps {
  params: Promise<{ seriesId: string }>;
}

export async function generateStaticParams() {
  const agencies = await fetchAgencyRegister();
  return (agencies || []).map((agency) => ({ seriesId: agency.seriesId }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { seriesId } = await params;
  const agency = await fetchAgency(seriesId);
  if (!agency) return { title: "Agency not found" };

  const name = agency.organization.name ?? "this agency";
  return {
    title: `How to apply to ${name}`,
    // The date is in the description on purpose: it is the claim that
    // distinguishes this result from the scraped ones above and below it.
    description: `${name}'s published application requirements — what to send, file limits and eligibility${
      agency.checked.reviewedOn ? `, last checked ${agency.checked.reviewedOn}` : ""
    }. Researched from their own pages. Pholio is not affiliated with ${name}.`,
  };
}

/* ── pieces ──────────────────────────────────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-16 border-t border-[#050505]/10 pt-10">
      <h2 className="font-editorial text-2xl md:text-3xl font-light text-[#050505]">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

/** A requirement: Pholio's reading, then the agency's own words beneath it. */
function SlotRow({ slot }: { slot: AgencyDetail["requirements"]["slots"][number] }) {
  const modality = modalityPhrase(slot.modality);
  const quantity =
    slot.minimum && slot.maximum && slot.minimum === slot.maximum
      ? `${slot.minimum}`
      : slot.minimum
        ? `${slot.minimum}+`
        : null;

  return (
    <li className="border-b border-[#050505]/10 py-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="font-sans text-base text-[#050505]/85">
          {slot.reading.length > 0 ? slot.reading.join(" · ") : slot.sourceLabel}
        </p>
        {quantity && (
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#050505]/40">
            {quantity} image{quantity === "1" ? "" : "s"}
          </span>
        )}
      </div>
      {/* Their sentence, verbatim. If Pholio's reading is wrong, this is how a
          reader finds out — which is the point of showing it at all. */}
      {slot.reading.length > 0 && slot.sourceLabel && (
        <p className="mt-2 font-sans text-sm font-light italic text-[#050505]/50">
          &ldquo;{slot.sourceLabel}&rdquo;
        </p>
      )}
      {modality && (
        <p className="mt-2 font-sans text-sm font-light text-[#050505]/50">{modality}</p>
      )}
    </li>
  );
}

/* ── page ────────────────────────────────────────────────────────────────── */

export default async function AgencyPage({ params }: PageProps) {
  const { seriesId } = await params;
  const agency = await fetchAgency(seriesId);
  if (!agency) notFound();

  const name = agency.organization.name ?? "This agency";
  const { requirements, notPublished, sources, checked } = agency;
  const files = requirements.files ?? [];
  const heic = heicNote(files);

  return (
    <main className="min-h-mobile-screen bg-[#FAF7F2]">
      <div className="px-6 pt-40 pb-32">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/agencies"
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#050505]/40 transition-colors duration-200 hover:text-[#A8894E]"
          >
            ← All agencies
          </Link>

          <h1 className="mt-8 font-editorial text-5xl md:text-7xl leading-[1.05] text-[#050505]">
            Applying to {name}.
          </h1>

          <p className="mt-8 max-w-xl font-sans text-base font-light leading-relaxed text-[#050505]/65">
            {[
              agency.office?.name || agency.market.city,
              `applications reach them by ${channelPhrase(agency.channel.type)}`,
            ]
              .filter(Boolean)
              .join(" — ")}
            .{" "}
            {agency.channel.url && (
              <a
                href={agency.channel.url}
                target="_blank"
                rel="noreferrer noopener"
                className="text-[#A8894E] underline underline-offset-4 transition-opacity duration-200 hover:opacity-70"
              >
                Their own page
              </a>
            )}
          </p>

          {/* The dates sit near the top rather than in a footer. How old this is
              changes how much of it a reader should trust, and that is not a
              footnote. */}
          {(checked.reviewedOn || checked.nextReviewOn) && (
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-[#050505]/40">
              {checked.reviewedOn && <>Last checked {checked.reviewedOn}</>}
              {checked.nextReviewOn && <> · Next review {checked.nextReviewOn}</>}
            </p>
          )}

          {requirements.slots.length > 0 && (
            <Section title="What to send">
              {requirements.shotCount.minimum && (
                <p className="mb-4 font-sans text-base font-light text-[#050505]/65">
                  At least {requirements.shotCount.minimum} images
                  {requirements.shotCount.maximum
                    ? `, and no more than ${requirements.shotCount.maximum}`
                    : ""}
                  .
                </p>
              )}
              <ul className="border-t border-[#050505]/10">
                {requirements.slots.map((slot, i) => (
                  <SlotRow key={slot.id ?? i} slot={slot} />
                ))}
              </ul>
            </Section>
          )}

          {files.length > 0 && (
            <Section title="File limits">
              <ul className="space-y-5">
                {files.map((rule, i) => {
                  const phrase = fileRulePhrase(rule);
                  return (
                    <li key={rule.id ?? i}>
                      <p className="font-sans text-base text-[#050505]/85">
                        {phrase ?? rule.sourceLabel}
                      </p>
                      {phrase && rule.sourceLabel && (
                        <p className="mt-1.5 font-sans text-sm font-light italic text-[#050505]/50">
                          &ldquo;{rule.sourceLabel}&rdquo;
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
              {/* The one line most likely to save someone a rejection. */}
              {heic && (
                <p className="mt-6 max-w-xl font-sans text-base font-light leading-relaxed text-[#050505]/65">
                  {heic}
                </p>
              )}
            </Section>
          )}

          {requirements.eligibility.length > 0 && (
            <Section title="Who they say they are looking for">
              <ul className="space-y-5">
                {requirements.eligibility.map((rule, i) => {
                  const phrase = eligibilityPhrase(rule);
                  const modality = modalityPhrase(rule.modality);
                  return (
                    <li key={rule.id ?? i}>
                      <p className="font-sans text-base text-[#050505]/85">
                        {phrase ?? rule.sourceLabel}
                        {modality && phrase ? (
                          <span className="text-[#050505]/50"> — {modality.toLowerCase()}</span>
                        ) : null}
                      </p>
                      {phrase && rule.sourceLabel && (
                        <p className="mt-1.5 font-sans text-sm font-light italic text-[#050505]/50">
                          &ldquo;{rule.sourceLabel}&rdquo;
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Section>
          )}

          {notPublished.length > 0 && (
            <Section title="What they don't say">
              <p className="mb-5 max-w-xl font-sans text-base font-light leading-relaxed text-[#050505]/65">
                These are gaps in {name}&rsquo;s published instructions, not gaps in
                Pholio&rsquo;s research. Sites that answer them anyway are guessing.
              </p>
              <ul className="space-y-4">
                {notPublished.map((gap, i) => (
                  <li
                    key={gap.fact ?? i}
                    className="font-sans text-base font-light leading-relaxed text-[#050505]/75"
                  >
                    {gap.note}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {sources.length > 0 && (
            <Section title="Where this came from">
              <ul className="space-y-4">
                {sources.map((source, i) => (
                  <li key={source.url ?? i} className="font-sans text-sm font-light">
                    {source.url ? (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-[#050505]/75 underline underline-offset-4 transition-colors duration-200 hover:text-[#A8894E]"
                      >
                        {source.title || source.url}
                      </a>
                    ) : (
                      <span className="text-[#050505]/75">{source.title}</span>
                    )}
                    {source.retrievedOn && (
                      <span className="text-[#050505]/45"> — read {source.retrievedOn}</span>
                    )}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {agency.disclosure && (
            <p className="mt-16 border-t border-[#050505]/10 pt-10 max-w-xl font-sans text-sm font-light leading-relaxed text-[#050505]/55">
              {agency.disclosure}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
