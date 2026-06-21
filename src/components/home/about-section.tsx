import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { getValueItems } from "@/lib/values";

export async function AboutSection() {
  const pillars = await getValueItems();
  return (
    <section id="hakkimizda" className="bg-surface py-20 lg:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow="Hakkımızda"
            title="Sözcüklerin arkasındaki titiz işçilik"
            description="NERAAJANS, editörlük ve yayın tasarımı alanında uzmanlaşmış bir ekiptir. Yazarların ve yayınevlerinin yanında, her metni yayın standartlarına taşıyan disiplinli bir süreçle çalışırız."
          />
          <Reveal index={3}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
              Bizim için bir kitap; yalnızca sayfalardan değil, doğru kurulmuş
              cümlelerden, dengeli bir tipografiden ve eserin ruhunu yansıtan bir
              kapaktan oluşur. Bu bütünlüğü kurmak için her projeye özenle,
              sabırla ve profesyonel bir bakışla yaklaşırız.
            </p>
          </Reveal>
          <Reveal index={4}>
            <div className="mt-8">
              <ButtonLink href="/hakkimizda" variant="outline">
                Hikâyemizi Keşfedin
              </ButtonLink>
            </div>
          </Reveal>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {pillars.map((p, i) => (
            <Reveal key={p.id} index={i}>
              <div className="h-full rounded-2xl border border-border bg-background p-6 shadow-soft transition-transform duration-300 hover:-translate-y-1">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary-soft text-secondary">
                  <Icon name={p.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {p.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
