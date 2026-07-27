import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sosha - E-Commerce ERP CRM Platform",
  description: "Integrated E-Commerce, ERP, and CRM Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <Navbar />
          <main className="flex-1 bg-gray-50">{children}</main>
        </CartProvider>
        <footer className="bg-gray-800 text-white py-6">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p>  Sosha E-Commerce ERP CRM Platform</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
