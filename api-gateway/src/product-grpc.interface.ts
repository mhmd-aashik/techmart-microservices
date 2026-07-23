import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  price: number;
}

export type GetProductsRequest = Record<string, never>;

export interface GetProductsResponse {
  products: Product[];
}

export interface ProductGrpcService {
  getProducts(request: GetProductsRequest): Observable<GetProductsResponse>;
}
