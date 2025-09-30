import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '@ant-design/v5-patch-for-react-19';
import React, { useTransition } from "react";
import Navbar from "@/components/Navbar"
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from "@/context/CartContext";
import ChatbotUI from "@/components/ChatbotUI";

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

export default function RootLayout({

  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("NEXT_PUBLIC_APP_ENV:", process.env.NEXT_PUBLIC_APP_ENV);
  // const lang = typeof window !== 'undefined' ? navigator.language.split('-')[0] : 'ar'
  // const dir = lang === 'ar' || lang === 'he' ? 'rtl' : 'ltr';
  // console.log('Language_code is: ', lang, ' and dir is: ', dir);

  return (
    <html>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-green-400`}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            {children}
            <div className="fixed bottom-4 right-4 overflow-hidden z-50 shadow-lg bg-white border rounded-lg">
              <ChatbotUI />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
