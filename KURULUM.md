# NERAAJANS — Kurulum ve Yayınlama Kılavuzu (Teslim Belgesi)

Bu proje bir **Next.js + Prisma + PostgreSQL** uygulamasıdır ve **Vercel** üzerinde
yayınlanmak üzere hazırlanmıştır. Bu belge, projeyi **sıfırdan kendi hesabınıza**
kurup yayına almanız için gereken tüm adımları içerir.

> Tahmini süre: 20–30 dakika. Teknik bilgi: orta düzey (komut satırı kullanımı).

---

## 0) Gerekli hesaplar ve araçlar

Kuruluma başlamadan önce şunlara ihtiyacınız var (hepsi ücretsiz başlar):

- **Node.js 20 veya üzeri** — https://nodejs.org (LTS sürümünü kurun)
- **Git** — https://git-scm.com
- **GitHub hesabı** — https://github.com (kodu burada tutacağız)
- **Vercel hesabı** — https://vercel.com (siteyi burada yayınlayacağız; GitHub ile giriş yapabilirsiniz)
- **Veritabanı:** Vercel içinden **Neon (Postgres)** oluşturacağız — ayrı hesap gerekmez.

Kurulumu doğrulamak için terminalde:
```bash
node -v      # v20+ görmeli
git --version
```

---

## 1) Kodu kendi GitHub hesabınıza koyun

Size teslim edilen proje klasörünü (bu klasör) kendi GitHub deponuza yükleyin.

1. GitHub'da yeni bir **boş repo** oluşturun (örn. `neraajans`). README/`.gitignore` eklemeyin.
2. Proje klasöründe terminal açıp şunları çalıştırın:

```bash
git init
git add .
git commit -m "ilk yükleme"
git branch -M main
git remote add origin https://github.com/KULLANICI-ADINIZ/neraajans.git
git push -u origin main
```

> ⚠️ **`.env` dosyasını ASLA GitHub'a yüklemeyin.** Zaten `.gitignore` ile engelli.
> Gizli bilgiler (şifreler, veritabanı adresi) yalnızca Vercel panelinde durur (Adım 4).

---

## 2) Vercel'de Postgres (Neon) veritabanı oluşturun

1. https://vercel.com → giriş yapın.
2. **Add New → Project** ile birazdan projeyi oluşturacağız; ama önce veritabanı:
   üstteki **Storage** sekmesi → **Create Database** → **Neon (Serverless Postgres)**.
3. Bölge olarak **Frankfurt (fra1)** seçin → **Create**.
4. Oluşunca açık bırakın; bir sonraki adımda projeye bağlayacağız.

---

## 3) Vercel'de projeyi oluşturun ve repoyu bağlayın

1. Vercel → **Add New → Project**.
2. GitHub'dan az önce oluşturduğunuz **neraajans** reposunu seçin → **Import**.
3. Framework otomatik **Next.js** algılanır. Henüz **Deploy'a basmayın** —
   önce ortam değişkenlerini girmemiz lazım (Adım 4).
4. Oluşturduğunuz **Neon veritabanını bu projeye bağlayın:**
   Proje → **Storage** sekmesi → veritabanını seçin → **Connect Project**.
   Bu işlem `DATABASE_URL` ve ilgili değişkenleri otomatik ekler.

---

## 4) Ortam değişkenlerini (Environment Variables) girin

Vercel → projeniz → **Settings → Environment Variables**. Aşağıdakileri
**Production** (ve isterseniz Preview) ortamı için ekleyin:

| Değişken | Değer | Açıklama |
|---|---|---|
| `AUTH_SECRET` | (aşağıda üretin) | Oturum güvenliği için zorunlu |
| `AUTH_URL` | `https://SITE-ADRESINIZ.vercel.app` | Sitenizin tam adresi |
| `NEXT_PUBLIC_SITE_URL` | `https://SITE-ADRESINIZ.vercel.app` | Aynı adres |
| `ADMIN_EMAIL` | `admin@neraajans.com` | Yönetici giriş e-postası |
| `ADMIN_PASSWORD` | (güçlü bir şifre belirleyin) | Yönetici giriş şifresi |
| `ADMIN_NAME` | `NERAAJANS Admin` | Yönetici adı |

- `DATABASE_URL` **zaten** Adım 3'te Neon bağlanınca otomatik gelmiştir; elle eklemeyin.
- **`AUTH_SECRET` üretmek için** terminalde şunu çalıştırın ve çıkan değeri yapıştırın:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  ```
- `SITE-ADRESINIZ` kısmını, Vercel projenizin gerçek adresiyle değiştirin
  (ilk deploy'dan sonra Vercel size verir; deploy sonrası bu iki değeri güncelleyin).

---

## 5) Veritabanı tablolarını oluşturun ve yönetici hesabını ekleyin

Veritabanı henüz **boştur**. Tabloları oluşturup ilk yönetici hesabını eklemek için,
**kendi bilgisayarınızda** şunları yapın:

1. Neon bağlantı adresini alın: Vercel → projeniz → **Storage** → veritabanı →
   **`.env.local` / Connection String** bölümünden `DATABASE_URL` değerini kopyalayın.
   (Tercihen "**Direct connection**" / pooler'sız olanı.)

2. Proje klasöründe terminal açıp:

```bash
npm install

# Aşağıdaki tırnak içine kopyaladığınız Neon adresini yapıştırın:
# (Windows PowerShell)
$env:DATABASE_URL="postgresql://...neon...adresi..."
$env:ADMIN_EMAIL="admin@neraajans.com"
$env:ADMIN_PASSWORD="belirlediğiniz-şifre"

# (Mac/Linux ise:)
# export DATABASE_URL="postgresql://...neon...adresi..."
# export ADMIN_EMAIL="admin@neraajans.com"
# export ADMIN_PASSWORD="belirlediğiniz-şifre"

npx prisma db push     # tabloları oluşturur
npm run db:seed        # yönetici hesabını + örnek içerikleri ekler
```

Başarılıysa `✓ Admin user: admin@neraajans.com` yazısını görürsünüz.

> **Not:** `ADMIN_PASSWORD` değerini, Adım 4'te Vercel'e girdiğiniz şifreyle **aynı** tutun.

---

## 6) Yayına alın (Deploy)

Vercel → projeniz → **Deployments** → **Redeploy** (veya GitHub'a herhangi bir push).
Birkaç dakika içinde siteniz `https://SITE-ADRESINIZ.vercel.app` adresinde yayında olur.

Yönetici paneline giriş:
```
Adres : https://SITE-ADRESINIZ.vercel.app/admin/login
E-posta: admin@neraajans.com
Şifre  : (Adım 4/5'te belirlediğiniz şifre)
```

---

## Bundan sonra içerik/dosya nasıl güncellenir?

- **Kod/tasarım değişikliği:** Dosyayı düzenleyip GitHub'a `git push` edin → Vercel
  otomatik yayınlar. Ya da GitHub web arayüzünde dosyanın **✏️ kalem** ikonuyla düzenleyip
  **Commit** edin.
- **Şifre/ayar değişikliği:** Vercel → **Settings → Environment Variables** → değiştirin →
  **Deployments → Redeploy**.
- **Site içeriği (yazılar, hizmetler, görseller):** Yayındaki **/admin** panelinden,
  kod değiştirmeden yönetilir.

---

## ⚠️ Önemli kurallar (bozmayın)

1. **`prisma/schema.prisma`** içindeki `provider = "postgresql"` satırını değiştirmeyin.
   (SQLite Vercel'de çalışmaz.)
2. **`.env` dosyasını GitHub'a yüklemeyin.** Gizli bilgiler yalnızca Vercel'de durmalı.
3. `node_modules` ve `.next` klasörlerini GitHub'a göndermeyin (zaten `.gitignore`'da).

---

## Teknik özet (geliştiriciler için)

- **Framework:** Next.js 15 (App Router), React 19
- **ORM/DB:** Prisma 6 + PostgreSQL (Neon)
- **Kimlik doğrulama:** Auth.js (NextAuth v5), Credentials provider, JWT session
- **Yerel geliştirme:** `npm run dev` (http://localhost:3000)
- **Veritabanı komutları:** `npm run db:push`, `npm run db:seed`, `npm run db:studio`
- Ortam değişkenleri şablonu: `.env.example`
