export interface Product {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: ProductCategory;
}

export interface ProductCategory {
  usertype: UserType;
  category: string;
}

export interface UserType {
  usertype: string;
}

export interface ProductsListResponse {
  responseCode: number;
  products: Product[];
}

export interface SearchProductResponse {
  responseCode: number;
  products: Product[];
}

export interface ApiErrorResponse {
  responseCode: number;
  message: string;
}
