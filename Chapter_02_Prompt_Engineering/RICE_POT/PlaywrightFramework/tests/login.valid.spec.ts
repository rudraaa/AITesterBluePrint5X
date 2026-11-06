import { test, expect } from '../fixtures/baseFixture';
import data from '../test-data/login.json';

test.describe('VWO Login - valid flows', () => {
  test('TC_01 Valid login navigates to the dashboard', { tag: ['@smoke', '@regression'] }, async ({ loginPage, credentials, page }) => {
    test.skip(!credentials.provided, 'Set VWO_EMAIL and VWO_PASSWORD in .env to run the valid login test');

    await test.step('Submit valid credentials', async () => {
      await loginPage.login(credentials.email, credentials.password);
    });

    await test.step('Verify the dashboard is loaded', async () => {
      await expect(page).toHaveURL(new RegExp(data.dashboardUrlPattern), { timeout: 30_000 });
    });
  });

  test('TC_06 Password is masked and the visibility toggle reveals it', { tag: ['@ui', '@regression'] }, async ({ loginPage }) => {
    await test.step('Verify the password field is masked', async () => {
      await loginPage.enterPassword(data.fallbackPassword);
      await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    });

    await test.step('Toggle visibility and verify the password is shown', async () => {
      await loginPage.togglePasswordVisibility();
      await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');
    });
  });

  test('TC_07 Remember me is unchecked by default and toggleable', { tag: ['@ui', '@regression'] }, async ({ loginPage }) => {
    await test.step('Verify Remember me is unchecked by default', async () => {
      await expect(loginPage.rememberMe).toBeAttached();
      await expect(loginPage.rememberMe).not.toBeChecked();
    });

    await test.step('Toggle Remember me on and off', async () => {
      await loginPage.toggleRememberMe();
      await expect(loginPage.rememberMe).toBeChecked();
      await loginPage.toggleRememberMe();
      await expect(loginPage.rememberMe).not.toBeChecked();
    });
  });

  test('TC_08 Start a free trial link points to the free-trial page', { tag: ['@ui', '@regression'] }, async ({ loginPage, page }) => {
    await test.step('Verify the page title', async () => {
      await expect(page).toHaveTitle(data.pageTitle);
    });

    await test.step('Verify the free-trial link', async () => {
      await expect(loginPage.freeTrialLink).toBeVisible();
      await expect(loginPage.freeTrialLink).toHaveAttribute('href', new RegExp(data.freeTrialHrefPattern));
    });
  });
});
