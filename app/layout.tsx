import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Jennifer & Armando",
  description: "Acompáñanos a celebrar nuestra boda el sábado 24 de octubre de 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${montserrat.className} antialiased w-full overflow-x-hidden bg-[#FFFFF0] text-[#0F4C3A]`}>
        {children}
      </body>
    </html>
  );
}