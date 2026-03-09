import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Header from "@/components/Header";
import { simple } from "@clerk/themes";
import Image from "next/image";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ChefGPT - AI Recipes Platform",
  description: "AI-powered recipe platform for chefs",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  const year = new Date().getFullYear();
  
  return (
    <ClerkProvider
      appearance={{
        baseTheme: simple,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} flex flex-col min-h-screen`}>
          <Header />
          <main className="flex-1">{children}</main>
          <Toaster richColors />

          {/* Footer */}
          <footer className="bg-stone-100 text-stone-600 border-t border-stone-200">
            <div className="container mx-auto px-4 py-5 flex flex-col items-center text-center">
              {/* Logo */}
              <Link href="/">
                <Image
                  src="/logo-v4.png"
                  alt="ChefGPT"
                  width={220}
                  height={20}
                  className="object-contain w-35 sm:w-44 md:w-52 h-auto hover:scale-105 transition-transform"
                />
              </Link>

              {/* Description */}
              <p className="text-sm text-stone-500 max-w-md mt-2 mb-8">
                ChefGPT is your AI-powered cooking assistant that helps you
                generate recipes, manage your pantry, and discover what you can
                cook instantly.
              </p>

              {/* Copyright */}
              <p className="text-sm text-stone-400">
                © {year} ChefGPT. All rights reserved.
              </p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
