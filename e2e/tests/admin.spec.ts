import { test, expect, Page, APIResponse } from '@playwright/test';
import LoginPage from '../pages/Login';
import Admin from '../pages/Admin';
import { faker } from '@faker-js/faker';

test.describe('Admin Module', () => {
  let savedState: any;
  let loginPage: LoginPage;
  let admin: Admin;
  const getUserMatcher = /\/web\/index\.php\/api\/v2\/admin\/users\?limit/;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('Admin', 'admin123');
    savedState = await context.storageState();
    await context.close();
  });

  test.beforeEach(async ({ browser }) => {
    const context = await browser.newContext({ storageState: savedState });
    const page = await context.newPage();
    admin = new Admin(page);
    await admin.goto();
    const title = await admin.title();
    expect(title.nth(0)).toContainText('Admin');
    expect(title.nth(1)).toContainText('User Management');
  });

  test('Verify Admin options displayed', async () => {
    const navTabs = await admin.navTabs();
    const navCount = await navTabs.count();
    console.log(navCount);
    for (let i = 0; i < navCount; i++) {
      const text = (await navTabs.nth(i).innerText()).trim();
      expect(admin.getOptions()).toContain(text);
    }
  });

  test('Verify user can create an employee', async () => {
    await admin.clickEmployeeBtn('Add');
    await expect(admin.getAddEmployeeTitle()).toHaveText('Add User');
    await admin.getDropDownByLabel('User Role').click();
    await admin.selectEmployeeDropdownOptions('Admin');
    await admin.getDropDownByLabel('Status').click();
    await admin.selectEmployeeDropdownOptions('Enabled');
    const userName = faker.person.firstName();
    await admin.getEmployeeInputField('t');
    await admin.getEmployeeName('t').click();
    await admin.getInputFieldByLabel('Username').fill(userName);
    await admin.getInputFieldByLabel('Password').nth(0).fill('Admin@12345');
    await admin.getInputFieldByLabel('Confirm Password').fill('Admin@12345');
    await admin.getSubmitBtn();
    const toast = admin.successToast();
    await expect(toast).toBeVisible();
  });

  test('Verify user can filter by ADMIN user role', async () => {
    await admin.getDropDownByLabel('User Role').click();
    await admin.selectEmployeeDropdownOptions('Admin');
    const response = admin.waitForResponse(getUserMatcher);
    await admin.clickEmployeeBtn('Search');
    const resp = await response;
    admin.checkValueExists('Admin');
  });

  test('Verify user can filter by ESS user role', async () => {
    expect(admin.getDropDownByLabel('User Role')).toBeVisible();
    await admin.getDropDownByLabel('User Role').click();
    await admin.selectEmployeeDropdownOptions('ESS');
    const response = admin.waitForResponse(getUserMatcher);
    await admin.clickEmployeeBtn('Search');
    const resp = await response;
    admin.checkValueExists('ESS');
  });
});
