import { prisma } from "@/lib/prisma";

export type WhyReason = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

const FALLBACK: WhyReason[] = [
  {
    id: "fb-1",
    title: "Yayın Standartlarında Kalite",
    description:
      "Her eser, profesyonel yayıncılığın gerektirdiği içerik ve baskı standartlarına uygun şekilde hazırlanır.",
    icon: "sparkle",
  },
  {
    id: "fb-2",
    title: "Uzman ve Deneyimli Ekip",
    description:
      "Editörlük, dizgi ve tasarım alanlarında uzmanlaşmış, alanına hâkim profesyonellerle çalışırsınız.",
    icon: "users",
  },
  {
    id: "fb-3",
    title: "Şeffaf ve Güvenilir Süreç",
    description:
      "Projenizin her aşamasından haberdar olur, eserinizin haklarının korunduğundan emin olursunuz.",
    icon: "shield",
  },
  {
    id: "fb-4",
    title: "Zamanında Teslim",
    description:
      "Belirlenen takvime sadık kalır, yayın planınızı aksatmadan eserinizi teslim ederiz.",
    icon: "clock",
  },
];

/** Editable "Neden NERAAJANS" reasons. Falls back to defaults before any edit. */
export async function getWhyReasons(): Promise<WhyReason[]> {
  try {
    const items = await prisma.whyReason.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: { id: true, title: true, description: true, icon: true },
    });
    return items.length > 0 ? items : FALLBACK;
  } catch {
    return FALLBACK;
  }
}
