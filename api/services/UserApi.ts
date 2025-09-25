import { APIRequestContext, APIResponse } from '@playwright/test';
import BaseApi from './BaseApi';

export interface UserSearchParam {
  limit: number;
  offset: number;
  sortField: string;
  sortOrder: string;
}

export class UsersApi extends BaseApi {
  private basePath: string;
  private searchParamObj: UserSearchParam;

  constructor(request: APIRequestContext, baseUrl: string = '') {
    super(request, baseUrl);
    this.request = request;
    this.basePath = '/web/index.php/api/v2/admin/users';
    this.searchParamObj = {
      limit: 50,
      offset: 0,
      sortField: '',
      sortOrder: '',
    };
  }

  setSearchParamObj(searchParam: Partial<UserSearchParam>): void {
    this.searchParamObj = {
      ...this.searchParamObj,
      ...searchParam,
    };
  }

  getSearchParamObj(): UserSearchParam {
    return this.searchParamObj;
  }

  resetParamObj(): void {
    this.searchParamObj = {
      limit: 50,
      offset: 0,
      sortField: '',
      sortOrder: '',
    };
  }

  getSearchPath(): string {
    const { limit, offset, sortField, sortOrder } = this.getSearchParamObj();
    return `${this.basePath}?limit=${limit}&offset=${offset}&sortField=${sortField}&sortOrder=${sortOrder}`;
  }

  async getUsers(): Promise<APIResponse> {
    return this.get(this.getSearchPath());
  }
}
