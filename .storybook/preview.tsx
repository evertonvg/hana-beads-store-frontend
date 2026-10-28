import type { Preview } from "@storybook/nextjs-vite";
import { Press_Start_2P, Space_Mono } from "next/font/google";
import "../app/globals.css";

// Same fonts and CSS variables as app/layout.tsx.
const pixel = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pixel-face",
});

const mono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono-face",
});

const preview: Preview = {
  decorators: [
    (Story) => {
      // Like app/layout.tsx: font variables on <html> so portaled dialogs get them too.
      document.documentElement.classList.add(pixel.variable, mono.variable);
      return (
        <div className="bg-bg p-6">
          <Story />
        </div>
      );
    },
  ],
  parameters: {
    layout: "fullscreen",
    // Reporting only: the enforced gate is `npm run test:a11y-stories`.
    a11y: { test: "error" },
    backgrounds: { disabled: true },
    viewport: {
      options: {
        desktop: {
          name: "Desktop 1280",
          styles: { width: "1280px", height: "800px" },
          type: "desktop",
        },
        mobile: {
          name: "Celular 390",
          styles: { width: "390px", height: "844px" },
          type: "mobile",
        },
      },
    },
  },
  initialGlobals: { viewport: { value: "desktop", isRotated: false } },
};

export default preview;
