import { prisma } from "@/lib/prisma";

export type ValueItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

const FALLBACK: ValueItem[] = [
  {
    id: "fb-1",
    title: "Yayın Kalitesi",
    description:
      "Her eseri profesyonel yayıncılığın gözettiği içerik ve baskı standartlarına göre hazırlarız.",
    icon: "bookOpen",
  },
  {
    id: "fb-2",
    title: "Editöryel Mükemmellik",
    description:
      "Metnin sesini koruyarak dilini güçlendiren, deneyimli bir ekiple çalışırız.",
    icon: "badge",
  },
  {
    id: "fb-3",
    title: "Profesyonel Süreç",
    description: "Şeffaf, takip edilebilir ve planlı bir iş akışı yürütürüz.",
    icon: "workflow",
  },
  {
    id: "fb-4",
    title: "Ayrıntıya Özen",
    description:
      "İmla, tipografi ve görsel uyumda en küçük ayrıntıyı bile gözden kaçırmayız.",
    icon: "scan",
  },
];

/** Editable values/principles. Falls back to defaults before any admin edit. */
export async function getValueItems(): Promise<ValueItem[]> {
  try {
    const items = await prisma.valueItem.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: { id: true, title: true, description: true, icon: true },
    });
    return items.length > 0 ? items : FALLBACK;
  } catch {
    return FALLBACK;
  }
}
