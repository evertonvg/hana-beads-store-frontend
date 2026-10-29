const DEFAULT_NEXT = "/conta";
const BASE = "http://pp.invalid";
const MAX_DECODES = 3;

/** Control characters (a browser strips tabs and newlines, turning "/\t/x" into "//x"). */
const CONTROL = /[\u0000-\u001f\u007f]/;

/**
 * Post-login redirect target taken from the query string. Only same-site absolute paths are
 * accepted: starts with a single "/", no backslash, no control characters or spaces, also after
 * up to three rounds of percent-decoding. Anything else gives `fallback`.
 */
export function safeNext(value: unknown, fallback: string = DEFAULT_NEXT): string {
  if (typeof value !== "string" || value === "") return fallback;
  let current = value;
  for (let i = 0; i <= MAX_DECODES; i++) {
    if (!current.startsWith("/") || current.startsWith("//")) return fallback;
    if (current.includes("\\") || CONTROL.test(current)) return fallback;
    let decoded: string;
    try {
      decoded = decodeURIComponent(current);
    } catch {
      return fallback;
    }
    if (decoded === current) break;
    current = decoded;
  }
  try {
    if (new URL(value, BASE).origin !== BASE) return fallback;
  } catch {
    return fallback;
  }
  return value;
}
