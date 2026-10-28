import "server-only";

import { env } from "@/lib/env";

import { createMockCatalog } from "./mock/catalog";
import { createMockNewsletter } from "./mock/newsletter";
import type { Ports } from "./ports";

let ports: Ports | undefined;

export function getData(): Ports {
  if (env.DATA_SOURCE !== "mock") {
    throw new Error('Unsupported DATA_SOURCE (only "mock" is implemented)');
  }
  ports ??= { catalog: createMockCatalog(), newsletter: createMockNewsletter() };
  return ports;
}
