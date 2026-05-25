export interface Brand {
  id: number;
  brand: string;
}

export interface BrandsListResponse {
  responseCode: number;
  brands: Brand[];
}

export interface ApiErrorResponse {
  responseCode: number;
  message: string;
}
