import vinext from "vinext";
import { defineConfig } from "vite";

// This project has no server-side services. The production build is static.
export default defineConfig({
  plugins: [vinext()],
  server: process.env.CODEX_SANDBOX === "seatbelt"
    ? { watch: { useFsEvents: false, usePolling: true } }
    : undefined,
});
