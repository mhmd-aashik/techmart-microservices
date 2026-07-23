import { Observable } from 'rxjs';

export type EmptyRequest = object;

export interface CreateProductRequest {
  name: string;
  description: string;
  sku: string;
  price: number;
  stockQuantity: number;
}

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  sku: string;
  price: number;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetProductsResponse {
  products: ProductResponse[];
  meta: PaginationMeta;
}

export interface GetProductByIdRequest {
  id: number;
}

export interface GetProductsRequest {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductServiceClient {
  createProduct(request: CreateProductRequest): Observable<ProductResponse>;
  getProducts(request: GetProductsRequest): Observable<GetProductsResponse>;
  getProductById(request: GetProductByIdRequest): Observable<ProductResponse>;
}
