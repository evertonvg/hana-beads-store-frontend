const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/**
 * Vertical (or horizontal) offset of a parallax layer, as in `Parallax.dc.html`.
 * `progress` is how far the section center is from the viewport center, in viewport heights.
 */
export function parallaxOffset(progress: number, speed: number, intensity: number, range = 260) {
  // `+ 0` turns -0 into 0 (intensity 0 or no progress).
  return -clamp(progress, -1.5, 1.5) * speed * range * intensity + 0;
}

/** Deterministic LCG from the design, so decorative layouts are stable between renders. */
export function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}
