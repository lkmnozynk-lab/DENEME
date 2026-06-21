import {
  BookOpenCheck,
  BadgeCheck,
  Workflow,
  ScanSearch,
  Sparkle,
  ShieldCheck,
  Clock,
  Users,
  Heart,
  PenLine,
  Palette,
  AlignLeft,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  bookOpen: BookOpenCheck,
  badge: BadgeCheck,
  workflow: Workflow,
  scan: ScanSearch,
  sparkle: Sparkle,
  shield: ShieldCheck,
  clock: Clock,
  users: Users,
  heart: Heart,
  pen: PenLine,
  palette: Palette,
  align: AlignLeft,
};

/** Options for the admin icon picker. */
export const iconOptions: { value: string; label: string }[] = [
  { value: "bookOpen", label: "Kitap / Kalite" },
  { value: "badge", label: "Rozet / Onay" },
  { value: "workflow", label: "Süreç / Akış" },
  { value: "scan", label: "İnceleme / Detay" },
  { value: "sparkle", label: "Parıltı" },
  { value: "shield", label: "Kalkan / Güven" },
  { value: "clock", label: "Saat / Zaman" },
  { value: "users", label: "Ekip" },
  { value: "heart", label: "Kalp" },
  { value: "pen", label: "Kalem" },
  { value: "palette", label: "Palet / Tasarım" },
  { value: "align", label: "Dizgi" },
];

/** Renders a named icon (safe in both server and client components). */
export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = iconMap[name] ?? BadgeCheck;
  return <Cmp className={className} />;
}
