"use client";

import { useEffect } from "react";
import { saveCartAction } from "@/app/(conta)/actions";
import { startCartSaver } from "@/lib/cart/saver";

/** Mounted once (in Providers): keeps the saved cart of a signed-in user up to date. */
export function CartSaver() {
  useEffect(() => startCartSaver(saveCartAction), []);
  return null;
}
