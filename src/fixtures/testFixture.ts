import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { NotesPage } from '../pages/notesPage';

type CustomFixtures = {
  loginPage: LoginPage;
  notesPage: NotesPage;
};

export const test = base.extend<CustomFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  notesPage: async ({ page }, use) => {
    await use(new NotesPage(page));
  },
});

export { expect } from '@playwright/test';
