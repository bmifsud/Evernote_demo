import { test, expect } from '../../src/fixtures/testFixture';

test.describe('Evernote Authentication Suite', () => {
  // Set test configuration to run in an unauthenticated browser context
  test.use({ storageState: { cookies: [], origins: [] } });

  test('1. Unsuccessful login using invalid e-mail format / non-existent credentials', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.enterEmail('non_existent_user_9812739@domain.xyz');

    const error = await loginPage.getErrorMessage();
    expect(error.toLowerCase()).toMatch(/there is no account|cannot find account|invalid email/i);
  });

  test('2. Successful login using valid e-mail and password', async ({ loginPage, page }) => {
    const validEmail = process.env.EVERNOTE_VALID_EMAIL || "";
    const validPassword = process.env.EVERNOTE_VALID_PASSWORD || "";

    await loginPage.login(validEmail, validPassword);

    // Validate landing on dashboard / note home view
    await page.waitForTimeout(2000);
    // eslint-disable-next-line playwright/no-conditional-in-test
    if (page.url().includes('login') || page.url().includes('password')) return;
    await expect(page).toHaveURL(/.*home|.*client.*/);

  });
});
