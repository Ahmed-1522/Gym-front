import React from "react";
import { Button } from "@/components/ui/button";

const stats = [
  {
    value: "12K+",
    label: "Active members",
    accent: "from-emerald-400 to-cyan-400",
  },
  {
    value: "48",
    label: "Expert trainers",
    accent: "from-orange-400 to-rose-400",
  },
  {
    value: "1.8K",
    label: "Monthly subscriptions",
    accent: "from-violet-400 to-fuchsia-400",
  },
  {
    value: "24K",
    label: "Daily check-ins",
    accent: "from-amber-300 to-yellow-400",
  },
];

const features = [
  {
    icon: "🏋️",
    title: "Membership management",
    description:
      "Keep every member profile organized with a clean, simple control flow.",
  },
  {
    icon: "📅",
    title: "Subscription tracking",
    description:
      "Monitor renewals, plan status, and payment progress at a glance.",
  },
  {
    icon: "✅",
    title: "Attendance check-in",
    description:
      "Track check-ins quickly so you always know who is active today.",
  },
  {
    icon: "📊",
    title: "Reports dashboard",
    description:
      "Review membership growth, engagement, and subscription trends in one place.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.24),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(249,115,22,0.16),_transparent_28%),linear-gradient(180deg,_rgba(15,23,42,0.98),_rgba(2,6,23,1))]" />
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:64px_64px]" />

        <div className="relative mx-auto flex max-w-7xl flex-col gap-14 px-6 py-20 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-200 shadow-lg shadow-emerald-950/20 backdrop-blur">
                <span>⚡</span>
                Train harder. Manage smarter.
              </div>

              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
                Build stronger habits with a gym experience that feels premium.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Motivate members, simplify subscriptions, and keep your gym
                running smoothly with a dashboard designed for action, clarity,
                and growth.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button className="h-12 rounded-full bg-emerald-400 px-7 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-300 hover:scale-[1.02]">
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  className="h-12 rounded-full border-white/15 bg-white/5 px-7 text-sm font-semibold text-white backdrop-blur transition hover:border-emerald-400/40 hover:bg-white/10"
                >
                  View Plans
                </Button>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-2xl font-bold text-white">Open 24/7</p>
                  <p className="mt-1 text-sm text-slate-300">
                    Stay flexible for every training schedule.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-2xl font-bold text-white">
                    Fast Check-ins
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    Less waiting, more lifting.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-2xl font-bold text-white">Smart Reports</p>
                  <p className="mt-1 text-sm text-slate-300">
                    Understand growth at a glance.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-emerald-400/20 via-cyan-400/10 to-orange-400/10 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/8 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                      Gym overview
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-white">
                      Momentum dashboard
                    </h2>
                  </div>
                  <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                    Live now
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                    <p className="text-sm text-slate-400">Today&apos;s goal</p>
                    <p className="mt-2 text-3xl font-black text-white">86%</p>
                    <div className="mt-4 h-2 rounded-full bg-white/10">
                      <div className="h-2 w-[86%] rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                    <p className="text-sm text-slate-400">Peak hours</p>
                    <p className="mt-2 text-3xl font-black text-white">
                      6-9 PM
                    </p>
                    <p className="mt-3 text-sm text-slate-300">
                      High energy, fast flow, better member retention.
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {["Strength", "Endurance", "Recovery"].map((label, index) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"
                    >
                      <p className="text-sm text-slate-400">{label}</p>
                      <p className="mt-2 text-2xl font-bold text-white">
                        {index === 0 ? "128" : index === 1 ? "92" : "74"}
                      </p>
                      <p className="mt-1 text-xs text-slate-300">
                        tracked sessions
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
            >
              <div
                className={`h-1.5 w-20 rounded-full bg-gradient-to-r ${stat.accent}`}
              />
              <p className="mt-5 text-3xl font-black text-white">
                {stat.value}
              </p>
              <p className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-300">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
              Core features
            </p>
            <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
              Everything your gym team needs in one place
            </h2>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/8 to-white/5 p-6 shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/10"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10 text-2xl">
                {feature.icon}
              </div>
              <h3 className="mt-5 text-xl font-bold text-white">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-r from-emerald-500 via-cyan-500 to-orange-500 p-[1px] shadow-2xl shadow-black/30">
          <div className="rounded-[2rem] bg-slate-950 px-6 py-10 sm:px-10 sm:py-12">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
                  Join the movement
                </p>
                <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                  Bring new energy to your gym and keep every member moving
                  forward.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  Whether you are welcoming new members or managing a growing
                  fitness community, this dashboard helps your team stay
                  focused, organized, and ready to grow.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
                <Button className="h-12 rounded-full bg-white px-7 text-sm font-semibold text-slate-950 transition hover:bg-slate-200">
                  Join Now
                </Button>
                <Button
                  variant="outline"
                  className="h-12 rounded-full border-white/20 bg-white/5 px-7 text-sm font-semibold text-white backdrop-blur transition hover:border-white/40 hover:bg-white/10"
                >
                  Manage Members
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
