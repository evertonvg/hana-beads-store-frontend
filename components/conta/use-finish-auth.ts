"use client";

import { useRouter } from "next/navigation";
import { syncCartAction } from "@/app/(conta)/actions";
import { useCartStore } from "@/lib/cart/store";

/**
 * After a successful sign-in/sign-up: sends the guest cart to the server, which merges it with the
 * saved one; the merged cart replaces the local one and then the user is taken to `redirectTo`
 * (already sanitized by the action). A failed sync keeps the local cart and still navigates.
 */
export function useFinishAuth() {
  const router = useRouter();
  return async (redirectTo: string) => {
    try {
      const merged = await syncCartAction(useCartStore.getState().lines);
      if (merged) useCartStore.getState().replace(merged);
    } catch {
      // Offline or server error: the guest cart stays as it is.
    }
    router.push(redirectTo);
  };
}
