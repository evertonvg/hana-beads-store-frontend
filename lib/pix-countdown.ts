import { differenceInSeconds } from "date-fns";

/** A Pix code works for 30 minutes. */
export const PIX_TTL_SECONDS = 30 * 60;
/** Under this many seconds the timer turns red. */
export const PIX_LOW_SECONDS = 5 * 60;

export type PixRemaining = {
  seconds: number;
  /** `MM:SS`. */
  label: string;
  /** 0..1, for the progress bar. */
  ratio: number;
  /** Under 5 minutes. */
  low: boolean;
};

/** Time left until `expiresAt` (ISO) at `now` (ms). Never negative, never more than 30 minutes. */
export function pixRemaining(expiresAt: string, now: number): PixRemaining {
  const left = differenceInSeconds(new Date(expiresAt), new Date(now), { roundingMethod: "ceil" });
  const seconds = Math.min(PIX_TTL_SECONDS, Math.max(0, left));
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return {
    seconds,
    label: `${mm}:${ss}`,
    ratio: seconds / PIX_TTL_SECONDS,
    low: seconds < PIX_LOW_SECONDS,
  };
}

/** Current time in ms. A function of its own so server components can read the clock. */
export const currentTimeMs = (): number => Date.now();
