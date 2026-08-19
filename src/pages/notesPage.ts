import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class NotesPage extends BasePage {
  readonly createNoteButton: Locator;
  readonly noteTitleInput: Locator;
  readonly noteEditorBody: Locator;
  readonly noteCardItems: Locator;
  readonly userProfileMenu: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.createNoteButton = page.locator('[data-testid="sidebar-new-note-btn"], button#qa-CREATE_NOTE');
    this.noteTitleInput = page.locator('[placeholder="Title"], textarea[aria-label="Note title"]');
    this.noteEditorBody = page.locator('div[contenteditable="true"], #en-note [contenteditable="true"], #en-note-editor');
    this.noteCardItems = page.locator('[data-testid="note-card"], .note-list-item');
    this.userProfileMenu = page.locator('[data-testid="user-profile-menu"], #qa-NAV_USER');
    this.logoutButton = page.locator('button:has-text("Log out"), [data-testid="logout-btn"]');
  }

  async createNewNote(title: string, content: string): Promise<void> {
    await this.createNoteButton.click();
    await this.noteTitleInput.waitFor({ state: 'visible' });
    await this.noteTitleInput.fill(title);
    await this.noteEditorBody.click();
    await this.noteEditorBody.fill(content);
    // Wait for auto-save debounce
    await this.page.waitForTimeout(1500);
  }

  async openNoteByTitle(title: string): Promise<void> {
    const targetNote = this.noteCardItems.filter({ hasText: title }).first();
    await targetNote.waitFor({ state: 'visible' });
    await targetNote.click();
  }

  async verifyActiveNoteContent(expectedTitle: string, expectedContent: string): Promise<void> {
    await expect(this.noteTitleInput).toHaveValue(expectedTitle);
    await expect(this.noteEditorBody).toContainText(expectedContent);
  }

  async logout(): Promise<void> {
    await this.userProfileMenu.click();
    await this.logoutButton.click();
    await this.page.waitForURL(/.*Login\.action.*/);
  }
}
