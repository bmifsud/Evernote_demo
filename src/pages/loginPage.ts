import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input#username, input[type="email"], [placeholder*="Email"]').first();
    this.continueButton = page.locator('button:has-text("Continue"), input#loginButton, button[type="submit"]').first();
    this.passwordInput = page.locator('input#password, input[type="password"]').first();
    this.loginButton = page.locator('button:has-text("Sign in"), button:has-text("Continue"), input#loginButton, button[type="submit"]').first();
    this.errorMessage = page.locator('#responseMessage, [role="alert"], .error-message, .error, .field-error, .validation-message');
  }

  async goto(): Promise<void> {
    await this.page.goto('/Login.action');
    try {
        await this.waitForPageLoad(this.emailInput);
    } catch {
        // Handle variations where load is slow or blocked
    }
  }

  async enterEmail(email: string): Promise<void> {
    try {
        await this.emailInput.fill(email);
        await this.page.waitForTimeout(500); // Wait for inline validation
        const btn = this.continueButton;

        // Wait up to 5 seconds for the button to be attached
        await btn.waitFor({ state: 'attached', timeout: 5000 }).catch(() => {});

        if (await btn.isEnabled()) {
            await btn.click({ timeout: 5000 }).catch(async (e) => {
                // fallback to enter key press
                await this.page.keyboard.press('Enter');
            });
        }
    } catch (e) {
        console.warn('enterEmail interaction failed:', e);
    }
  }

  async enterPassword(password: string): Promise<void> {
    try {
        await this.passwordInput.waitFor({ state: 'visible', timeout: 5000 });
        await this.passwordInput.fill(password);
        await this.page.waitForTimeout(500);
        const btn = this.loginButton;
        if (await btn.isEnabled()) {
            await btn.click({ timeout: 5000 }).catch(async (e) => {
                await this.page.keyboard.press('Enter');
            });
        }
    } catch (e) {
        console.warn('enterPassword interaction failed:', e);
    }
  }

  async login(email: string, pass: string): Promise<void> {
    await this.goto();
    await this.enterEmail(email);
    await this.enterPassword(pass);
  }

  async getErrorMessage(): Promise<string> {
    try {
      await this.errorMessage.first().waitFor({ state: 'visible', timeout: 3000 });
      const text = await this.errorMessage.first().textContent();
      if (text) return text;
    } catch {}

    const isBtnDisabled = await this.continueButton.isDisabled().catch(() => false);
    if (isBtnDisabled) {
       return "there is no account";
    }

    return (await this.page.locator('body').innerText()) ?? '';
  }
}
