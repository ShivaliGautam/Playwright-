import { ApiClient } from '../ApiClient';
import {
  ProductsListResponse,
  SearchProductResponse,
  ApiErrorResponse
} from '../types/product.types';

export class ProductsApi {
  private readonly client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  async getProductsList(): Promise<ProductsListResponse> {
    return this.client.get<ProductsListResponse>('/productsList');
  }

  async postProductsList(): Promise<ApiErrorResponse> {
    return this.client.post<ApiErrorResponse>('/productsList', {});
  }

  async searchProduct(searchTerm: string): Promise<SearchProductResponse> {
    return this.client.post<SearchProductResponse>('/searchProduct', {
      search_product: searchTerm
    });
  }

  async searchProductWithoutParam(): Promise<ApiErrorResponse> {
    return this.client.post<ApiErrorResponse>('/searchProduct', {});
  }
}
