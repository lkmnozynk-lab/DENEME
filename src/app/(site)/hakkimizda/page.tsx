import type { Metadata } from "next";
import { BadgeCheck, BookOpenCheck, Heart, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { getValueItems } from "@/lib/values";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "NERAAJANS; editörlük, dizgi ve kapak tasarımı alanında uzmanlaşmış, ayrıntıya özen gösteren profesyonel bir yayıncılık ve tasarım ajansıdır.",
  alternates: { canonical: "/hakkimizda" },
};

const process = [
  { step: "01", title: "Değerlendirme", text: "Eserinizi ve beklentilerinizi anlamak için kapsamlı bir ön değerlendirme yaparız." },
  { step: "02", title: "Planlama", text: "İhtiyacınıza uygun, net bir takvim ve iş planı oluştururuz." },
  { step: "03", title: "Üretim", text: "Editörlük, dizgi ve tasarım süreçlerini titizlikle yürütürüz." },
  { step: "04", title: "Teslim", text: "Eseri yayın ve baskı standartlarında, eksiksiz teslim ederiz." },
];

export default async function HakkimizdaPage() {
  const values = await getValueItems();
  return (
    <>
      <PageHeader
        eyebrow="Hakkımızda"
        title="Sözcüklerin arkasındaki titiz işçilik"
        description="NERAAJANS; yazarların ve yayınevlerinin yanında, her metni yayın standartlarına taşıyan disiplinli bir ekiptir."
        breadcrumbs={[{ label: "Ana Sayfa", href: "/" }, { label: "Hakkımızda" }]}
      />

      {/* Story */}
      <section className="container-page py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Hikâyemiz"
              title="Bir kitap, ona gösterilen özen kadar değerlidir"
            />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">
              <p>
                Bizim için bir kitap; yalnızca sayfalardan değil, doğru kurulmuş
                cümlelerden, dengeli bir tipografiden ve eserin ruhunu yansıtan
                bir kapaktan oluşur. Bu bütünlüğü kurmak için her projeye özenle,
                sabırla ve profesyonel bir bakışla yaklaşırız.
              </p>
              <p>
                Editörlük, dizgi ve kapak tasarımı alanlarında uzmanlaşmış
                ekibimizle; bağımsız yazarlardan yayınevlerine kadar farklı
                ölçeklerde projeler üstleniyoruz. Amacımız, yazarın sesini
                korurken eseri en güçlü hâline taşımak.
              </p>
              <p>
                Her aşamada şeffaf bir iletişim kurar, eserinizin haklarının
                korunduğundan ve sürecin sizin kontrolünüzde ilerlediğinden emin
                oluruz.
              </p>
            </div>
            <div className="mt-8">
              <ButtonLink href="/teklif-al">Birlikte Çalışalım</ButtonLink>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {[
              { n: "150+", l: "Tamamlanan Eser", Icon: BookOpenCheck },
              { n: "%100", l: "Yayın Standardı", Icon: BadgeCheck },
              { n: "10+", l: "Yıllık Deneyim", Icon: Sparkles },
              { n: "%98", l: "Memnuniyet", Icon: Heart },
            ].map((s, i) => (
              <Reveal key={s.l} index={i}>
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
                  <s.Icon className="h-6 w-6 text-primary" />
                  <p className="mt-4 font-display text-3xl font-semibold">{s.n}</p>
                  <p className="mt-1 text-sm text-muted">{s.l}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-surface py-16 lg:py-24">
        <div className="container-page">
          <SectionHeading
            align="center"
            eyebrow="Değerlerimiz"
            title="Çalışma biçimimizi belirleyen ilkeler"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.id} index={i}>
                <div className="h-full rounded-2xl border border-border bg-background p-6 shadow-soft transition-transform duration-300 hover:-translate-y-1">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Icon name={v.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {v.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="container-page py-16 lg:py-24">
        <SectionHeading
          eyebrow="Sürecimiz"
          title="Fikirden basıma uzanan net bir yol"
          description="Her projeyi takip edilebilir, şeffaf adımlarla yürütürüz."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {process.map((p, i) => (
            <Reveal key={p.step} index={i}>
              <div className="relative h-full rounded-2xl border border-border bg-surface p-6 shadow-soft">
                <span className="font-display text-4xl font-semibold text-primary/25">
                  {p.step}
                </span>
                <h3 className="mt-3 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
