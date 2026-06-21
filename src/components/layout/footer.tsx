import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { SocialLinks } from "@/components/layout/social-links";
import { mainNav, services } from "@/lib/site-config";
import { getSiteSettings } from "@/lib/settings";

export async function Footer() {
  const settings = await getSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            {settings.slogan}
          </p>
          <div className="mt-6">
            <SocialLinks links={settings} />
          </div>
        </div>

        <div className="lg:col-span-3 lg:col-start-7">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted">
            Menü
          </h3>
          <ul className="mt-4 space-y-3">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-foreground/80 transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted">
            Hizmetler
          </h3>
          <ul className="mt-4 space-y-3">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/hizmetler/${s.slug}`}
                  className="text-sm text-foreground/80 transition-colors hover:text-primary"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-sm text-muted sm:flex-row">
          <p>
            © {year} {settings.brandName}. Tüm hakları saklıdır.
          </p>
          <p className="font-display italic">
            Kelimelerinize değer katıyoruz.
          </p>
        </div>
      </div>
    </footer>
  );
}
