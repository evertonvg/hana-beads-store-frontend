import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const shared = {
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
};

const env = {
  DATA_SOURCE: "mock",
  SESSION_SECRET: "unit-secret-unit-secret-unit-secret-00",
};

// *.test.ts run in node, *.test.tsx in jsdom
export default defineConfig({
  test: {
    projects: [
      {
        ...shared,
        test: {
          name: "node",
          environment: "node",
          include: ["tests/unit/**/*.test.ts"],
          env,
        },
      },
      {
        ...shared,
        test: {
          name: "jsdom",
          environment: "jsdom",
          include: ["tests/unit/**/*.test.tsx"],
          env,
        },
      },
    ],
  },
});
