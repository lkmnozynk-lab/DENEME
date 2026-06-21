# NERAAJANS

Profesyonel yayıncılık ve tasarım ajansı web sitesi — **editörlük, dizgi ve kapak tasarımı**.

> _Kelimelerinize Profesyonel Bir Kimlik Kazandırıyoruz._

Premium, modern ve editöryel bir kimlikle tasarlanmış; Next.js 15 (App Router) üzerine kurulu, üretime hazır bir platform.

---

## Teknoloji

| Katman        | Teknoloji                                  |
| ------------- | ------------------------------------------ |
| Framework     | Next.js 15 (App Router) · React 19 · TS    |
| Stil          | Tailwind CSS 4 · Framer Motion             |
| Veritabanı    | PostgreSQL · Prisma ORM                    |
| Auth          | NextAuth / Auth.js v5 (kurulu, panel sıradaki adımda) |
| E-posta       | Resend (dev'de konsola loglar)             |
| Editör        | Tiptap (blog için, sıradaki adımda)        |
| Deploy        | Vercel uyumlu                              |

## Hızlı Başlangıç

```bash
# 1) Ortam değişkenleri
cp .env.example .env        # değerleri doldurun (AUTH_SECRET üretin)

# 2) PostgreSQL'i başlatın (Docker)
docker compose up -d

# 3) Şemayı veritabanına uygulayın
npm run db:push

# 4) Başlangıç içeriğini ekleyin (admin kullanıcı + örnek içerik)
npm run db:seed

# 5) Geliştirme sunucusu
npm run dev                 # http://localhost:3000
```

`AUTH_SECRET` üretmek için: `openssl rand -base64 32`

## Komutlar

| Komut                | Açıklama                          |
| -------------------- | --------------------------------- |
| `npm run dev`        | Geliştirme sunucusu               |
| `npm run build`      | Üretim derlemesi (prisma generate dahil) |
| `npm run start`      | Üretim sunucusu                   |
| `npm run db:push`    | Şemayı DB'ye uygula               |
| `npm run db:migrate` | Migration oluştur                 |
| `npm run db:seed`    | Başlangıç verisi                  |
| `npm run db:studio`  | Prisma Studio                     |

## Proje Yapısı

```
src/
  app/
    layout.tsx            # Kök layout, fontlar, SEO metadata
    page.tsx              # Ana sayfa (9 bölüm)
    teklif-al/            # Teklif formu (dosya yükleme + e-posta)
    robots.ts, sitemap.ts # SEO
    actions/              # Server Actions (contact, quote)
    icon.svg              # Favicon (logomark)
  components/
    brand/                # Logo
    layout/               # Navbar, Footer, SocialLinks
    home/                 # Ana sayfa bölümleri
    forms/                # Teklif formu
    theme/                # Tema sağlayıcı + toggle
    ui/                   # Button, Reveal, SectionHeading, BookCover
  lib/                    # prisma, settings, content, email,
                          # validation, rate-limit, upload, utils, site-config
prisma/
  schema.prisma          # Tüm modeller
  seed.ts                # Başlangıç verisi
```

## Güvenlik

- Tüm formlarda **sunucu taraflı doğrulama** (Zod) — istemciye asla güvenilmez
- **Rate limiting** (IP başına) + **honeypot** ile bot/brute-force koruması
- Güvenli **dosya yükleme**: MIME allow-list + boyut limiti + **magic-byte** doğrulaması + rastgele dosya adı
- Sıkı **güvenlik başlıkları**: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy (`next.config.ts`)
- Şifreler **bcrypt** ile hashlenir; IP'ler ham değil **hashlenmiş** saklanır
- E-posta gövdelerinde **HTML escape**

## SEO

Metadata API · Open Graph · Twitter Cards · Canonical URL'ler · dinamik `sitemap.xml` · `robots.txt` · Organization JSON-LD · optimize fontlar (next/font) · görsel optimizasyonu (AVIF/WebP).

## Tema

Varsayılan **açık mod**, **koyu mod** toggle ile. Tercih `localStorage`'da (`neraajans-theme`) saklanır; sayfa yüklemesinde titreme (flash) yoktur.

---

## Admin Paneli (`/admin`)

NextAuth (Auth.js v5) ile korunan, içerik yönetimi için tam donanımlı bir panel:

| Bölüm | İşlevler |
| --- | --- |
| **Dashboard** | İçerik & teklif istatistikleri, son teklifler |
| **Sayfalar** | Hero ve Hakkımızda içeriklerini düzenleme |
| **Hizmetler** | Hizmet başlık & açıklamalarını düzenleme |
| **Çalışmalarımız** | Tam CRUD — kapak görseli yükleme, hizmet etiketleri, yayın/öne çıkarma |
| **Blog** | Tam CRUD — **Tiptap** zengin metin editörü, kategori, kapak, SEO alanları |
| **Teklifler** | Liste, detay, durum güncelleme, dosya indirme, silme |
| **Site Ayarları** | Marka, sosyal medya bağlantıları, SEO ayarları |

**Giriş:** `/admin` → otomatik `/admin/login`'e yönlendirir. Seed ile oluşturulan
hesap: `.env` içindeki `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

Güvenlik: middleware ile route koruması, bcrypt şifre doğrulama, JWT oturum,
giriş için rate limiting, tüm mutasyonlarda sunucu doğrulaması + **audit log**,
Tiptap içeriği kaydederken HTML sanitizasyonu, güvenli görsel/dosya yükleme
(MIME + magic-byte). İçerik kaydında ilgili public sayfalar `revalidatePath`
ile güncellenir.

---

## Üretim Altyapısı

Uygulama, ortam değişkenleri ayarlandığında otomatik olarak üretim modunda çalışan
soyutlamalar içerir; hiçbiri ayarlı değilse yerel/dev için zarif şekilde geri düşer:

| Özellik | Üretim (env ayarlıysa) | Varsayılan (dev) |
| --- | --- | --- |
| **Dosya depolama** (`src/lib/storage.ts`) | `BLOB_READ_WRITE_TOKEN` → Vercel Blob | `/public/uploads` (yerel disk) |
| **Rate limiting** (`src/lib/rate-limit.ts`) | `UPSTASH_REDIS_REST_URL/TOKEN` → Upstash Redis (sliding window) | Bellek içi (fixed-window) |
| **HTML sanitizasyon** (`src/lib/sanitize.ts`) | DOMPurify (allowlist) — her ortamda | — |

## Test & CI

- **Playwright E2E** (`e2e/`): ana sayfa, tema toggle, OG/robots/sitemap, sayfa
  gezinmesi, hizmet detay, blog kategori filtresi, admin erişim koruması, teklif
  formu doğrulaması. Üretim derlemesine karşı koşar.
- Çalıştırma: `npm run test:e2e` (önce `npx playwright install chromium`).
- **GitHub Actions** (`.github/workflows/ci.yml`): lint + build ve E2E işleri.

## Yol Haritası (opsiyonel iyileştirmeler)

Spec'in tamamı (public site + admin CMS + güvenlik + SEO + üretim altyapısı + testler)
tamamlandı. İleride değerlendirilebilecekler:

- [ ] Görsel için otomatik boyutlandırma/optimizasyon (sharp) yükleme anında
- [ ] Çok dilli (i18n) destek
- [ ] E-posta şablonlarının zenginleştirilmesi (React Email)
- [ ] Birim testleri (Vitest) ve görsel regresyon
