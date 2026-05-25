import { ApiClient } from '../ApiClient';
import { BrandsListResponse, ApiErrorResponse } from '../types/brand.types';

export class BrandsApi {
  private readonly client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  async getBrandsList(): Promise<BrandsListResponse> {
    return this.client.get<BrandsListResponse>('/brandsList');
  }

  async putBrandsList(): Promise<ApiErrorResponse> {
    return this.client.put<ApiErrorResponse>('/brandsList', {});
  }
}
