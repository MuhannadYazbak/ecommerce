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

// Inside your src/app/[locale]/layout.tsx
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const direction = locale === 'ar' || locale === 'he' ? 'rtl' : 'ltr';

  return (
    <div 
      lang={locale} 
      dir={direction} 
      className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen w-full`}
    >
      {/* 💡 Pass the live locale into the wrapper directly here */}
      <I18nWrapper locale={locale}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <div className="fixed bottom-4 right-4 overflow-hidden z-50 shadow-lg bg-white border rounded-lg">
              <ChatbotUI />
            </div>
          </CartProvider>
        </AuthProvider>
      </I18nWrapper>
    </div>
  );
}