"use client";

import { useEffect } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import { consentConfig } from "@/lib/consent";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import "@/app/cookieconsent.css";

/** Mounts the cookie consent banner. Renders no markup of its own: the library injects it. */
export function CookieConsentBanner() {
  useEffect(() => {
    void CookieConsent.run(consentConfig);
  }, []);
  return null;
}
