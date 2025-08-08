"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs: { href: '/' | '/transactions' | '/categories'; label: string }[] = [
  { href: "/", label: "Dashboard" },
  { href: "/transactions", label: "Transactions" },
  { href: "/categories", label: "Categories" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="container" style={{marginTop:"1rem"}}>
      <div className="card" style={{display:"flex", gap:".5rem"}}>
        {tabs.map((t) => {
          const isActive = pathname === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={cn("btn", isActive ? "underline" : "secondary")}
              aria-current={isActive ? "page" : undefined}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
