import tailwindcss from "@tailwindcss/vite";
import type { StorybookConfig } from "@storybook/nextjs-vite";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  stories: ["../components/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-docs"],
  framework: "@storybook/nextjs-vite",
  staticDirs: ["../public"],
  // Tailwind 4 needs its Vite plugin here: Next handles it through its own pipeline.
  viteFinal: (viteConfig) => mergeConfig(viteConfig, { plugins: [tailwindcss()] }),
};

export default config;
