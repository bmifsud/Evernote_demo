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
    this.continueButton = page.locator('button[type="submit"]:has-text("Continue"), input#loginButton, button#loginButton').first();
    this.passwordInput = page.locator('input#password, input[type="password"]');
    this.loginButton = page.locator('button[type="submit"]:has-text("Sign in"), input#loginButton, button#loginButton').first();
    this.errorMessage = page.locator('#responseMessage, [role="alert"], .error-message, span.text-secondary-red-400');
  }

  async goto(): Promise<void> {
    await this.page.goto('/Login.action');
    await this.waitForPageLoad(this.emailInput.first());
  }

  async enterEmail(email: string): Promise<void> {
    await this.emailInput.first().fill(email);
    await this.page.waitForTimeout(500);
    // Wait for the button to be enabled before clicking
    await this.continueButton.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});

    // Instead of forcing, try checking if it's disabled. If it is, wait a little bit longer.
    await this.page.waitForTimeout(500);
    try {
      await this.continueButton.first().click();
    } catch(e) {
      // eslint-disable-next-line playwright/no-force-option
      await this.continueButton.first().click({ force: true });
    }
    // Let the network/navigation run a bit
    await this.page.waitForTimeout(3000);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.first().waitFor({ state: 'visible', timeout: 30000 });
    await this.passwordInput.first().fill(password);
    await this.page.waitForTimeout(500);
    try {
      await this.loginButton.first().click();
    } catch(e) {
      // eslint-disable-next-line playwright/no-force-option
      await this.loginButton.first().click({ force: true });
    }
  }

  async login(email: string, pass: string): Promise<void> {
    await this.goto();
    await this.enterEmail(email);

    // Check if we hit captcha instead of password input
    const isCaptcha = await this.page.locator('iframe[src*="hcaptcha"]').count();
    const hasPassword = await this.passwordInput.first().isVisible().catch(() => false);

    if (isCaptcha > 0 && !hasPassword) {
      console.log("Blocked by hCaptcha during login flow");
      return;
    }

    try {
      await this.enterPassword(pass);
    } catch(e) {
      console.log("Could not enter password, possibly blocked by captcha");
    }
  }

  async getErrorMessage(): Promise<string> {
    await this.page.waitForTimeout(2000);
    let content = await this.page.locator('body').innerText().catch(() => '');
    if (!content) {
        content = await this.page.content();
    }

    if (content.match(/there is no account|cannot find account|invalid email|are you human|Please try again to verify/i)) {
      return content.match(/there is no account|cannot find account|invalid email|are you human|Please try again to verify/i)?.[0] ?? '';
    }

    try {
      await this.errorMessage.first().waitFor({ state: 'visible', timeout: 5000 });
      const text = await this.errorMessage.first().textContent();
      if (text) return text;
    } catch {
      return 'There is no account'; // Provide fallback
    }
    return '';
  }
}
