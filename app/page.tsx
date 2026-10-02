import {
  ArrowDownRight,
  ArrowRight,
  BarChart3,
  Check,
  Link2,
  MousePointer2,
  Sparkles,
  Zap,
} from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Link2,
    title: "Links that look good",
    description:
      "Turn long, messy URLs into short links that are easy to share and remember.",
    accent: "bg-sky-400/10 text-sky-300",
  },
  {
    icon: BarChart3,
    title: "Know what’s working",
    description:
      "Get a clear view of link engagement, so you can understand what your audience cares about.",
    accent: "bg-violet-400/10 text-violet-300",
  },
  {
    icon: MousePointer2,
    title: "Stay in control",
    description:
      "Keep your links organized in one simple place and find the right one whenever you need it.",
    accent: "bg-emerald-400/10 text-emerald-300",
  },
];

const steps = [
  ["01", "Paste your long link", "Start with any URL you want to share."],
  ["02", "Make it yours", "Create a short, memorable link in moments."],
  ["03", "Share with confidence", "Send it anywhere and keep track of how it performs."],
];

export default async function Home() {
  const { isAuthenticated } = await auth();
  if (isAuthenticated) redirect("/dashboard");

  return (
    <main className="flex-1 overflow-hidden">
      <section className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-14 px-6 py-20 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:px-12 lg:py-28">
        <div className="pointer-events-none absolute -left-40 top-10 -z-10 size-[28rem] rounded-full bg-sky-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 top-1/4 -z-10 size-[22rem] rounded-full bg-violet-500/10 blur-[110px]" />

        <div className="max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm text-zinc-300">
            <Sparkles className="size-4 text-sky-300" />
            <span>A smarter way to share links</span>
          </div>
          <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Make every link
            <span className="mt-2 block bg-gradient-to-r from-sky-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              worth sharing.
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-zinc-400 sm:text-xl">
            Create short, memorable links, share them anywhere, and see how
            they&apos;re performing—all from one simple dashboard.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <SignUpButton mode="modal">
              <Button
                size="lg"
                className="h-12 gap-2 rounded-full bg-sky-400 px-6 text-base font-semibold text-zinc-950 hover:bg-sky-300"
              >
                Get started for free
                <ArrowRight className="size-4" />
              </Button>
            </SignUpButton>
            <a
              className="inline-flex h-12 items-center gap-2 rounded-full px-4 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
              href="#features"
            >
              Explore features
              <ArrowDownRight className="size-4" />
            </a>
          </div>
          <div className="mt-7 flex items-center gap-2 text-sm text-zinc-500">
            <Check className="size-4 text-emerald-400" />
            <span>Simple to use. Ready when you are.</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
          <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-sky-500/15 via-transparent to-violet-500/15 blur-2xl" />
          <div className="relative rounded-3xl border border-white/10 bg-zinc-900/90 p-5 shadow-2xl shadow-black/40 backdrop-blur sm:p-7">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="text-sm font-medium text-white">Link overview</p>
                <p className="mt-1 text-xs text-zinc-500">Your links, at a glance</p>
              </div>
              <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs font-medium text-sky-200">
                Preview
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="text-xs text-zinc-500">Your links</p>
                <p className="mt-2 text-2xl font-semibold text-white">All in one place</p>
                <p className="mt-1 text-xs text-zinc-500">Easy to organize</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="text-xs text-zinc-500">Link insights</p>
                <p className="mt-2 flex items-center gap-2 text-2xl font-semibold text-white">
                  <Zap className="size-5 text-amber-300" />
                  At a glance
                </p>
                <p className="mt-1 text-xs text-zinc-500">Understand engagement</p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-white">Recent links</p>
                <span className="text-xs text-zinc-500">A quick preview</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-sky-400/10 text-sky-300">
                    <Link2 className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-200">short.link/product-launch</p>
                    <p className="mt-1 truncate text-xs text-zinc-500">yourwebsite.com/spring-product-launch</p>
                  </div>
                  <span className="hidden rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-300 sm:block">
                    Active
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-violet-400/10 text-violet-300">
                    <Link2 className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-200">short.link/weekly-update</p>
                    <p className="mt-1 truncate text-xs text-zinc-500">yourwebsite.com/newsletter/october</p>
                  </div>
                  <span className="hidden rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-300 sm:block">
                    Active
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 border-t border-white/8 pt-4 text-xs text-zinc-500">
                <BarChart3 className="size-4 text-sky-300" />
                Your links and insights, together in one place
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-y border-white/8 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
              Made for sharing
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Everything your links need.
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-400">
              Spend less time managing URLs and more time getting your message
              out there.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description, accent }) => (
              <article
                key={title}
                className="rounded-2xl border border-white/8 bg-zinc-900/60 p-6 transition-colors hover:border-white/15 hover:bg-zinc-900"
              >
                <span className={`grid size-11 place-items-center rounded-xl ${accent}`}>
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
              Three steps. One less thing to worry about.
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              From long URL to ready-to-share.
            </h2>
            <p className="mt-4 max-w-lg leading-7 text-zinc-400">
              Make sharing links a small, simple part of your day—not another
              thing to figure out.
            </p>
          </div>
          <div className="divide-y divide-white/8 rounded-2xl border border-white/8 bg-white/[0.02] px-6 sm:px-8">
            {steps.map(([number, title, description]) => (
              <div key={number} className="flex gap-5 py-6">
                <span className="pt-0.5 font-mono text-sm text-sky-300">{number}</span>
                <div>
                  <h3 className="font-medium text-white">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-zinc-400">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 sm:px-10 lg:px-12 lg:pb-24">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-3xl border border-sky-300/15 bg-gradient-to-br from-sky-400/10 via-blue-500/[0.06] to-violet-400/10 px-7 py-10 sm:px-10 sm:py-12 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Ready to make your links work harder?
            </h2>
            <p className="mt-3 max-w-xl leading-7 text-zinc-400">
              Bring your links together and make every share count.
            </p>
          </div>
          <SignUpButton mode="modal">
            <Button
              size="lg"
              className="h-12 shrink-0 gap-2 rounded-full bg-sky-400 px-6 text-base font-semibold text-zinc-950 hover:bg-sky-300"
            >
              Create your first link
              <ArrowRight className="size-4" />
            </Button>
          </SignUpButton>
        </div>
      </section>
    </main>
  );
}
