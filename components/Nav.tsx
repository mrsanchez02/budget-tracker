"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Dashboard" },
  { href: "/transactions", label: "Transactions" },
  { href: "/categories", label: "Categories" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="container" style={{marginTop:"1rem"}}>
      <div className="card" style={{display:"flex", gap:".5rem"}}>
        {tabs.map(t => (
          <Link key={t.href} href={t.href}
            className={`btn secondary ${pathname === t.href ? "" : ""}`}
            style={{textDecoration: pathname===t.href ? "underline" : "none"}}
          >
            {t.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
