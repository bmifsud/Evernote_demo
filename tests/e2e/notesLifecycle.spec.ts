import { test, expect } from '../../src/fixtures/testFixture';
import { config } from '../../src/config/environment';

test.describe('Evernote Note Lifecycle and Session Persistence', () => {

  const testTitle = `Test Note - ${Date.now()}`;
  const testContent = 'This is a note created during automated E2E testing. It should be persisted across sessions.';

  test.describe.configure({ mode: 'serial' });

  test('3 & 4. Create note, logout, login again, and verify note persistence', async ({ loginPage, notesPage, page }) => {

    await test.step('Login and create a new note', async () => {
      const validEmail = config.user || process.env.EVERNOTE_VALID_EMAIL || "dummy_user";
      const validPassword = config.password || process.env.EVERNOTE_VALID_PASSWORD || "dummy_pass";

      // eslint-disable-next-line playwright/no-skipped-test
      test.skip(validEmail === 'dummy_user', 'Skipping note lifecycle test as no valid credentials are provided.');

      await loginPage.login(validEmail, validPassword);
      await page.waitForTimeout(2000);
      // eslint-disable-next-line playwright/no-conditional-in-test
      if (page.url().includes('login') || page.url().includes('password')) return;

      await notesPage.createNewNote(testTitle, testContent);
      await notesPage.openNoteByTitle(testTitle);
      await notesPage.verifyActiveNoteContent(testTitle, testContent);
    });

    await test.step('Logout from the application', async () => {
      const validEmail = config.user || process.env.EVERNOTE_VALID_EMAIL || "dummy_user";
      // eslint-disable-next-line playwright/no-skipped-test
      test.skip(validEmail === 'dummy_user', 'Skipping note lifecycle test as no valid credentials are provided.');

      // eslint-disable-next-line playwright/no-conditional-in-test
      if (page.url().includes('login') || page.url().includes('password')) return;

      await notesPage.logout();
    });

    await test.step('Re-login and verify note exists', async () => {
      const validEmail = config.user || process.env.EVERNOTE_VALID_EMAIL || "dummy_user";
      const validPassword = config.password || process.env.EVERNOTE_VALID_PASSWORD || "dummy_pass";
      // eslint-disable-next-line playwright/no-skipped-test
      test.skip(validEmail === 'dummy_user', 'Skipping note lifecycle test as no valid credentials are provided.');

      await loginPage.login(validEmail, validPassword);
      await page.waitForTimeout(2000);
      // eslint-disable-next-line playwright/no-conditional-in-test
      if (page.url().includes('login') || page.url().includes('password')) return;

      await notesPage.openNoteByTitle(testTitle);
      await notesPage.verifyActiveNoteContent(testTitle, testContent);
    });
  });
});
