import { test, expect } from '@playwright/test';

// ✅ ต้องเป็น top-level (ห้ามอยู่ใน describe/test)
test.use({
  video: 'on',              // หรือ 'retain-on-failure'
  screenshot: 'on',
  trace: 'on',
});

// ✅ เพิ่มเวลาให้ทั้งไฟล์นี้ (กัน flow ยาว + slowMo)
test.setTimeout(180000); // 180s

test('test', async ({ page }) => {
  // ✅ กัน action/selector ช้า
  page.setDefaultTimeout(60000);
  page.setDefaultNavigationTimeout(90000);

  // =========================
  // เข้าเว็บ + Login
  // =========================
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });

  await page.getByRole('link', { name: 'Join Us' }).click();
  await page.getByRole('link', { name: 'เข้าสู่ระบบ' }).click();

  await page.getByRole('textbox', { name: 'อีเมล' }).fill('n1@gmail.com');
  await page.getByRole('textbox', { name: 'รหัสผ่าน' }).fill('Nn123456789');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();

  // =========================
  // เริ่มจอง
  // =========================
  await page.getByRole('button', { name: 'Book Now' }).click();

  // ✅ เลือกวันที่ (จับ type="date" ให้ชัด)
  const dateInput = page.locator('input[type="date"]').first();
  await expect(dateInput).toBeVisible();
  await dateInput.fill('2026-01-10');

  await page.getByRole('button', { name: '08:30' }).click();
  await page.getByRole('button', { name: 'จองต่อ' }).click();

  // =========================
  // ข้อมูลกลุ่ม
  // =========================
  await page.getByRole('textbox', { name: 'กรุณาระบุชื่อกลุ่ม' }).fill('the eden');
  await page.getByRole('button', { name: 'จองต่อ' }).click();

  // =========================
  // Step 3: บริการเสริม
  // =========================
  await expect(page.getByRole('heading', { name: /Step 3/i })).toBeVisible();

  /**
   * ❌ ไม่ใช้ checkbox.check / setChecked
   * ✅ เช็คว่าพาเนลเลือกแคดดี้เปิดแล้วหรือยัง
   */
  const caddySearch = page.getByRole('textbox', { name: 'ค้นหาชื่อแคดดี้...' });

  if (!(await caddySearch.isVisible())) {
    // คลิกข้อความเพื่อเปิดพาเนล (แทนการไปติ๊ก input)
    await page.getByText('ต้องการเลือกแคดดี้', { exact: true }).click();
    await expect(caddySearch).toBeVisible();
  }

  // เพิ่มจำนวนรถ + กระเป๋า
  await page.getByRole('button', { name: '+' }).nth(1).click(); // รถ
  await page.getByRole('button', { name: '+' }).first().click(); // กระเป๋า

  // =========================
  // เลือกแคดดี้ (คลิกการ์ดที่คลิกได้จริง)
  // =========================
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
  // Stripe (กรณี input ไม่อยู่ iframe)
  // =========================
  await page.getByRole('textbox', { name: 'Email' }).fill('4242@gmail.com');
  await page.getByRole('textbox', { name: 'Card number' }).fill('4242 4242 4242 4242');
  await page.getByRole('textbox', { name: 'Expiration' }).fill('12 / 34');
  await page.getByRole('textbox', { name: 'CVC' }).fill('123');
  await page.getByRole('textbox', { name: 'Cardholder name' }).fill('Test User');

  // กดจ่ายเงิน
  await page.getByTestId('hosted-payment-submit-button').click();

  // ✅ อย่า goto success เอง ให้รอ redirect จริง (กันค้าง/timeout)
  await page.waitForURL('**/booking/success**', { timeout: 90000 });

  // ✅ optional: เช็คว่าหน้า success มีอะไรบางอย่าง
  // await expect(page.getByText(/success|สำเร็จ/i)).toBeVisible();
});
