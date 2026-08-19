import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class NavigationBar extends BasePage {
  constructor(page: Page) {
    super(page);
  }
}
