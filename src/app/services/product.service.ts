import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { ProductDTO } from '../interface/ProductDTO';
import { LoginService } from './login.service';

@Injectable({ providedIn: 'root' })
export class ProductService {
  key = '';

  private readonly API = 'http://localhost:8080/api/product';

  constructor(
    private http: HttpClient,
    private loginService: LoginService
  ) {}

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.loginService.token,
    });
  }

  getAllProduct(): Observable<any> {
    return this.http.get(`${this.API}/listProduct`, {
      headers: this.authHeaders(),
    });
  }

  createProduct(product: ProductDTO): Observable<any> {
    return this.http.post(`${this.API}/createProduct`, product, {
      headers: this.authHeaders(),
    });
  }

  update(product: ProductDTO, id: number): Observable<any> {
    return this.http.put(`${this.API}/updateProduct/${id}`, product, {
      headers: this.authHeaders(),
    });
  }

  deleteProduct(id: number) {
    return this.http.delete<void>(
      `${this.API}/deleteProduct/${id}`,
      { headers: this.authHeaders() }
    );
  }

  getAllProductHome(): Observable<any> {
    return this.http.get(`${this.API}/listHomeProduct`);
  }

  getProductById(id: number): Observable<ProductDTO> {
    return this.http.get<ProductDTO>(`${this.API}/viewProduct/${id}`);
  }

  searchItem(keyword: string): Observable<any> {
    return this.http.get(
      `${this.API}/searchItem?itemSearch=${encodeURIComponent(keyword)}`
    );
  }

  getSearchProduct(keyword: string, page: number): Observable<any> {
    return this.http.get(
      `${this.API}/searchItem?itemSearch=${encodeURIComponent(keyword)}&page=${page}`
    );
  }

  searchItem2(keyword: string): Observable<any> {
    return this.http.get(
      `${this.API}/searchItem2?itemSearch=${encodeURIComponent(keyword)}`
    );
  }

  getSearchProduct2(keyword: string, page: number): Observable<any> {
    return this.http.get(
      `${this.API}/searchItem2?itemSearch=${encodeURIComponent(keyword)}&page=${page}`
    );
  }

  getAllBinhLuan(productId: number): Observable<any> {
    return this.http.get(`${this.API}/getBinhLuan/${productId}`, {
      headers: this.authHeaders(),
    });
  }

  getByCategoryPublic(tag: string): Observable<ProductDTO[]> {
    return this.http
      .get<any>(`${this.API}/searchTag?t=${encodeURIComponent(tag)}`)
      .pipe(map(res => Array.isArray(res) ? res : res?.content ?? []));
  }

  importStock(idProduct: number, quantity: number): Observable<void> {
    return this.http.patch<void>(
      `${this.API}/nhapkho/${idProduct}?quantity=${quantity}`,
      null,
      { headers: this.authHeaders() }
    );
  }

  getProductWithPromotion(id: number) {
    return this.http.get<any>(`${this.API }/viewProductPromotion/${id}`);
  }

}
