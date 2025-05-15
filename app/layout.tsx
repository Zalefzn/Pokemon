'use client'; 
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}