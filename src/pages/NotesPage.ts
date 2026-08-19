import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';
import { RichTextEditor } from '../components/RichTextEditor';

export class NotesPage extends BasePage {
  public readonly editor: RichTextEditor;
  readonly sidebar: Locator;
  readonly createNoteButton: Locator;
  readonly noteCardItems: Locator;
  readonly userProfileMenu: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.editor = new RichTextEditor(page);

    // Resilient locator queries for sidebar, note cards, and user menu
    this.sidebar = page.getByTestId('sidebar').or(page.locator('#qa-NAV'));
    this.createNoteButton = page.getByTestId('sidebar-new-note-btn').or(page.locator('button#qa-CREATE_NOTE'));
    this.noteCardItems = page.getByTestId('note-card').or(page.locator('.note-list-item'));
    this.userProfileMenu = page.getByTestId('user-profile-menu').or(page.locator('#qa-NAV_USER'));
    this.logoutButton = page.getByTestId('logout-btn').or(page.getByText('Log out'));
  }

  async createNewNote(title: string, content: string): Promise<void> {
    await this.createNoteButton.click();
    await this.editor.fillTitle(title);
    await this.editor.fillBody(content);
  }

  async openNoteByTitle(title: string): Promise<void> {
    const targetNote = this.noteCardItems.filter({ hasText: title }).first();
    await targetNote.waitFor({ state: 'visible' });
    await targetNote.click();
  }

  async verifyActiveNoteContent(expectedTitle: string, expectedContent: string): Promise<void> {
    await this.editor.verifyContent(expectedTitle, expectedContent);
  }

  async logout(): Promise<void> {
    await this.userProfileMenu.click();
    await this.logoutButton.click();
    await this.page.waitForURL(/.*Login\.action.*/);
  }
}
