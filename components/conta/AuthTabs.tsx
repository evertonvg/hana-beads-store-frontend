"use client";

import { Tab, TabGroup, TabList } from "@headlessui/react";

export type AuthTab = "entrar" | "criar";

const TABS: { id: AuthTab; label: string }[] = [
  { id: "entrar", label: "ENTRAR" },
  { id: "criar", label: "CRIAR CONTA" },
];

/** Mobile-only switch between the sign-in and sign-up forms (`aria-selected`, arrow keys). */
export function AuthTabs({ tab, onChange }: { tab: AuthTab; onChange: (tab: AuthTab) => void }) {
  return (
    <TabGroup
      selectedIndex={TABS.findIndex((t) => t.id === tab)}
      onChange={(i) => onChange(TABS[i].id)}
      className="order-1 md:hidden"
    >
      <TabList aria-label="Acesso" className="grid grid-cols-2 border-[3px] border-text">
        {TABS.map((t) => (
          <Tab
            key={t.id}
            className="min-h-[52px] cursor-pointer bg-transparent font-pixel text-[9px] text-text outline-offset-[-6px] outline-cyan focus-visible:outline-[3px] data-[selected]:bg-text data-[selected]:text-bg"
          >
            {t.label}
          </Tab>
        ))}
      </TabList>
    </TabGroup>
  );
}
