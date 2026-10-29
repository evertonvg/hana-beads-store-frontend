"use client";

import { useRouter } from "next/navigation";
import { logoutAction } from "@/app/(conta)/actions";
import { useCartStore } from "@/lib/cart/store";

/** Sign-out: ends the session, empties the local cart (owner included) and refreshes the header. */
export function useLogout() {
  const router = useRouter();
  return async () => {
    await logoutAction();
    useCartStore.getState().release();
    router.push("/");
    router.refresh();
  };
}
