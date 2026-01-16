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
  await page.getByRole('link', { name: 'Join Us' }).click();
  await page.getByRole('textbox', { name: 'ชื่อ' }).click();
  await page.getByRole('textbox', { name: 'ชื่อ' }).fill('nanthawat');
  await page.getByRole('textbox', { name: 'เบอร์โทรศัพท์' }).click();
  await page.getByRole('textbox', { name: 'เบอร์โทรศัพท์' }).fill('01234567');
  await page.getByRole('textbox', { name: 'ที่อยู่อีเมล' }).click();
  await page.getByRole('textbox', { name: 'ที่อยู่อีเมล' }).fill('n22@gmail.com');
  await page.getByRole('textbox', { name: 'รหัสผ่าน', exact: true }).click();
  await page.getByRole('textbox', { name: 'รหัสผ่าน', exact: true }).fill('Nn123456789');
  await page.getByRole('textbox', { name: 'ยืนยันรหัสผ่าน' }).click();
  await page.getByRole('textbox', { name: 'ยืนยันรหัสผ่าน' }).fill('Nn123456789');
  await page.getByRole('button', { name: 'ลงทะเบียน' }).click();
});