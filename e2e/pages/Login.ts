import { Page } from 'playwright';

export default class LoginPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async goto(baseURL?: string) {
    if (baseURL) {
      await this.page.goto(baseURL + '/web/index.php/auth/login');
    } else {
      await this.page.goto('/web/index.php/auth/login');
    }
  }

  async login(username: string, password: string) {
    await this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }

  async resetPassword(username: string) {
    await this.page.click('text=Forgot your password?');
    await this.page.locator('input[name="username"]').fill(username);
    await this.page.click('button[type="submit"]');
  }

  async title() {
    return this.page.locator('.orangehrm-login-title');
  }

  async copyright() {
    return this.page.locator('p.orangehrm-copyright:nth-child(1)');
  }

  async toast() {
    return this.page.locator('p.oxd-alert-content-text');
  }

  async goToLogout() {
    await this.page.click('.oxd-userdropdown-tab');
    await this.page.click('text=Logout');
  }

  async forgotPasswordTitle() {
    return this.page.locator('.orangehrm-forgot-password-title');
  }

  async fieldErrorMessage() {
    return this.page.locator('span.oxd-input-field-error-message');
  }
}
