import Link from "next/link";
import { Logo } from "./logo";

const COLUMNS = [
  {
    title: "Study",
    links: [
      { href: "/catalogue", label: "Language catalogue" },
      { href: "/catalogue/mandarin", label: "Mandarin, HSK 1-6" },
      { href: "/tutor", label: "Live speaking tutor" },
      { href: "/kids", label: "Kids and early years" },
    ],
  },
  {
    title: "Proof",
    links: [
      { href: "/credentials", label: "Credential registry" },
      { href: "/credentials#verify", label: "Verify a signature" },
      { href: "/pricing", label: "What a lesson costs" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/manifesto", label: "Why we built this" },
      { href: "https://github.com/bryankwandou/fluentia", label: "Source on GitHub" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ink-900/40">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Study any of 200+ languages against a real examiner, then keep a
              record of the result that outlives the app it came from.
            </p>
            <p className="mt-4 text-xs text-muted/70">
              Running on Solana devnet. Balances are test funds, not money.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-xs uppercase tracking-[0.14em] text-muted/70">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-paper"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-muted/70 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Fluentia</span>
          <span>Built for the Solana hackathon. Devnet only.</span>
        </div>
      </div>
    </footer>
  );
}
