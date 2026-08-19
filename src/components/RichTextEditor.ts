import { Page, Locator, expect } from '@playwright/test';

export class RichTextEditor {
  readonly page: Page;
  readonly noteTitleInput: Locator;
  readonly noteEditorBody: Locator;

  constructor(page: Page) {
    this.page = page;
    // Resilient locator for note title input
    this.noteTitleInput = page.getByPlaceholder('Title').or(page.locator('textarea[aria-label="Note title"]'));
    // Resilient locator for note editor body
    this.noteEditorBody = page.locator('div[contenteditable="true"]').or(page.locator('#en-note [contenteditable="true"]')).or(page.locator('#en-note-editor'));
  }

  async fillTitle(title: string): Promise<void> {
    await this.noteTitleInput.waitFor({ state: 'visible' });
    await this.noteTitleInput.fill(title);
  }

  async fillBody(content: string): Promise<void> {
    await this.noteEditorBody.click();
    await this.noteEditorBody.fill(content);
    // Wait for auto-save debounce
    await this.page.waitForTimeout(1500);
  }

  async verifyContent(expectedTitle: string, expectedContent: string): Promise<void> {
    await expect(this.noteTitleInput).toHaveValue(expectedTitle);
    await expect(this.noteEditorBody).toContainText(expectedContent);
  }
}
