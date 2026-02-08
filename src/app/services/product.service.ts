import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductDTO } from '../interface/ProductDTO';
import { LoginService } from './login.service';

@Injectable({ providedIn: 'root' })
export class ProductService {
  key = '';
  private readonly API = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient, private loginService: LoginService) {}

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json', Authorization: this.loginService.token });
  }

  getAllProduct(): Observable<any> {
    return this.http.get(this.API, { headers: this.authHeaders() });
  }

  createProduct(product: ProductDTO): Observable<any> {
    return this.http.post(this.API, product, { headers: this.authHeaders() });
  }

  update(product: ProductDTO, id: number): Observable<any> {
    return this.http.put(`${this.API}/${id}`, product, { headers: this.authHeaders() });
  }

  deleteProduct(id: number) {
    return this.http.delete<void>(`${this.API}/${id}`, { headers: this.authHeaders() });
  }

  getAllProductHome(): Observable<any> {
    return this.http.get(this.API);
  }

  getProductById(id: number): Observable<ProductDTO> {
    return this.http.get<ProductDTO>(`${this.API}/${id}`);
  }

  searchItem(keyword: string): Observable<any> {
    return this.http.get(`${this.API}?search=${encodeURIComponent(keyword)}`);
  }

  getSearchProduct(keyword: string, page: number): Observable<any> {
    return this.http.get(`${this.API}?search=${encodeURIComponent(keyword)}&page=${page}`);
  }

  searchItem2(keyword: string): Observable<any> {
    return this.http.get(`${this.API}?search=${encodeURIComponent(keyword)}`);
  }

  getSearchProduct2(keyword: string, page: number): Observable<any> {
    return this.http.get(`${this.API}?search=${encodeURIComponent(keyword)}&page=${page}`);
  }

  getAllBinhLuan(productId: number): Observable<any> {
    return this.http.get(`${this.API}/${productId}/ratings`, { headers: this.authHeaders() });
  }

  getByTypeId(typeId: number): Observable<ProductDTO[]> {
    return this.http.get<ProductDTO[]>(`${this.API}?typeId=${typeId}`);
  }

  importStock(idProduct: number, quantity: number): Observable<void> {
    return this.http.patch<void>(`${this.API}/${idProduct}/stock?quantity=${quantity}`, null, { headers: this.authHeaders() });
  }

  getProductWithPromotion(id: number): Observable<any> {
    return this.http.get<any>(`${this.API}/${id}`);
  }

}
