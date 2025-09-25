import { test, expect } from '@playwright/test';
import LoginPage from '../pages/Login.js';

test.describe('Login Test', () => {
  let loginPage: LoginPage;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    loginPage = new LoginPage(page);
  });

  test.beforeEach(async () => {
    loginPage.goto();
  });

  test('Verify orange hrm login page', async () => {
    await expect(await loginPage.title()).toHaveText('Login');
    const copyrightElement = await loginPage.copyright();
    const copyright = await copyrightElement.innerText();
    if (copyright.startsWith('OrangeHRM OS')) {
      const newValue = copyright.slice('OrangeHRM OS'.length).trim();
      const number = parseFloat(newValue);
      expect(number).toBeGreaterThan(5.6);
    }
  });

  test('login with valid username and invalid password', async () => {
    await loginPage.login('Admin', 'admin9090');
    const toast = await loginPage.toast();
    await expect(toast).toHaveText('Invalid credentials');
  });

  test('login with invalid username and invalid password', async () => {
    await loginPage.login('tester', 'admin9090');
    const toast = await loginPage.toast();
    await expect(toast).toHaveText('Invalid credentials');
  });

  test('login with invalid username and valid password', async () => {
    await loginPage.login('tester', 'admin123');
    const toast = await loginPage.toast();
    await expect(toast).toHaveText('Invalid credentials');
  });

  test('login with valid username and valid password', async () => {
    await loginPage.login('Admin', 'admin123');
    await expect(loginPage.page).toHaveURL(/web\/index.php\//);
  });

  test('Verify user can logout and redirected to the login page', async () => {
    await loginPage.login('Admin', 'admin123');
    await loginPage.goToLogout();
    await expect(await loginPage.title()).toHaveText('Login');
  });

  test('user is redirected to the password reset page when forgot your password link is clicked', async ({
    page,
  }) => {
    await page.click('text=Forgot your password?');
    await expect(await loginPage.forgotPasswordTitle()).toHaveText('Reset Password');
  });

  test('user cannot reset password with an empty field', async ({ page }) => {
    await loginPage.resetPassword('');
    await expect(await loginPage.fieldErrorMessage()).toHaveText('Required');
  });

  test('user can reset password', async () => {
    await loginPage.resetPassword('Admin');
    await expect(await loginPage.forgotPasswordTitle()).toHaveText(
      'Reset Password link sent successfully',
    );
  });
});
