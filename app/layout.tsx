import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import { Link2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { Button } from "@/components/ui/button";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LinkShort — Short links that work harder",
  description:
    "Create memorable short links, share them anywhere, and see how they perform with LinkShort.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider appearance={{ theme: shadcn }}>
          <header className="h-16 border-b border-white/8">
            <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-12">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-base font-semibold tracking-tight text-white"
              >
                <span className="grid size-8 place-items-center rounded-lg bg-sky-400 text-zinc-950">
                  <Link2 className="size-4" />
                </span>
                LinkShort
              </Link>
              <div className="flex items-center gap-3">
                <Show when="signed-out">
                  <SignInButton mode="modal">
                    <Button variant="ghost" className="text-zinc-300 hover:text-white">
                      Sign in
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button className="rounded-full bg-sky-400 px-4 font-semibold text-zinc-950 hover:bg-sky-300">
                      Sign up
                    </Button>
                  </SignUpButton>
                </Show>
                <Show when="signed-in">
                  <UserButton />
                </Show>
              </div>
            </div>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}