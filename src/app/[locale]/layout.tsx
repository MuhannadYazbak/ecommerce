import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import React from "react";
import Navbar from "@/components/Navbar";
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from "@/context/CartContext";
import ChatbotUI from "@/components/ChatbotUI";
import I18nWrapper from "../I18nWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechMart",
  description: "Your one-stop shop for gadgets!",
};

// Update the type signature to accept your dynamic params promise
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Unpack the active language directly from the folder routing tree
  const { locale } = await params;
  const direction = locale === 'ar' || locale === 'he' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <I18nWrapper>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              {children}
              <div className="fixed bottom-4 right-4 overflow-hidden z-50 shadow-lg bg-white border rounded-lg">
                <ChatbotUI />
              </div>
            </CartProvider>
          </AuthProvider>
        </I18nWrapper>
      </body>
    </html>
  );
}