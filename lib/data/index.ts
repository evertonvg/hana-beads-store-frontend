import "server-only";

import { env } from "@/lib/env";

import { createMockAddressLookup } from "./mock/address-lookup";
import { createMockAuth } from "./mock/auth";
import { createMockCatalog } from "./mock/catalog";
import { createMockCoupons } from "./mock/coupons";
import { createMockEngagement } from "./mock/engagement";
import { createMockNewsletter } from "./mock/newsletter";
import { createMockOrders } from "./mock/orders";
import { createMockShipping } from "./mock/shipping";
import type { Ports } from "./ports";

let ports: Ports | undefined;

export function getData(): Ports {
  if (env.DATA_SOURCE !== "mock") {
    throw new Error('Unsupported DATA_SOURCE (only "mock" is implemented)');
  }
  ports ??= {
    catalog: createMockCatalog(),
    newsletter: createMockNewsletter(),
    engagement: createMockEngagement(),
    shipping: createMockShipping(),
    coupons: createMockCoupons(),
    auth: createMockAuth(),
    addressLookup: createMockAddressLookup(),
    orders: createMockOrders(),
  };
  return ports;
}
