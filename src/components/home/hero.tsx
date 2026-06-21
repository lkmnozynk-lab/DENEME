"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

function BookCard({
  className,
  title,
  author,
  tone,
  rotate,
}: {
  className?: string;
  title: string;
  author: string;
  tone: "sage" | "blue" | "cream";
  rotate: string;
}) {
  const tones = {
    sage: "from-primary/90 to-primary",
    blue: "from-secondary/90 to-secondary",
    cream: "from-accent to-surface-2",
  } as const;
  const text = tone === "cream" ? "text-foreground" : "text-white";

  return (
    <div
      className={`absolute w-40 select-none sm:w-44 ${className}`}
      style={{ transform: `rotate(${rotate})` }}
    >
      <div className="overflow-hidden rounded-r-lg rounded-l-sm shadow-lift">
        {/* spine highlight */}
        <div className="relative aspect-[3/4]">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${tones[tone]}`}
          />
          <div className="absolute inset-y-0 left-0 w-2.5 bg-black/10" />
          <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_0%,rgba(255,255,255,0.25),transparent)]" />
          <div className={`relative flex h-full flex-col justify-between p-4 ${text}`}>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-80">
              NERAAJANS
            </span>
            <div>
              <p className="font-display text-base font-semibold leading-tight">
                {title}
              </p>
              <p className="mt-1 text-[11px] opacity-80">{author}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero({
  headline,
  subheadline,
}: {
  headline: string;
  subheadline: string;
}) {
  return (
    <section className="relative overflow-hidden">
      {/* Soft pastel background blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-float absolute -left-24 top-10 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="animate-float-slow absolute right-0 top-40 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-accent/40 blur-3xl" />
      </div>

      <div className="container-page grid items-center gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Editörlük · Dizgi · Kapak Tasarımı
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl"
          >
            {headline.split(" ").slice(0, -2).join(" ")}{" "}
            <span className="text-gradient">
              {headline.split(" ").slice(-2).join(" ")}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {subheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <ButtonLink href="/teklif-al" size="lg">
              Teklif Al
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/calismalarimiz" size="lg" variant="outline">
              Çalışmalarımızı İncele
            </ButtonLink>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 grid max-w-md grid-cols-3 gap-6"
          >
            {[
              { n: "150+", l: "Tamamlanan Eser" },
              { n: "%100", l: "Yayın Standardı" },
              { n: "10+", l: "Yıllık Deneyim" },
            ].map((s) => (
              <div key={s.l}>
                <dt className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
                  {s.n}
                </dt>
                <dd className="mt-1 text-xs leading-snug text-muted">{s.l}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Visual: floating book mockups */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto h-[420px] w-full max-w-md lg:h-[480px]"
        >
          <div className="absolute inset-6 rounded-[2rem] border border-border bg-surface/40 shadow-soft backdrop-blur" />
          <div className="animate-float-slow">
            <BookCard
              className="left-6 top-10"
              title="Yıldızların Sessizliği"
              author="Roman"
              tone="sage"
              rotate="-8deg"
            />
          </div>
          <div className="animate-float">
            <BookCard
              className="right-4 top-20"
              title="Şehrin Hafızası"
              author="Deneme"
              tone="blue"
              rotate="7deg"
            />
          </div>
          <div className="animate-float-slow">
            <BookCard
              className="bottom-6 left-1/2 -translate-x-1/2"
              title="İnce Ayrıntılar"
              author="Öykü"
              tone="cream"
              rotate="-2deg"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
