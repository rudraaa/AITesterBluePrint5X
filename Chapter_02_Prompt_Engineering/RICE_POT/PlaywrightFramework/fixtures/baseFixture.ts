import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

export type Credentials = {
  email: string;
  password: string;
  provided: boolean;
};

type Fixtures = {
  credentials: Credentials;
  loginPage: LoginPage;
};

export const test = base.extend<Fixtures>({
  credentials: async ({}, use) => {
    const email = process.env.VWO_EMAIL ?? '';
    const password = process.env.VWO_PASSWORD ?? '';
    await use({ email, password, provided: email.length > 0 && password.length > 0 });
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    await testInfo.attach('url-at-failure', { body: page.url(), contentType: 'text/plain' });
  }
});

export { expect };
