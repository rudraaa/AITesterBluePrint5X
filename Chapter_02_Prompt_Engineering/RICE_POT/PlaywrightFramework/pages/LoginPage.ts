import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  static readonly PATH = '/#/login';
  static readonly AUTH_RESPONSE_TIMEOUT = 30_000;

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly passwordToggle: Locator;
  readonly rememberMe: Locator;
  readonly rememberMeLabel: Locator;
  readonly signInButton: Locator;
  readonly freeTrialLink: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('#login-username');
    this.passwordInput = page.getByLabel('Password', { exact: true });
    this.passwordToggle = page.getByRole('button', { name: 'Toggle password visibility' });
    this.rememberMe = page.getByLabel('Remember me');
    this.rememberMeLabel = page.getByText('Remember me', { exact: true });
    this.signInButton = page.getByRole('button', { name: 'Sign in', exact: true });
    this.freeTrialLink = page.getByRole('link', { name: 'Start a free trial' });
    this.errorMessage = page.locator('#js-notification-box-msg');
  }

  async goto(): Promise<void> {
    await this.navigate(LoginPage.PATH);
    await this.perform('wait for the login form', () => this.signInButton.waitFor({ state: 'visible' }));
  }

  async enterEmail(email: string): Promise<void> {
    await this.perform('enter the email', () => this.emailInput.fill(email));
  }

  async enterPassword(password: string): Promise<void> {
    await this.perform('enter the password', () => this.passwordInput.fill(password));
  }

  async clickSignIn(): Promise<void> {
    await this.perform('click Sign in', () => this.signInButton.click());
  }

  async login(email: string, password: string): Promise<void> {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickSignIn();
  }

  async getErrorMessage(): Promise<string> {
    return this.perform('read the error message', async () => {
      await this.errorMessage.waitFor({ state: 'visible', timeout: LoginPage.AUTH_RESPONSE_TIMEOUT });
      return (await this.errorMessage.innerText()).trim();
    });
  }

  async isEmailValid(): Promise<boolean> {
    return this.perform('read the email field validity', () =>
      this.emailInput.evaluate((el) => (el as HTMLInputElement).validity.valid),
    );
  }

  async toggleRememberMe(): Promise<void> {
    await this.perform('toggle Remember me', () => this.rememberMeLabel.click());
  }

  async togglePasswordVisibility(): Promise<void> {
    await this.perform('toggle password visibility', () => this.passwordToggle.click());
  }
}
