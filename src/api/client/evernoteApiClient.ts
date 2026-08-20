import { APIRequestContext, APIResponse } from '@playwright/test';

export class EvernoteApiClient {
  constructor(private request: APIRequestContext) {}

  async get(url: string, options?: Record<string, unknown>): Promise<APIResponse> {
    return this.request.get(url, options);
  }

  async post(url: string, options?: Record<string, unknown>): Promise<APIResponse> {
    return this.request.post(url, options);
  }

  async delete(url: string, options?: Record<string, unknown>): Promise<APIResponse> {
    return this.request.delete(url, options);
  }
}
