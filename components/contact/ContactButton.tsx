import { buttonVariants } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { contactLabel, getContact } from "@/lib/contact";
import { cn } from "@/lib/cn";

type Props = {
  kind: "chamar" | "encomendar" | "falar" | "ver";
  /** Prefilled text; only used by channels that accept it. */
  message?: string;
  size?: "md" | "lg";
};

/** Link to the configured contact channel. Name, colors and URL all come from lib/contact. */
export function ContactButton({ kind, message, size = "md" }: Props) {
  const channel = getContact();
  return (
    <a
      href={channel.href(message)}
      target="_blank"
      rel="noopener"
      className={cn(
        buttonVariants({ variant: "primary", size }),
        channel.color === "contact"
          ? "bg-contact text-contact-text"
          : "bg-whatsapp text-whatsapp-text",
      )}
    >
      <Icon name={channel.icon} size={size === "lg" ? 22 : 18} />
      {contactLabel(kind, channel)}
    </a>
  );
}
