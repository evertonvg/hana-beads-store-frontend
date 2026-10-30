"use client";

import { useEffect, useState } from "react";

/** Decorative "CONTINUE?" countdown, 9 down to 0. Hidden from assistive technology. */
export function DeclinedCountdown() {
  const [n, setN] = useState(9);

  useEffect(() => {
    const timer = setInterval(() => setN((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span aria-hidden="true" className="font-pixel text-6xl leading-none text-accent md:text-7xl">
      {n}
    </span>
  );
}
