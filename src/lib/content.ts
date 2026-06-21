import { prisma } from "@/lib/prisma";
import { parseServices } from "@/lib/utils";

export type WorkCard = {
  slug: string;
  title: string;
  description: string;
  coverImage: string | null;
  services: string[];
  year: number | null;
};

export type WorkDetail = WorkCard & {
  client: string | null;
  images: { url: string; alt: string | null }[];
};

export type PostCard = {
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  category: string | null;
  categorySlug: string | null;
  publishedAt: Date | null;
  readingMinutes: number;
};

export type PostDetail = PostCard & { content: string };

// ───────────────────── Fallback content ─────────────────────
// Used until the admin adds real records / before the DB exists.

const SAMPLE_WORKS: WorkDetail[] = [
  {
    slug: "yildizlarin-sessizligi",
    title: "Yıldızların Sessizliği",
    description:
      "Çağdaş bir romanın editörlük, dizgi ve kapak tasarımı süreçlerinin tamamı tarafımızca üstlenildi.",
    coverImage: null,
    services: ["EDITORLUK", "DIZGI", "KAPAK_TASARIMI"],
    year: 2025,
    client: "Bağımsız Yazar",
    images: [],
  },
  {
    slug: "sehrin-hafizasi",
    title: "Şehrin Hafızası",
    description:
      "Deneme türündeki bu eserde akıcılığı koruyan bir redaksiyon ve sade bir sayfa düzeni kurguladık.",
    coverImage: null,
    services: ["EDITORLUK", "DIZGI"],
    year: 2024,
    client: "Mavi Yayınevi",
    images: [],
  },
  {
    slug: "ince-ayrintilar",
    title: "İnce Ayrıntılar",
    description:
      "Öykü kitabının ruhunu yansıtan, minimalist ve dikkat çekici bir kapak tasarımı hazırladık.",
    coverImage: null,
    services: ["KAPAK_TASARIMI"],
    year: 2024,
    client: "Bağımsız Yazar",
    images: [],
  },
  {
    slug: "zamanin-otesinde",
    title: "Zamanın Ötesinde",
    description:
      "Bilim kurgu romanı için kapsamlı bir editörlük ve özgün bir kapak tasarımı gerçekleştirdik.",
    coverImage: null,
    services: ["EDITORLUK", "KAPAK_TASARIMI"],
    year: 2023,
    client: "Ufuk Kitap",
    images: [],
  },
  {
    slug: "sessiz-bahce",
    title: "Sessiz Bahçe",
    description:
      "Şiir kitabının inceliğini yansıtan özenli bir dizgi ve zarif bir tipografi düzeni oluşturduk.",
    coverImage: null,
    services: ["DIZGI"],
    year: 2023,
    client: "Bağımsız Yazar",
    images: [],
  },
  {
    slug: "kayip-mektuplar",
    title: "Kayıp Mektuplar",
    description:
      "Tarihî romanın atmosferini güçlendiren editörlük, dizgi ve kapak çalışmasını birlikte yürüttük.",
    coverImage: null,
    services: ["EDITORLUK", "DIZGI", "KAPAK_TASARIMI"],
    year: 2022,
    client: "Anadolu Yayıncılık",
    images: [],
  },
];

const SAMPLE_POSTS: PostDetail[] = [
  {
    slug: "iyi-bir-editor-neye-dikkat-eder",
    title: "İyi Bir Editör Metinde Neye Dikkat Eder?",
    excerpt:
      "Redaksiyon ile editörlük arasındaki farktan, bir metni yayına hazırlarken izlenen adımlara kadar.",
    coverImage: null,
    category: "Editörlük",
    categorySlug: "editorluk",
    publishedAt: new Date("2026-05-20"),
    readingMinutes: 6,
    content: `
      <p>Bir metnin yayına hazırlanması, yalnızca yazım hatalarının düzeltilmesinden çok daha fazlasıdır. İyi bir editör; anlatının tutarlılığını, üslubun bütünlüğünü ve okurun deneyimini bir bütün olarak değerlendirir.</p>
      <h2>Redaksiyon ve editörlük aynı şey mi?</h2>
      <p>Redaksiyon dil, imla ve noktalama düzeyinde çalışırken; editörlük metnin yapısı, akışı ve anlatım gücüyle ilgilenir. Profesyonel bir süreçte her iki katman da titizlikle ele alınır.</p>
      <h2>Editörün gözettiği başlıca unsurlar</h2>
      <ul>
        <li>Anlatımın akıcılığı ve tutarlılığı</li>
        <li>Dil ve imla doğruluğu</li>
        <li>Karakter ve olay örgüsünde süreklilik</li>
        <li>Yayın standartlarına uygunluk</li>
      </ul>
      <p>Sonuçta amaç, yazarın sesini korurken eseri en güçlü hâline taşımaktır.</p>
    `,
  },
  {
    slug: "dizgide-okunabilirligin-sirri",
    title: "Dizgide Okunabilirliğin Sırrı: Tipografi",
    excerpt:
      "Satır aralığı, yazı tipi seçimi ve sayfa kenar boşluklarının okuma deneyimine etkisi.",
    coverImage: null,
    category: "Dizgi",
    categorySlug: "dizgi",
    publishedAt: new Date("2026-04-28"),
    readingMinutes: 5,
    content: `
      <p>Dizgi, bir kitabın görünmeyen mimarisidir. Okur farkında olmasa da; satır aralığı, yazı tipi ve kenar boşlukları okuma deneyimini doğrudan belirler.</p>
      <h2>Doğru yazı tipi</h2>
      <p>Uzun metinlerde gözü yormayan, tırnaklı (serif) yazı tipleri genellikle tercih edilir. Yazı tipi boyutu ve satır uzunluğu dengeli kurgulanmalıdır.</p>
      <h2>Beyaz alanın gücü</h2>
      <p>Yeterli kenar boşluğu ve satır aralığı, metne nefes aldırır ve okumayı kolaylaştırır.</p>
    `,
  },
  {
    slug: "kapak-tasariminda-ilk-izlenim",
    title: "Kapak Tasarımında İlk İzlenim Neden Önemli?",
    excerpt:
      "Bir kitabın raftaki ilk üç saniyesini belirleyen tasarım ilkeleri ve renk psikolojisi.",
    coverImage: null,
    category: "Kapak Tasarımı",
    categorySlug: "kapak-tasarimi",
    publishedAt: new Date("2026-04-10"),
    readingMinutes: 4,
    content: `
      <p>Bir kitabın kapağı, okurla kurulan ilk temastır. Raftaki ya da ekrandaki ilk birkaç saniye, eserin keşfedilip keşfedilmeyeceğini belirleyebilir.</p>
      <h2>Eserin ruhunu yansıtmak</h2>
      <p>İyi bir kapak; türü, atmosferi ve duyguyu tek bir görselde okura aktarır.</p>
      <h2>Renk ve tipografi uyumu</h2>
      <p>Renk seçimi okurda belirli bir his uyandırır; başlık tipografisi ise okunabilirlik ve karakter dengesini kurar.</p>
    `,
  },
  {
    slug: "kitabinizi-yayina-hazirlama-rehberi",
    title: "Kitabınızı Yayına Hazırlama Rehberi",
    excerpt:
      "Taslaktan basıma: bir eseri profesyonelce yayına hazırlamanın adım adım yol haritası.",
    coverImage: null,
    category: "Yayıncılık Rehberi",
    categorySlug: "yayincilik-rehberi",
    publishedAt: new Date("2026-03-15"),
    readingMinutes: 7,
    content: `
      <p>Bir eseri yayına hazırlamak, planlı bir süreç gerektirir. İşte temel adımlar.</p>
      <h2>1. Editöryel değerlendirme</h2>
      <p>Metnin güçlü ve geliştirilmeye açık yönleri belirlenir.</p>
      <h2>2. Redaksiyon ve düzelti</h2>
      <p>Dil, imla ve anlatım düzeyinde titiz bir çalışma yapılır.</p>
      <h2>3. Dizgi</h2>
      <p>Metin, yayın standartlarına uygun bir sayfa düzenine kavuşturulur.</p>
      <h2>4. Kapak tasarımı</h2>
      <p>Eserin kimliğini yansıtan özgün bir kapak hazırlanır.</p>
    `,
  },
];

// ───────────────────── Works ─────────────────────

export async function getFeaturedWorks(limit = 3): Promise<WorkCard[]> {
  try {
    const works = await prisma.work.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
      take: limit,
      select: {
        slug: true,
        title: true,
        description: true,
        coverImage: true,
        services: true,
        year: true,
      },
    });
    if (works.length === 0) return SAMPLE_WORKS.slice(0, limit);
    return works.map((w) => ({ ...w, services: parseServices(w.services) }));
  } catch {
    return SAMPLE_WORKS.slice(0, limit);
  }
}

export async function getAllWorks(): Promise<WorkCard[]> {
  try {
    const works = await prisma.work.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
      select: {
        slug: true,
        title: true,
        description: true,
        coverImage: true,
        services: true,
        year: true,
      },
    });
    if (works.length === 0) return SAMPLE_WORKS;
    return works.map((w) => ({ ...w, services: parseServices(w.services) }));
  } catch {
    return SAMPLE_WORKS;
  }
}

export async function getWorkBySlug(slug: string): Promise<WorkDetail | null> {
  try {
    const work = await prisma.work.findFirst({
      where: { slug, published: true },
      include: {
        images: { orderBy: { order: "asc" }, select: { url: true, alt: true } },
      },
    });
    if (work) {
      return {
        slug: work.slug,
        title: work.title,
        description: work.description,
        coverImage: work.coverImage,
        services: parseServices(work.services),
        year: work.year,
        client: work.client,
        images: work.images,
      };
    }
  } catch {
    // fall through to sample
  }
  return SAMPLE_WORKS.find((w) => w.slug === slug) ?? null;
}

export async function getWorkSlugs(): Promise<string[]> {
  try {
    const works = await prisma.work.findMany({
      where: { published: true },
      select: { slug: true },
    });
    if (works.length > 0) return works.map((w) => w.slug);
  } catch {
    // fall through
  }
  return SAMPLE_WORKS.map((w) => w.slug);
}

// ───────────────────── Blog ─────────────────────

function toCard(p: PostDetail): PostCard {
  const { content: _content, ...card } = p;
  return card;
}

export async function getRecentPosts(limit = 3): Promise<PostCard[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: limit,
      select: postCardSelect,
    });
    if (posts.length === 0) return SAMPLE_POSTS.slice(0, limit).map(toCard);
    return posts.map(mapPost);
  } catch {
    return SAMPLE_POSTS.slice(0, limit).map(toCard);
  }
}

export async function getAllPosts(categorySlug?: string): Promise<PostCard[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      },
      orderBy: { publishedAt: "desc" },
      select: postCardSelect,
    });
    if (posts.length === 0 && !categorySlug)
      return SAMPLE_POSTS.map(toCard);
    if (posts.length === 0 && categorySlug)
      return SAMPLE_POSTS.filter((p) => p.categorySlug === categorySlug).map(toCard);
    return posts.map(mapPost);
  } catch {
    return categorySlug
      ? SAMPLE_POSTS.filter((p) => p.categorySlug === categorySlug).map(toCard)
      : SAMPLE_POSTS.map(toCard);
  }
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  try {
    const post = await prisma.blogPost.findFirst({
      where: { slug, published: true },
      select: { ...postCardSelect, content: true },
    });
    if (post) return { ...mapPost(post), content: post.content };
  } catch {
    // fall through
  }
  return SAMPLE_POSTS.find((p) => p.slug === slug) ?? null;
}

export async function getPostSlugs(): Promise<string[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true },
    });
    if (posts.length > 0) return posts.map((p) => p.slug);
  } catch {
    // fall through
  }
  return SAMPLE_POSTS.map((p) => p.slug);
}

// ── Prisma select + mapper shared by blog queries ──
const postCardSelect = {
  slug: true,
  title: true,
  excerpt: true,
  coverImage: true,
  readingMinutes: true,
  publishedAt: true,
  category: { select: { name: true, slug: true } },
} as const;

type PrismaPost = {
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  readingMinutes: number;
  publishedAt: Date | null;
  category: { name: string; slug: string } | null;
};

function mapPost(p: PrismaPost): PostCard {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    coverImage: p.coverImage,
    category: p.category?.name ?? null,
    categorySlug: p.category?.slug ?? null,
    publishedAt: p.publishedAt,
    readingMinutes: p.readingMinutes,
  };
}
