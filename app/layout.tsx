import "./globals.css";
import Nav from "@/components/Nav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Budget Tracker",
  description: "Simple monthly budget tracker with categories and charts",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="container" style={{marginTop:"1rem"}}>{children}</main>
      </body>
    </html>
  );
}
