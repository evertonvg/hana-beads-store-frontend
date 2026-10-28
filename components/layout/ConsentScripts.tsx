import { publicEnv } from "@/lib/env";

/**
 * Analytics script, gated by the "performance" category. `type="text/plain"` keeps the browser from
 * running it; vanilla-cookieconsent activates it only after consent and removes it if revoked.
 */
export function ConsentScripts() {
  const src = publicEnv.analyticsSrc;
  if (!src) return null;
  // type="text/plain" is inert: the rule targets executable sync scripts.
  // eslint-disable-next-line @next/next/no-sync-scripts
  return <script type="text/plain" data-category="performance" src={src} />;
}
