import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForPageLoad(readyElement?: Locator): Promise<void> {
    // Prefer `load` to avoid flakiness with long-lived network connections
    await this.page.waitForLoadState('load');

    // Optionally wait for a meaningful, stable UI element to signal readiness
    if (readyElement) {
      await readyElement.waitFor({ state: 'visible' });
    }
  }
}
