// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    screenshot: 'on', // ✅ จบแต่ละเทสแล้วแคปหน้าจออัตโนมัติ
  },

  projects: [
    {
      name: 'Google Chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome', // ✅ ใช้ Chrome แท้ (ไม่ใช่ Chromium)
        launchOptions: {
          headless: false, // ✅ แสดงหน้าต่างเบราว์เซอร์ (headed mode)
          slowMo: 800,    // ✅ หน่วงทุก action ~0.9 วิ
        },
      },
    },
  ],
});
