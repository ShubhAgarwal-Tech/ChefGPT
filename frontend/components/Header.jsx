import React from "react";
import { Button } from "./ui/button";
import { Cookie, Refrigerator, Sparkles, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import HowToCookModal from "./HowToCookModal";
import PricingModal from "./PricingModal";
import Image from "next/image";
import { checkUser } from "@/lib/checkUser";
import { Badge } from "./ui/badge";
import UserDropdown from "./UserDropdown";
import { auth } from "@clerk/nextjs/server";

export default async function Header() {
  const { userId, has } = await auth();
const subscriptionTier = userId && has({ plan: "pro" }) ? "pro" : "free";

  return (
    <header className="fixed top-0 w-full border-b border-stone-200 bg-stone-100 backdrop-blur-md z-50 supports-backdrop-filter:bg-stone-100">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-start">
          <Image
            src="/logo-v4.png"
            alt="ChefGPT"
            width={500}
            height={150}
            priority
            className="
      object-contain
      
      w-28
      sm:w-30
      md:w-42
      lg:w-48
      xl:w-50
      
      h-auto
    "
          />
        </Link>


        {/* Action Buttons */}
        <div className="flex items-center gap-1.8 sm:gap-3 md:gap-4 lg:gap-8">
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-stone-600">
            <Link
              href="/dashboard"
              className="hover:text-orange-600 transition-colors flex gap-1 items-center"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              href="/recipes"
              className="hover:text-orange-600 transition-colors flex gap-1 items-center"
            >
              <Cookie className="w-4 h-4" />
              My Recipes
            </Link>
            <Link
              href="/pantry"
              className="hover:text-orange-600 transition-colors flex gap-1 items-center"
            >
              <Refrigerator className="w-4 h-4" />
              My Pantry
            </Link>
          </div>
          <HowToCookModal />

          <SignedIn>
            {/* Pricing Modal with Built-in Trigger */}
            <PricingModal subscriptionTier={subscriptionTier}>
                <Badge
                  variant="outline"
                  className={`flex h-6 sm:h-7 md:h-8 px-2 sm:px-3 gap-1 sm:gap-1.5 rounded-full text-[10px] sm:text-xs font-semibold transition-all ${
                    subscriptionTier === "pro"
                      ? "bg-linear-to-r from-orange-600 to-amber-500 text-white border-none shadow-sm"
                      : "bg-stone-200/50 text-stone-600 border-stone-200 cursor-pointer hover:bg-stone-300/50 hover:border-stone-300"
                  }`}
                >
                  <Sparkles
                    className={`h-3 w-3 ${
                      subscriptionTier === "pro"
                        ? "text-white fill-white/20"
                        : "text-stone-500"
                    }`}
                  />
                  <span>
                    {subscriptionTier === "pro" ? "Pro Chef" : "Free Plan"}
                  </span>
                </Badge>
              </PricingModal>

            <UserDropdown />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <Button
                variant="ghost"
                className="text-[11px] sm:text-sm text-stone-600 hover:text-orange-600 hover:bg-orange-50 px-2 sm:px-3 md:px-2 py-1 sm:py-2 font-medium"
              >
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="primary" className="rounded-full text-[11px] sm:text-sm px-3 sm:px-4 md:px-6 py-1 sm:py-2">
                Get Started
              </Button>
            </SignUpButton>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
}
