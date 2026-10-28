"use client";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import type { ReactNode } from "react";
import { pillClass } from "./pill";

type Props = {
  label: string;
  tabs: { id: string; label: string }[];
  selected: string;
  onChange: (id: string) => void;
  /** Optional content per tab id; when given, renders the tab panels. */
  panels?: Record<string, ReactNode>;
};

/** Pill-styled tabs on Headless UI Tabs (`aria-selected`, arrow keys). */
export function PillTabs({ label, tabs, selected, onChange, panels }: Props) {
  const index = Math.max(
    0,
    tabs.findIndex((t) => t.id === selected),
  );
  return (
    <TabGroup selectedIndex={index} onChange={(i) => onChange(tabs[i].id)}>
      <TabList aria-label={label} className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Tab key={t.id} className={({ selected: on }) => pillClass(on)}>
            {t.label}
          </Tab>
        ))}
      </TabList>
      {panels ? (
        <TabPanels className="mt-6">
          {tabs.map((t) => (
            <TabPanel key={t.id}>{panels[t.id]}</TabPanel>
          ))}
        </TabPanels>
      ) : null}
    </TabGroup>
  );
}
