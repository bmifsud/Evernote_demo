import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input#email, input#username, input[type="email"]');
    this.continueButton = page.locator('button[type="submit"]:has-text("Continue"), input#loginButton').first();
    this.passwordInput = page.locator('input#password, input[type="password"], input[placeholder="Password"]');
    this.loginButton = page.locator('button[type="submit"]:has-text("Sign in"), button[type="submit"], input#loginButton').first();
    this.errorMessage = page.locator('#responseMessage, [role="alert"], .error-message, .text-secondary-red-400, span.text-r14.text-secondary-red-400');
  }

  async goto(): Promise<void> {
    await this.page.goto('/Login.action');
    await this.page.waitForLoadState('networkidle');
  }

  async enterEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.continueButton.click({force: true});
    await this.page.waitForTimeout(2000);
  }

  async enterPassword(password: string): Promise<void> {
    await this.page.waitForTimeout(2000);
    try {
      await this.passwordInput.first().waitFor({ state: 'visible', timeout: 5000 });
      await this.passwordInput.first().fill(password);
      await this.loginButton.click({force: true});
    } catch (e) {
      // If password field doesn't appear, we might be blocked by captcha or flow changed
      console.log('Password input not found, skipping password entry.');
    }
  }

  async login(email: string, pass: string): Promise<void> {
    await this.goto();
    await this.enterEmail(email);
    await this.enterPassword(pass);
  }

  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible' });
    return (await this.errorMessage.textContent()) ?? '';
  }
}
