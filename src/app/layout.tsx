// src/app/layout.tsx
import ClientAnalytics from '../components/clientAnalytics'
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <ClientAnalytics />
      </body>
    </html>
  );
}