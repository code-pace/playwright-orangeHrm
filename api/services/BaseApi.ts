import type { APIRequestContext, APIResponse } from '@playwright/test';

export default class BaseApi {
  public baseURL: string;
  public headers: Record<string, string>;
  public request: APIRequestContext;

  constructor(request: APIRequestContext, baseURL = '') {
    this.request = request;
    this.baseURL = baseURL;
    this.headers = { 'Content-Type': 'application/json' };
  }

  setHeaders(headers: Record<string, string>): void {
    this.headers = { ...this.headers, ...headers };
  }

  getHeaders(): Record<string, string> {
    return this.headers;
  }

  resetHeaders(): void {
    this.headers = { 'Content-Type': 'application/json' };
  }

  async get(endpoint: string): Promise<APIResponse> {
    return this.request.get(`${this.baseURL}${endpoint}`, {
      headers: this.getHeaders(),
      failOnStatusCode: false,
    });
  }

  async post(endpoint: string, body?: unknown): Promise<APIResponse> {
    return this.request.post(`${this.baseURL}${endpoint}`, {
      headers: this.getHeaders(),
      failOnStatusCode: false,
      data: body,
    });
  }

  async put(endpoint: string, body?: unknown): Promise<APIResponse> {
    return this.request.put(`${this.baseURL}${endpoint}`, {
      headers: this.getHeaders(),
      failOnStatusCode: false,
      data: body,
    });
  }

  async delete(endpoint: string): Promise<APIResponse> {
    return this.request.delete(`${this.baseURL}${endpoint}`, {
      headers: this.getHeaders(),
      failOnStatusCode: false,
    });
  }
}
