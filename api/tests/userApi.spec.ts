import { test, expect, request } from '@playwright/test';
import { UsersApi } from '../services/UserApi';

test.describe('UsersApi', () => {
  let usersApi: UsersApi;

  test.beforeAll(async () => {
    const apiRequest = await request.newContext();
    usersApi = new UsersApi(apiRequest);
  });

  test('get user by status', async () => {
    usersApi.setSearchParamObj({
      status: 1,
      sortField: 'u.userName',
      sortOrder: 'ASC',
    } as any);
    const response = await usersApi.get(usersApi.getSearchPath());
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toHaveProperty('data');
    if (body.data && body.data.length > 0) {
      for (const user of body.data) {
        expect(user.status).toBe(1);
      }
    }
  });

  test('get user by role', async () => {
    usersApi.setSearchParamObj({
      userRoleId: 1,
      sortField: 'u.userName',
      sortOrder: 'ASC',
    } as any);
    const response = await usersApi.get(usersApi.getSearchPath());
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toHaveProperty('data');
    if (body.data && body.data.length > 0) {
      for (const user of body.data) {
        expect(user.userRoleId).toBe(1);
      }
    }
  });
});
