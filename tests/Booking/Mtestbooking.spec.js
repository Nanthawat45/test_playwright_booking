import { test, expect, devices } from '@playwright/test';

test.use({
  ...devices['Pixel 5'],
  video: 'on',              // หรือ 'retain-on-failure'
  screenshot: 'on',
  trace: 'on',
});

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.locator('div').filter({ hasText: 'Join Us' }).nth(4).click();
  await page.getByRole('link', { name: 'เข้าสู่ระบบ' }).click();

  await page.getByRole('textbox', { name: 'อีเมล' }).fill('n1@gmail.com');
  await page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill('Nn123456789');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();

  await page.getByRole('button', { name: 'Book Now' }).click();

  await page.getByRole('button', { name: '08:30' }).click();
  await page.getByRole('button', { name: '08:45' }).click();
  await page.getByRole('button', { name: 'จองต่อ' }).click();

  await page.getByRole('textbox', { name: 'กรุณาระบุชื่อกลุ่ม' }).fill('mtest');
  await page.getByRole('button', { name: 'จองต่อ' }).click();

  await page.getByRole('button', { name: '+' }).first().click();
  await page.getByRole('button', { name: '+' }).nth(1).click();

  // =========================
  // ✅ เลือกแคดดี้ (แก้ปัญหาเดิม)
  // =========================
  const caddySearch = page.getByRole('textbox', { name: 'ค้นหาชื่อแคดดี้...' });

  if (!(await caddySearch.isVisible())) {
    await page.getByText('ต้องการเลือกแคดดี้', { exact: true }).click();
    await expect(caddySearch).toBeVisible();
  }

  const caddy01Card = page
    .locator('div.cursor-pointer', { hasText: 'Caddy 01' })
    .filter({ hasText: 'ว่าง' })
    .first();

  await expect(caddy01Card).toBeVisible();
  await caddy01Card.click();

  // =========================
  // ยืนยันการจอง
  // =========================
  await page.getByRole('button', { name: 'ยืนยันการจอง' }).click();
  await page.getByRole('button', { name: 'ดำเนินการชำระเงิน' }).click();

  // =========================
  // Stripe
  // =========================
  await page.getByRole('textbox', { name: 'Email' }).fill('4242@gmail.com');
  await page.getByRole('textbox', { name: 'Card number' }).fill('4242 4242 4242 4242');
  await page.getByRole('textbox', { name: 'Expiration' }).fill('12 / 34');
  await page.getByRole('textbox', { name: 'CVC' }).fill('123');
  await page.getByRole('textbox', { name: 'Cardholder name' }).fill('4242');
  await page.getByTestId('hosted-payment-submit-button').click();

  await page.goto(
    'http://localhost:5173/booking/success?session_id=cs_test_a1uhWJ0lwcYEyxxgBshO9cBhG8OPHFs0kGRYLVNyu2oO43XRn3noITSl9D'
  );
});
