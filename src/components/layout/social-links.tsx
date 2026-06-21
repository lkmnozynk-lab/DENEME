import {
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6";
import type { IconType } from "react-icons";
import { cn } from "@/lib/utils";

export type SocialLinks = {
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  xUrl?: string | null;
  linkedinUrl?: string | null;
  youtubeUrl?: string | null;
};

const config: { key: keyof SocialLinks; label: string; Icon: IconType }[] = [
  { key: "instagramUrl", label: "Instagram", Icon: FaInstagram },
  { key: "facebookUrl", label: "Facebook", Icon: FaFacebookF },
  { key: "xUrl", label: "X", Icon: FaXTwitter },
  { key: "linkedinUrl", label: "LinkedIn", Icon: FaLinkedinIn },
  { key: "youtubeUrl", label: "YouTube", Icon: FaYoutube },
];

export function SocialLinks({
  links,
  className,
}: {
  links: SocialLinks;
  className?: string;
}) {
  const available = config.filter(({ key }) => links[key]);
  if (available.length === 0) return null;

  return (
    <ul className={cn("flex items-center gap-2.5", className)}>
      {available.map(({ key, label, Icon }) => (
        <li key={key}>
          <a
            href={links[key] as string}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
          >
            <Icon className="h-[17px] w-[17px]" />
          </a>
        </li>
      ))}
    </ul>
  );
}
