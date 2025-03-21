import type { Metadata } from "next";
import { poppins } from "./fonts";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { Toaster } from "sonner";
import { ScrollToTop } from "@/components/ScrollToTop";

export const metadata: Metadata = {
  title: "Parco dei Colori",
  description: "Associazione di Giardini e Farfalle",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${poppins.variable} bg-gray-50`}>
        <Navbar />
        <main>{children}</main>
        <ScrollToTop />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
