import { CopyButton } from "@/components/ui/CopyButton";
import { getContact } from "@/lib/contact";

type Props = { text: string };

/** Suggested message to paste, shown only for channels that cannot prefill it. */
export function SuggestedMessage({ text }: Props) {
  if (getContact().acceptsPrefill) return null;
  return (
    <div className="flex flex-col items-start gap-3 border-[3px] border-dashed border-border bg-deep p-4">
      <span className="font-pixel text-[9px] text-text-subtle">MENSAGEM SUGERIDA</span>
      <p className="text-sm text-text">{text}</p>
      <CopyButton value={text} />
    </div>
  );
}
