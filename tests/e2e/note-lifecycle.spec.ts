import { test, expect } from '../../src/fixtures/testFixture';
import { NoteApiService } from '../../src/api/services/noteApiService';

test.describe('Evernote Note Lifecycle and Session Persistence', () => {
  let noteApiService: NoteApiService;
  let dynamicTitle: string;
  let dynamicContent: string;

  test.beforeEach(async ({ request }) => {
    noteApiService = new NoteApiService(request);
    const timestamp = Date.now();
    dynamicTitle = `QA Automation Note - ${timestamp}`;
    dynamicContent = `Automated validation body created at ${new Date().toISOString()}`;
  });

  test.afterEach(async () => {
    // Implement an afterEach hook to delete test-created notes via the API.
    await noteApiService.deleteNoteByTitle(dynamicTitle);
  });

  test('Log in, write note, log out, log back in, and verify persistence', async ({ loginPage, notesPage, page }) => {
    const email = process.env.EVERNOTE_VALID_EMAIL || "";
    const password = process.env.EVERNOTE_VALID_PASSWORD || "";

    // Test 3:
    // Log in and write a new note with dynamic timestamp data.
    await test.step('Log in and write a new note with dynamic timestamp data.', async () => {
      await loginPage.login(email, password);
      await notesPage.createNewNote(dynamicTitle, dynamicContent);
    });

    // Log out and assert session termination.
    await test.step('Log out and assert session termination.', async () => {
      await notesPage.logout();
      await expect(page).toHaveURL(/.*Login\.action.*/);
    });

    // Test 4:
    // Log back in, locate the created note by title, open it, and assert content persistence.
    await test.step('Log back in, locate the created note by title, open it, and assert content persistence.', async () => {
      await loginPage.login(email, password);
      await notesPage.openNoteByTitle(dynamicTitle);
      await notesPage.verifyActiveNoteContent(dynamicTitle, dynamicContent);
    });

    // Cross-validate note persistence through EvernoteApiClient.
    await test.step('Cross-validate note persistence through EvernoteApiClient / NoteApiService', async () => {
      const apiNote = await noteApiService.getNoteByTitle(dynamicTitle);
      expect(apiNote).toBeDefined();
      expect(apiNote.title).toBe(dynamicTitle);
      // Depending on how API returns content, it could be HTML, plain text, or rich text format.
      // This assertion checks if the string exists within the returned content payload.
      expect(JSON.stringify(apiNote.content)).toContain('Automated validation body created at');
    });
  });
});
