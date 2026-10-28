"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ComponentPropsWithoutRef } from "react";
import { publicEnv } from "@/lib/env";
import { parallaxOffset, useReducedMotion } from "@/lib/motion";

type Props = ComponentPropsWithoutRef<"section">;

/**
 * Section that moves its `[data-layer]` descendants on scroll.
 *
 * Layer attributes: `data-speed` (design speed), `data-axis` ("y" default | "x"), `data-range`
 * (default 260), `data-base` (constant offset, px), `data-rot` (constant rotation, deg) and
 * `data-spin` (extra deg per viewport of progress). With `prefers-reduced-motion: reduce` no
 * ScrollTrigger is created and the layers keep `transform: none`.
 */
export function ParallaxRoot({ children, ...rest }: Props) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const section = root.current;
      if (reduced || !section) return;
      gsap.registerPlugin(ScrollTrigger);
      const k = publicEnv.parallaxIntensity;
      const layers = gsap.utils.toArray<HTMLElement>("[data-layer]", section);

      // Progress at the moment the section enters (+) and leaves (-) the viewport.
      const edge = () => 0.5 + section.offsetHeight / (2 * window.innerHeight);

      for (const layer of layers) {
        const speed = Number(layer.dataset.speed ?? 0);
        const range = Number(layer.dataset.range ?? 260);
        const base = Number(layer.dataset.base ?? 0);
        const rot = Number(layer.dataset.rot ?? 0);
        const spin = Number(layer.dataset.spin ?? 0);
        const prop = layer.dataset.axis === "x" ? "x" : "y";
        // Function values are re-evaluated on every refresh (resize, font load).
        const at = (sign: 1 | -1) => ({
          [prop]: () => base + parallaxOffset(sign * edge(), speed, k, range),
          rotation: () => rot + sign * edge() * spin * k,
        });
        gsap.fromTo(
          layer,
          { ...at(1) },
          {
            ...at(-1),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      }
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <section ref={root} {...rest}>
      {children}
    </section>
  );
}
