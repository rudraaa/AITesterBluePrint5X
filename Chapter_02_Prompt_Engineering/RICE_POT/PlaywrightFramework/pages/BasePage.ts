import { Page } from '@playwright/test';

export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  async getTitle(): Promise<string> {
    return this.perform('read the page title', () => this.page.title());
  }

  getCurrentUrl(): string {
    return this.page.url();
  }

  protected async navigate(urlPath: string): Promise<void> {
    await this.perform(`navigate to "${urlPath}"`, async () => {
      await this.page.goto(urlPath, { waitUntil: 'domcontentloaded' });
    });
  }

  protected async perform<T>(action: string, fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      throw new Error(`${this.constructor.name}: failed to ${action}. ${reason}`, { cause: error });
    }
  }
}
