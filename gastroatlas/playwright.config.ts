import { defineConfig } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3300);
const base = { baseURL: `http://localhost:${PORT}`, trace: "off" as const };

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 45_000,
  fullyParallel: true,
  workers: 4,
  reporter: [["list"]],
  webServer: { command: `npx next start -p ${PORT}`, port: PORT, reuseExistingServer: true, timeout: 120_000 },
  projects: [
    { name: "desktop", testIgnore: /responsive/, use: { ...base, viewport: { width: 1280, height: 860 } } },
    { name: "responsive-telefono", testMatch: /responsive/, use: { ...base, viewport: { width: 390, height: 844 }, hasTouch: true } },
    { name: "responsive-tablet", testMatch: /responsive/, use: { ...base, viewport: { width: 768, height: 1024 }, hasTouch: true } },
    { name: "responsive-desktop", testMatch: /responsive/, use: { ...base, viewport: { width: 1280, height: 860 } } },
  ],
});
