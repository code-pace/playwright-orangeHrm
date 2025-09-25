import { Page, Locator, expect } from '@playwright/test';

export default class Admin {
  readonly page: Page;
  readonly options = [
    'User Management',
    'Job',
    'Organization',
    'Qualifications',
    'Nationalities',
    'Corporate Branding',
    'Configuration',
    'More',
  ];

  constructor(page: Page) {
    this.page = page;
  }

  getOptions() {
    return this.options;
  }

  interceptRequestAndMock(matcher: string, payload: any, statusCode: number) {
    this.page.route(matcher, async (route) => {
      const mockResponse = {
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify(payload),
      };
      await route.fulfill(mockResponse);
    });
  }

  async waitForResponse(matcher: RegExp) {
    return this.page.waitForResponse(
      (response) => matcher.test(response.url()) && response.status() === 200,
    );
  }
  async goto(baseURL?: string) {
    if (baseURL) {
      await this.page.goto(baseURL + '/web/index.php/admin/viewSystemUsers');
    } else {
      await this.page.goto('/web/index.php/admin/viewSystemUsers');
    }
  }

  async title() {
    return this.page.locator('.oxd-topbar-header-breadcrumb .oxd-text--h6');
  }

  async navTabs() {
    return this.page.locator('.oxd-topbar-body-nav-tab span');
  }

  async getAdminOptions() {
    return this.page.locator('.oxd-topbar-body-nav-tab');
  }

  async gotoAdminUserDropdown() {
    await this.page.locator('.oxd-userdropdown-tab').click();
  }

  getDropDownByLabel(label: string) {
    return this.page
      .locator('label')
      .filter({ hasText: label })
      .locator('..')
      .locator('..')
      .locator('div.oxd-select-text');
  }

  async checkAboutInfo(message: string) {
    await expect(this.page.locator('.orangehrm-about-text')).toContainText(message);
  }

  async clickEmployeeBtn(text: string) {
    await this.page.locator(`button:text(" ${text} ")`).click();
  }

  getAddEmployeeTitle() {
    return this.page.locator('h6.orangehrm-main-title');
  }

  getEmployeeName(text: string) {
    return this.page.locator('div[role="option"]').filter({ hasText: text }).nth(0);
  }

  getInputFieldByLabel(text: string) {
    return this.page
      .locator('label')
      .filter({ hasText: text })
      .locator('..')
      .locator('..')
      .locator('input.oxd-input--active');
  }

  getAddEmployeeOptions(text: string) {
    return this.page.locator('div.oxd-select-dropdown').filter({ hasText: text }).nth(0);
  }

  async getSubmitBtn() {
    await this.page.locator('button[type="submit"]').click();
  }

  async getEmployeeInputField(text: string) {
    return this.page.locator('input[placeholder="Type for hints..."]').fill(text);
  }

  async addDescription(field: string, message: string) {
    const fields = await this.page.locator('textarea.oxd-textarea--active').all();
    if (field === 'Job Description' || field === 'Note') {
      await fields[0].fill(message);
    }
  }

  async toggleCheckbox() {
    await this.page.locator('input[type="checkbox"]').check({ force: true });
  }

  async checkDisplayPassword() {
    const checkbox = this.page.locator('input[type="checkbox"]');
    await expect(checkbox).not.toBeChecked();
    const inputs = await this.page
      .locator(
        '//div[contains(@class,"oxd-input-group")]//input[contains(@class,"oxd-input--active")]',
      )
      .all();
    if (inputs[1]) await expect(inputs[1]).not.toBeVisible();
    if (inputs[2]) await expect(inputs[2]).not.toBeVisible();
    await this.toggleCheckbox();
  }

  async selectEmployeeDropdownOptions(options: string) {
    await this.getAddEmployeeOptions(options).click();
  }

  async clickRecordActionBtn(action: string) {
    const actions = await this.page.locator('div[data-v-c423d1fa]').all();
    if (action === 'edit') {
      await actions[0].locator('button:nth-child(2)').click();
    } else if (action === 'delete') {
      await actions[0].locator('button:nth-child(1)').click();
    }
  }

  async navigateToAdminModule() {
    await this.page.locator('a[href*="viewAdminModule"]').click();
    const breadcrumb = this.page.locator('.oxd-topbar-header-breadcrumb');
    await expect(breadcrumb.locator('.oxd-text--h6:nth-child(1)')).toHaveText('Admin');
    await expect(breadcrumb.locator('.oxd-text--h6:nth-child(2)')).toHaveText('User Management');
  }

  async checkValueExists(name: string) {
    const records = this.page.locator('div.oxd-table-card').nth(0);
    await expect(records).toContainText(name);
  }

  async uploadFile(filePath: string) {
    const fileInput = this.page.locator('input[type="file"].oxd-file-input');
    await fileInput.setInputFiles(filePath);
    await this.page.waitForTimeout(1000);
    const value = await this.page.locator('div.oxd-file-input-div').innerText();
    expect(value).toContain(filePath.split(/[\\/]/).pop()!);
    return this.page.locator('span.oxd-input-field-error-message');
  }

  async editUploadedFile(filePath: string) {
    const values = ['keepCurrent', 'deleteCurrent', 'replaceCurrent'];
    let num = Math.round(Math.random() * values.length);
    let index = num === 0 ? 0 : num - 1;
    const radio = this.page.locator(`input[type="radio"][value=${values[index]}]`);
    await radio.check({ force: true });
    if (values[index] === 'replaceCurrent') {
      await this.uploadFile(filePath);
    }
  }

  async getJobTitleIndex(data: any[], jobTitle: string): Promise<number> {
    for (let index = 0; index < data.length; index++) {
      const value = data[index];
      if (typeof value.title !== 'undefined' && value.title === jobTitle) {
        return index;
      } else if (typeof value.name !== 'undefined' && value.name === jobTitle) {
        return index;
      } else if (
        typeof value.currencyType !== 'undefined' &&
        jobTitle.includes(value.currencyType.name)
      ) {
        return index;
      }
    }
    throw new Error('Element not found!!');
  }

  async isElementExist() {
    const el = await this.page.locator('div[data-v-8a31f039]');
    if ((await el.count()) > 0) {
      return el;
    } else {
      return this.page.locator('div[data-v-c423d1fa]');
    }
  }

  async jobTitleAction(action: string, index: number) {
    const selector = action === 'add' ? 'div[data-v-8a31f039]' : 'div[data-v-c423d1fa]';
    const actions = await this.page.locator(selector).all();
    if (action === 'edit') {
      await actions[index].locator('button:nth-child(2)').click();
    } else if (action === 'delete') {
      await actions[index].locator('button:nth-child(1)').click();
    } else {
      await actions[index].locator('button:nth-child(3)').click();
    }
  }

  async subunitAction(action: string, index: number, unitTitle: string) {
    const elems = await this.page.locator('div.oxd-tree-node-wrapper').all();
    await elems[index].locator('span.oxd-tree-node-toggle > button').click();
    const el = this.page.locator(`text=${unitTitle}`).first().locator('..');
    if (action === 'edit') {
      await el.locator('button:nth-child(2)').click();
    } else if (action === 'delete') {
      await el.locator('button:nth-child(1)').click();
    } else {
      await el.locator('button:nth-child(3)').click();
    }
  }

  async executeJobTitleAction(resp: string, title: string, action: string) {
    const interception = await this.page.waitForResponse(resp);
    const response = await interception.json();
    let data;
    if (interception.url().includes('subunits')) {
      data = response.data[0].children;
    } else {
      data = response.data;
    }
    expect(interception.status()).toBe(200);
    const dataIndex = await this.getJobTitleIndex(data, title);
    await this.jobTitleAction(action, dataIndex);
  }

  async executeSubunitAction(resp: string, title: string, unitTitle: string, action: string) {
    const interception = await this.page.waitForResponse(resp);
    const response = await interception.json();
    let data;
    if (interception.url().includes('subunits')) {
      data = response.data[0].children;
    } else {
      data = response.data;
    }
    expect(interception.status()).toBe(200);
    const dataIndex = await this.getJobTitleIndex(data, title);
    await this.subunitAction(action, dataIndex, unitTitle);
  }

  async selectInputDateField(index: number) {
    const elems = await this.page.locator('input[placeholder="hh:mm"]').all();
    await elems[index].click();
  }

  timeBreakDown(time1: string) {
    let hour: number, mins: number, daytime: string;
    const time = time1.split(' ');
    daytime = time[time.length - 1].trim();
    hour = Number(time[0].split(':')[0].trim());
    mins = Number(time[0].split(':')[1].trim());
    return { daytime, hour, mins };
  }

  async changeHourCountBtn(action: string) {
    if (action === 'down') {
      await this.page.locator('.oxd-time-hour-input-down').click();
    } else {
      await this.page.locator('.oxd-time-hour-input-up').click();
    }
  }

  async changeMinsCountBtn(action: string) {
    if (action === 'down') {
      await this.page.locator('.oxd-time-minute-input-down').click();
    } else {
      await this.page.locator('.oxd-time-minute-input-up').click();
    }
  }

  async updateHour(hr: number) {
    const hourInput = this.page.locator('input.oxd-time-hour-input-text');
    let hour = Number(await hourInput.inputValue());
    if (hour === hr) {
      return;
    } else if (hour > hr) {
      await this.changeHourCountBtn('down');
      await this.updateHour(hr);
    } else if (hour < hr) {
      await this.changeHourCountBtn('up');
      await this.updateHour(hr);
    }
  }

  async updateMins(mins: number) {
    const minInput = this.page.locator('input.oxd-time-minute-input-text');
    let min = Number(await minInput.inputValue());
    if (min === mins) {
      return;
    } else if (min > mins) {
      await this.changeMinsCountBtn('down');
      await this.updateMins(mins);
    } else if (min < mins) {
      await this.changeMinsCountBtn('up');
      await this.updateMins(mins);
    }
  }

  async updateDayTime(dt: string) {
    await this.page.locator(`input[value=${dt}]`).click();
  }

  async selectWorkingTime(time: string) {
    let { daytime, hour, mins } = this.timeBreakDown(time);
    await this.updateHour(hour);
    await this.updateMins(mins);
    await this.updateDayTime(daytime);
  }

  getTimeDiff(FromTime: string, ToTime: string) {
    let fromTime = this.timeBreakDown(FromTime);
    let toTime = this.timeBreakDown(ToTime);
    let fromMins: number, toMins: number;
    if (fromTime.daytime === 'AM') {
      fromMins = fromTime.hour !== 12 ? fromTime.hour * 60 + fromTime.mins : 0 + fromTime.mins;
    } else {
      fromMins =
        fromTime.hour !== 12
          ? (fromTime.hour + 12) * 60 + fromTime.mins
          : fromTime.hour * 60 + fromTime.mins;
    }
    if (toTime.daytime === 'AM') {
      toMins = toTime.hour !== 12 ? toTime.hour * 60 + toTime.mins : 0 + toTime.mins;
    } else {
      toMins =
        toTime.hour !== 12 ? (toTime.hour + 12) * 60 + toTime.mins : toTime.hour * 60 + toTime.mins;
    }
    let timeDiffInMins = fromMins - toMins;
    let timeDiffInHours = timeDiffInMins / 60;
    let str = timeDiffInHours.toString();
    return str.startsWith('-') ? str.slice(1) : str;
  }

  async checkDurationDiff(FromTime: string, ToTime: string) {
    const value = await this.page.locator('.orangehrm-workshift-duration').innerText();
    expect(value).toContain(this.getTimeDiff(FromTime, ToTime));
  }

  async getElementFromParentElem(elemType: string, fieldName: string, message: string) {
    const elems = await this.page.locator('div.oxd-input-field-bottom-space').all();
    const newElem = elems.find(async (value) => (await value.innerText()).includes(fieldName));
    if (!newElem) return;
    if (elemType === 'input') {
      await newElem.locator('input').fill(message);
    } else if (elemType === 'span') {
      await expect(newElem.locator('span')).toContainText(message);
    } else if (elemType === 'textarea') {
      await newElem.locator('textarea').fill(message);
    } else {
      await this.selectEmployeeDropdownOptions(message);
    }
  }

  successToast() {
    return this.page.locator('.oxd-toast-content--success');
  }
}
