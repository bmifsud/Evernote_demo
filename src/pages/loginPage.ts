import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;
  readonly bodyElement: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByRole('textbox', { name: 'Email address or Username' });
    this.continueButton = page.getByRole('button', { name: 'Continue', exact: true });
    this.passwordInput = page.locator('input[type="password"]');
    this.loginButton = page.getByRole('button', { name: 'Continue', exact: true });
    this.errorMessage = page.locator('#responseMessage, [role="alert"], .error-message, .error');
    this.bodyElement = page.locator('body');
  }

  async goto(): Promise<void> {
    await this.page.goto('/Login.action');
    await this.waitForPageLoad(this.emailInput);
  }

  async enterEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.continueButton.click();
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.waitFor({ state: 'visible' });
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async login(email: string, pass: string): Promise<void> {
    await this.goto();
    await this.enterEmail(email);
    await this.enterPassword(pass);
  }

  async getErrorMessage(): Promise<string> {
    // If the error message is not present or slow, this will timeout.
    // In our test, the actual text could be just somewhere on the page.
    try {
      await this.errorMessage.first().waitFor({ state: 'visible', timeout: 5000 });
      return (await this.errorMessage.first().textContent()) ?? '';
    } catch {
       return await this.bodyElement.innerText();
    }
  }
}
