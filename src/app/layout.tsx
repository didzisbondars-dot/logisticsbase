import type { Metadata } from "next";
import "mapbox-gl/dist/mapbox-gl.css";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    template: "%s | LogisticsBase",
    default: "LogisticsBase — Logistics & Industrial Properties in Riga",
  },
  description:
    "Discover and compare logistics parks, warehouses and industrial properties in Riga.",
  keywords: ["logistics", "warehouse", "industrial", "logistics park", "Riga"],
  openGraph: {
    title: "LogisticsBase",
    description: "Logistics & Industrial Property Aggregator",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
