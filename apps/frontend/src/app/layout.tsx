import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/lib/providers"; // นำเข้า Providers ที่เพิ่งสร้าง
import { GoogleOAuthProvider } from '@react-oauth/google';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mockup Login",
  description: "A production-like portfolio project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleOAuthProvider clientId={clientId}>
          <Providers>
            {children}
          </Providers>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
