import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProductsResponse, Product, Gender } from '../interfaces/product-response.interface';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '@/auth/interfaces/user.interface';

const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {} as User
};

@Injectable({providedIn: 'root'})
export class ProductsService {
  private http = inject(HttpClient);

  private productsCache = new Map<string, ProductsResponse>();
  private productCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductsResponse> {
    const {limit = 12, offset = 0, gender = ''} = options;
    const key = `${limit}-${offset}-${gender}`;

    if(this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);
    }

    return this.http.get<ProductsResponse>(
      `${baseUrl}/products`,
      {
        params: {
          limit: limit,
          offset: offset,
          gender: gender,
        }
      }
    ).pipe(
      tap((resp) => this.productsCache.set(key, resp))
    )
  }

  getProductByIdSlug(idSlug: string): Observable<Product> {
    if(this.productCache.has(idSlug)) {
      return of(this.productCache.get(idSlug)!);
    }

    return this.http.get<Product>(`${environment.baseUrl}/products/${idSlug}`).pipe(
      tap((resp) => this.productCache.set(idSlug, resp))
    )
  }

  getProductById(id: string): Observable<Product> {
    if(id === 'new') {
      return of(emptyProduct);
    }

    if(this.productCache.has(id)) {
      return of(this.productCache.get(id)!);
    }

    return this.http.get<Product>(`${environment.baseUrl}/products/${id}`).pipe(
      tap((resp) => this.productCache.set(id, resp))
    )
  }

  updateProduct(id: string, productLike: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(`${environment.baseUrl}/products/${id}`, productLike).pipe(
      tap((product) => this.updateProductCache(product))
    );
  }

  createProduct(productLike: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${environment.baseUrl}/products`, productLike).pipe(
      tap((product) => this.updateProductCache(product))
    );
  }

  updateProductCache(product: Product) {
    const productId = product.id;

    this.productCache.set(productId, product);

    this.productsCache.forEach((productResponse) => {
      productResponse.products = productResponse.products.map((currentProduct) => {
        return currentProduct.id === productId ? product : currentProduct;
      })
    });
  }
}
