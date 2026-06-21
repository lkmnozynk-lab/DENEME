import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { serviceDetails } from "../src/lib/services-data";

const prisma = new PrismaClient();

async function main() {
  // ── Admin user ──
  const email = process.env.ADMIN_EMAIL ?? "admin@neraajans.com";
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe!2026";
  const name = process.env.ADMIN_NAME ?? "NERAAJANS Admin";
  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { name, role: "ADMIN" },
    create: { email, name, passwordHash, role: "ADMIN" },
  });
  console.log(`✓ Admin user: ${admin.email}`);

  // ── Site settings (singleton) ──
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      heroSubheadline:
        "Editörlük, dizgi ve kapak tasarımı hizmetlerimizle eserlerinizi yayın standartlarına uygun şekilde hazırlıyor, okuyucularınızla buluşmaya hazır hale getiriyoruz.",
      aboutTitle: "Sözcüklerin arkasındaki titiz işçilik",
      aboutContent:
        "NERAAJANS, editörlük ve yayın tasarımı alanında uzmanlaşmış bir ekiple çalışır. Her projeye, metnin kendi sesini koruyarak yayın standartlarına taşıyan disiplinli bir süreçle yaklaşırız.",
      internalEmail: process.env.CONTACT_NOTIFICATION_EMAIL ?? "info@neraajans.com",
    },
  });
  console.log("✓ Site settings");

  // ── SEO settings (singleton) ──
  await prisma.sEOSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      defaultDescription:
        "NERAAJANS; editörlük, dizgi ve kapak tasarımı hizmetleriyle eserlerinizi yayın standartlarına uygun şekilde hazırlayan profesyonel yayıncılık ve tasarım ajansıdır.",
      keywords: "editörlük, redaksiyon, dizgi, kapak tasarımı, yayıncılık",
    },
  });
  console.log("✓ SEO settings");

  // ── Service pages ──
  const servicePages = [
    {
      key: "EDITORLUK",
      title: "Editörlük",
      slug: "editorluk",
      order: 1,
      shortDescription:
        "Metninizi profesyonel editörlük ve redaksiyon süreçlerinden geçirerek anlatım gücünü artırıyor, dil ve imla hatalarını gideriyor, eserinizi yayın standartlarına uygun hâle getiriyoruz.",
    },
    {
      key: "DIZGI",
      title: "Dizgi",
      slug: "dizgi",
      order: 2,
      shortDescription:
        "Kitabınızı profesyonel yayıncılık standartlarına uygun şekilde diziyor, okunabilirliği ve görsel düzeni en üst seviyeye taşıyoruz.",
    },
    {
      key: "KAPAK_TASARIMI",
      title: "Kapak Tasarımı",
      slug: "kapak-tasarimi",
      order: 3,
      shortDescription:
        "Eserinizin ruhunu yansıtan, dikkat çekici ve özgün kapak tasarımları hazırlayarak kitabınızı okuyucuyla buluşturuyoruz.",
    },
  ];
  for (const sp of servicePages) {
    const detail = serviceDetails.find((d) => d.key === sp.key);
    const rich = detail
      ? {
          tagline: detail.tagline,
          intro: detail.intro,
          features: JSON.stringify(detail.features),
          process: JSON.stringify(detail.process),
          faqs: JSON.stringify(detail.faqs),
        }
      : {};
    await prisma.servicePage.upsert({
      where: { key: sp.key },
      // Don't overwrite admin-edited rich content on re-seed.
      update: { title: sp.title, shortDescription: sp.shortDescription },
      create: { ...sp, ...rich },
    });
  }
  console.log(`✓ ${servicePages.length} service pages`);

  // ── Why-NERAAJANS reasons ──
  const whyReasons = [
    {
      title: "Yayın Standartlarında Kalite",
      description:
        "Her eser, profesyonel yayıncılığın gerektirdiği içerik ve baskı standartlarına uygun şekilde hazırlanır.",
      icon: "sparkle",
    },
    {
      title: "Uzman ve Deneyimli Ekip",
      description:
        "Editörlük, dizgi ve tasarım alanlarında uzmanlaşmış, alanına hâkim profesyonellerle çalışırsınız.",
      icon: "users",
    },
    {
      title: "Şeffaf ve Güvenilir Süreç",
      description:
        "Projenizin her aşamasından haberdar olur, eserinizin haklarının korunduğundan emin olursunuz.",
      icon: "shield",
    },
    {
      title: "Zamanında Teslim",
      description:
        "Belirlenen takvime sadık kalır, yayın planınızı aksatmadan eserinizi teslim ederiz.",
      icon: "clock",
    },
  ];
  if ((await prisma.whyReason.count()) === 0) {
    for (const [i, r] of whyReasons.entries()) {
      await prisma.whyReason.create({ data: { ...r, order: i } });
    }
    console.log(`✓ ${whyReasons.length} why reasons`);
  }

  // ── Blog categories ──
  const categories = [
    { name: "Editörlük", slug: "editorluk" },
    { name: "Dizgi", slug: "dizgi" },
    { name: "Kapak Tasarımı", slug: "kapak-tasarimi" },
    { name: "Yayıncılık Rehberi", slug: "yayincilik-rehberi" },
  ];
  for (const c of categories) {
    await prisma.blogCategory.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: c,
    });
  }
  console.log(`✓ ${categories.length} blog categories`);

  // ── Değerlerimiz / İlkeler ──
  const values = [
    { title: "Yayın Kalitesi", icon: "bookOpen", order: 0, description: "Her eseri profesyonel yayıncılığın gözettiği içerik ve baskı standartlarına göre hazırlarız." },
    { title: "Editöryel Mükemmellik", icon: "badge", order: 1, description: "Metnin sesini koruyarak dilini güçlendiren, deneyimli bir ekiple çalışırız." },
    { title: "Profesyonel Süreç", icon: "workflow", order: 2, description: "Şeffaf, takip edilebilir ve planlı bir iş akışı yürütürüz." },
    { title: "Ayrıntıya Özen", icon: "scan", order: 3, description: "İmla, tipografi ve görsel uyumda en küçük ayrıntıyı bile gözden kaçırmayız." },
  ];
  const existingValues = await prisma.valueItem.count();
  if (existingValues === 0) {
    for (const v of values) await prisma.valueItem.create({ data: v });
    console.log(`✓ ${values.length} değer/ilke`);
  } else {
    console.log("✓ değerler zaten mevcut");
  }

  // ── Sample work ──
  const editorlukCat = await prisma.blogCategory.findUnique({
    where: { slug: "editorluk" },
  });

  await prisma.work.upsert({
    where: { slug: "yildizlarin-sessizligi" },
    update: {},
    create: {
      slug: "yildizlarin-sessizligi",
      title: "Yıldızların Sessizliği",
      description:
        "Çağdaş bir romanın editörlük, dizgi ve kapak tasarımı süreçlerinin tamamı tarafımızca üstlenildi. Metnin akıcılığını koruyarak yayın standartlarına taşıdık.",
      services: JSON.stringify(["EDITORLUK", "DIZGI", "KAPAK_TASARIMI"]),
      year: 2025,
      featured: true,
      published: true,
      order: 1,
    },
  });
  console.log("✓ Sample work");

  // ── Sample blog post ──
  await prisma.blogPost.upsert({
    where: { slug: "iyi-bir-editor-neye-dikkat-eder" },
    update: {},
    create: {
      slug: "iyi-bir-editor-neye-dikkat-eder",
      title: "İyi Bir Editör Metinde Neye Dikkat Eder?",
      excerpt:
        "Redaksiyon ile editörlük arasındaki farktan, bir metni yayına hazırlarken izlenen adımlara kadar.",
      content:
        "<p>Bir metnin yayına hazırlanması, yalnızca yazım hatalarının düzeltilmesinden çok daha fazlasıdır. İyi bir editör; anlatının tutarlılığını, üslubun bütünlüğünü ve okurun deneyimini bir bütün olarak değerlendirir.</p>",
      published: true,
      publishedAt: new Date("2026-05-20"),
      readingMinutes: 6,
      categoryId: editorlukCat?.id,
      authorId: admin.id,
    },
  });
  console.log("✓ Sample blog post");
}

main()
  .then(() => console.log("\n🌱 Seed complete."))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
