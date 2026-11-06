import { test, expect } from '../fixtures/baseFixture';
import data from '../test-data/login.json';

test.describe('VWO Login - invalid flows', () => {
  test.describe.configure({ mode: 'default' });

  for (const tc of data.invalidLogins) {
    test(`${tc.id} ${tc.title}`, { tag: ['@negative', '@regression'] }, async ({ loginPage, credentials, page }) => {
      const email = tc.email.replace('{{VALID_EMAIL}}', credentials.email || data.fallbackEmail);
      const password = tc.password.replace('{{VALID_PASSWORD}}', credentials.password || data.fallbackPassword);

      await test.step('Verify no error is shown before submit', async () => {
        await expect(loginPage.errorMessage).toBeHidden();
      });

      await test.step('Submit the credentials', async () => {
        await loginPage.login(email, password);
      });

      await test.step('Verify the error message', async () => {
        expect(await loginPage.getErrorMessage()).toBe(data.expectedErrorMessage);
        await expect(page).toHaveURL(/#\/login/);
      });
    });
  }

  for (const tc of data.invalidEmailFormats) {
    test(`${tc.id} Invalid email format "${tc.email}" is blocked by browser validation`, { tag: ['@negative', '@regression'] }, async ({ loginPage, page }) => {
      await test.step('Enter a malformed email and submit', async () => {
        await loginPage.login(tc.email, data.fallbackPassword);
      });

      await test.step('Verify the email field is invalid and the user stays on login', async () => {
        expect(await loginPage.isEmailValid()).toBe(false);
        await expect(page).toHaveURL(/#\/login/);
      });
    });
  }
});
