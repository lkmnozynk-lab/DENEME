import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { QuoteForm } from "@/components/forms/quote-form";

export const metadata: Metadata = {
  title: "Teklif Al",
  description:
    "Editörlük, dizgi ve kapak tasarımı projeniz için ücretsiz teklif alın. Eserinizi paylaşın, size özel bir fiyat teklifi hazırlayalım.",
  alternates: { canonical: "/teklif-al" },
};

const steps = [
  "Formu doldurup eserinizle ilgili bilgileri paylaşın.",
  "Ekibimiz talebinizi inceleyip size özel bir teklif hazırlasın.",
  "Onayınızın ardından çalışmaya hemen başlayalım.",
];

export default function TeklifAlPage() {
  return (
    <div className="container-page py-16 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Teklif Al
          </span>
          <h1 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl">
            Projeniz için ücretsiz teklif alın
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Eserinizin türünü, kapsamını ve beklentilerinizi bizimle paylaşın.
            İhtiyacınıza uygun, şeffaf bir teklif hazırlayalım.
          </p>

          <ul className="mt-8 space-y-4">
            {steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm leading-relaxed text-foreground/90">
                  {step}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <QuoteForm />
      </div>
    </div>
  );
}
