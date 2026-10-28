"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: string;
  label?: string;
  copiedLabel?: string;
  resetMs?: number;
};

/** Copies `value` to the clipboard. A clipboard failure still swaps the label (as in the design). */
export function CopyButton({
  value,
  label = "COPIAR",
  copiedLabel = "COPIADO ✓",
  resetMs = 2500,
}: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard unavailable or denied: fall through, the label still changes.
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), resetMs);
  }

  return (
    <button
      type="button"
      aria-live="polite"
      onClick={() => void copy()}
      className="min-h-11 cursor-pointer border-[3px] border-text px-3.5 py-3 font-pixel text-[9px] text-text outline-offset-2 outline-cyan focus-visible:outline-[3px]"
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
