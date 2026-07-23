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
}

export interface GetProductByIdRequest {
  id: number;
}

export interface ProductServiceClient {
  createProduct(request: CreateProductRequest): Observable<ProductResponse>;
  getProducts(request: EmptyRequest): Observable<GetProductsResponse>;
  getProductById(request: GetProductByIdRequest): Observable<ProductResponse>;
}
