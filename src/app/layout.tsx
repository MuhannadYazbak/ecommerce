// src/app/layout.tsx
import './globals.css'; // 🔥 Move your Tailwind global styles import here!

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}