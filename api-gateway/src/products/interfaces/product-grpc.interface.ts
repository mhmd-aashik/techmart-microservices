import { Observable } from 'rxjs';

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

export interface ProductServiceClient {
  createProduct(request: CreateProductRequest): Observable<ProductResponse>;
}
