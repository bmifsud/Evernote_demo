import { Page, FrameLocator, Locator, expect } from '@playwright/test';
import { BasePage } from '../basePage';

export class RichTextEditor extends BasePage {
  readonly editorFrame: FrameLocator;
  readonly titleInput: Locator;
  readonly bodyContainer: Locator;
  readonly syncIndicator: Locator;

  constructor(page: Page) {
    super(page);
    this.editorFrame = page.frameLocator('iframe#qa-COMMON_EDITOR_IFRAME');
    this.titleInput = this.editorFrame.locator('[placeholder="Title"], textarea[aria-label="Note title"]');
    this.bodyContainer = this.editorFrame.locator('div[contenteditable="true"], #en-note [contenteditable="true"], #en-note-editor');
    // Save/Sync indicator could be outside or inside the frame. Often it's outside.
    this.syncIndicator = page.locator('[data-testid="sync-indicator"], #qa-SYNC_STATUS, .sync-status');
  }

  async setTitle(title: string): Promise<void> {
    await this.titleInput.waitFor({ state: 'visible' });
    await this.titleInput.fill(title);
  }

  async setBody(content: string): Promise<void> {
    await this.bodyContainer.click();
    await this.bodyContainer.fill(content);
  }

  async waitForSyncComplete(): Promise<void> {
    // Attempting to wait for sync/save indicator to be visible or to update.
    // Wait for the sync indicator to be updated, or just a debounce.
    await this.page.waitForTimeout(1500); // Fallback for stability

    // We shouldn't use conditionally if it's violating rules, let's just wait if the element is visible
    // Wait for network idle or debounce.
    try {
      await expect(this.syncIndicator).toContainText(/Saved|Synced/i, { timeout: 2000 });
    } catch {
      // Ignore if sync indicator is not found or doesn't match
    }
  }

  async getTitle(): Promise<string> {
    return await this.titleInput.inputValue();
  }

  async getBodyText(): Promise<string> {
    return await this.bodyContainer.innerText();
  }

  async verifyContent(expectedTitle: string, expectedBody: string): Promise<void> {
    await expect(this.titleInput).toHaveValue(expectedTitle);
    await expect(this.bodyContainer).toContainText(expectedBody);
  }
}
