import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      className="min-h-mobile-screen flex flex-col items-start justify-center px-6 md:px-12"
      style={{ backgroundColor: "#050505" }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          color: "rgba(250,247,242,0.38)",
        }}
      >
        404
      </p>
      <h1
        className="font-editorial mt-5"
        style={{
          fontSize: "clamp(2rem, 6vw, 3.4rem)",
          color: "rgba(250,247,242,0.92)",
        }}
      >
        This page isn&rsquo;t{" "}
        <span className="font-editorial-italic" style={{ color: "#C9A55A" }}>
          here
        </span>
        .
      </h1>
      <Link
        href="/"
        className="mt-9"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#FAF7F2",
          textDecoration: "none",
        }}
      >
        Back to Pholio
      </Link>
    </main>
  );
}
