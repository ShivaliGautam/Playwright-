import { APIRequestContext, APIResponse } from '@playwright/test';
import config from '../../config/environments';
import Logger from '../utils/logger';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  formData?: Record<string, string>;
}

export class ApiClient {
  private readonly request: APIRequestContext;
  private readonly baseUrl: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.baseUrl = config.apiBaseUrl;
  }

  private buildUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  private encodeFormData(data: Record<string, string>): string {
    return Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint);
    Logger.info(`GET ${url}`);

    const response: APIResponse = await this.request.get(url, {
      headers: options?.headers,
      params: options?.params
    });

    return this.parseResponse<T>(response, url);
  }

  async post<T>(endpoint: string, payload: Record<string, string>, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint);
    Logger.info(`POST ${url}`);

    const response: APIResponse = await this.request.post(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...options?.headers
      },
      data: this.encodeFormData(payload)
    });

    return this.parseResponse<T>(response, url);
  }

  async put<T>(endpoint: string, payload: Record<string, string>, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint);
    Logger.info(`PUT ${url}`);

    const response: APIResponse = await this.request.put(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...options?.headers
      },
      data: this.encodeFormData(payload)
    });

    return this.parseResponse<T>(response, url);
  }

  async delete<T>(endpoint: string, payload: Record<string, string>, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(endpoint);
    Logger.info(`DELETE ${url}`);

    const response: APIResponse = await this.request.delete(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...options?.headers
      },
      data: this.encodeFormData(payload)
    });

    return this.parseResponse<T>(response, url);
  }

  private async parseResponse<T>(response: APIResponse, url: string): Promise<T> {
    const status = response.status();
    Logger.info(`Response [${status}] from ${url}`);

    const text = await response.text();
    try {
      return JSON.parse(text) as T;
    } catch {
      Logger.error(`Failed to parse JSON from ${url}: ${text}`);
      throw new Error(`Non-JSON response from ${url}: ${text}`);
    }
  }
}
