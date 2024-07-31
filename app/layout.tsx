import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { ThemeProvider } from '@/providers/theme-provider';
import { ConvexClerkProvider } from '@/providers/convex-clerk-provider';
import { Loading } from '@/components/loading';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Typist',
  description: 'A typing test app for practicing typing speed and accuracy.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Suspense fallback={<Loading />}>
        <body className={inter.className}>
          <ConvexClerkProvider>
            <ThemeProvider attribute="class">
              <Navbar />
              {children}
              <Footer />
              <Toaster position="top-center" richColors />
            </ThemeProvider>
          </ConvexClerkProvider>
        </body>
      </Suspense>
    </html>
  );
}
