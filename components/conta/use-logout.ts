"use client";

import { useRouter } from "next/navigation";
import { logoutAction, saveCartAction } from "@/app/(conta)/actions";
import { useCartStore } from "@/lib/cart/store";

/**
 * Sign-out: saves the cart first (edits since the last debounced save would be lost), ends the
 * session, then empties the local cart (owner included) and refreshes the header. If the save
 * fails nothing is cleared and the error propagates.
 */
export function useLogout() {
  const router = useRouter();
  return async () => {
    await saveCartAction(useCartStore.getState().lines);
    await logoutAction();
    useCartStore.getState().release();
    router.push("/");
    router.refresh();
  };
}
