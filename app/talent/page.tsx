// Server component — metadata requires server component
import TalentFlowPage from "@/components/talent-flow/TalentFlowPage";

export const metadata = {
  title: "Talent — Pholio",
  description:
    "For models, actors, and creatives: a comp card that composes itself, a book the booker sees on your terms, applications that arrive complete, and honest signal on who leaned in. Free to apply.",
  openGraph: {
    title: "Talent — Pholio",
    description:
      "A comp card that composes itself. A book on your terms. Applications that arrive complete, and honest signal on who leaned in. Free to apply — never a fee to be seen.",
    url: "https://www.pholio.studio/talent",
    siteName: "Pholio",
    type: "website",
  },
};

export default function TalentPage() {
  return <TalentFlowPage />;
}
