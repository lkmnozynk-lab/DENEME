import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { getWhyReasons } from "@/lib/why";

export async function WhySection() {
  const reasons = await getWhyReasons();
  return (
    <section className="relative overflow-hidden bg-surface py-20 lg:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="container-page">
        <SectionHeading
          align="center"
          eyebrow="Neden NERAAJANS"
          title="Eserinizi neden bize emanet etmelisiniz?"
          description="Çünkü bir kitabın değeri, ona gösterilen özende saklıdır."
        />

        <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <Reveal key={r.id} index={i} className="text-center">
              <div className="flex flex-col items-center">
                <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-background text-primary shadow-soft">
                  <Icon name={r.icon} className="h-7 w-7" />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                </span>
                <h3 className="mt-5 text-lg font-semibold">{r.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
                  {r.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
