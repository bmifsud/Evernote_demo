import { test, expect } from '../../src/fixtures/testFixture';

test.describe('Evernote Note Lifecycle and Session Persistence', () => {
  const timestamp = Date.now();
  const dynamicTitle = `QA Automation Note - ${timestamp}`;
  const dynamicContent = `Automated validation body created at ${new Date().toISOString()}`;

  const email = process.env.EVERNOTE_VALID_EMAIL || "";
  const password = process.env.EVERNOTE_VALID_PASSWORD || "";

  test('3 & 4. Create note, logout, login again, and verify note persistence', async ({ loginPage, notesPage, page }) => {
    // Step 3: Login, create note, and log out
    await test.step('Login and create a new note', async () => {
      await loginPage.login(email, password);
      await notesPage.createNewNote(dynamicTitle, dynamicContent);
    });

    await test.step('Log out of application', async () => {
      await notesPage.logout();
      await expect(page).toHaveURL(/.*Login\.action.*/);
    });

    // Step 4: Login again and verify the created note
    await test.step('Log back in and verify note content', async () => {
      await loginPage.login(email, password);
      await notesPage.openNoteByTitle(dynamicTitle);
      await notesPage.verifyActiveNoteContent(dynamicTitle, dynamicContent);
    });
  });
});
