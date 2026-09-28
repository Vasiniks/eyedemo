import { defineConfig, devices } from '@playwright/test'

// Lane A scaffold baseline. Lane B owns scripts/qa/beats.spec.ts (the full
// 12-stop film harness, PLAN-MASTER §11.1). Lane A captures live in
// docs/phase4/qa/A/ via a one-off script — not in scripts/qa/.
export default defineConfig({
  testDir: './scripts/qa',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev -- --port 5173 --strictPort',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },
})
