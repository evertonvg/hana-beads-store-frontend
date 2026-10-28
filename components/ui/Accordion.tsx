"use client";

import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import type { ReactNode } from "react";
import { Icon } from "./Icon";

type Props = {
  items: { id: string; title: string; content: ReactNode }[];
  /** Id of the item that starts open. */
  defaultOpen?: string;
};

/** Stack of disclosures (`aria-expanded`, `aria-controls`). */
export function Accordion({ items, defaultOpen }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <Disclosure
          key={item.id}
          as="div"
          defaultOpen={item.id === defaultOpen}
          className="border-[3px] border-border bg-surface"
        >
          <DisclosureButton className="group flex min-h-11 w-full cursor-pointer items-center justify-between gap-4 px-4 py-3 text-left font-pixel text-[10px] text-text outline-offset-[-3px] outline-cyan focus-visible:outline-[3px]">
            {item.title}
            <span className="group-data-[open]:rotate-90 motion-safe:transition-transform">
              <Icon name="chevron-right" size={18} />
            </span>
          </DisclosureButton>
          <DisclosurePanel className="px-4 pt-1 pb-4 text-sm text-text-muted">
            {item.content}
          </DisclosurePanel>
        </Disclosure>
      ))}
    </div>
  );
}
