"use client";

import { useState, type ReactNode } from "react";
import { focusRing } from "@/components/ui/focus";
import { cn } from "@/lib/cn";
import { useLogout } from "./use-logout";

type Props = { className?: string; children: ReactNode };

/** "SAIR": saves the cart, ends the session and goes home (see `useLogout`). */
export function LogoutButton({ className, children }: Props) {
  const logout = useLogout();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => {
        setBusy(true);
        logout().catch(() => setBusy(false));
      }}
      className={cn("cursor-pointer disabled:opacity-60", focusRing, className)}
    >
      {children}
    </button>
  );
}
