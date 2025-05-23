import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths({
      projects: ["./tsconfig.test.json"],
    }),
  ],
  test: {
    workspace: [
      {
        extends: true,
        test: {
          name: "DOM",
          environment: "happy-dom",
        },
      },
      {
        extends: true,
        test: {
          name: "Node.js",
          environment: "node",
        },
      },
      {
        extends: true,
        test: {
          name: "Edge Runtime",
          environment: "edge-runtime",
        },
      },
    ],
  },
});
