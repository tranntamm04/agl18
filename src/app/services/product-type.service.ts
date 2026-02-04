import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductType } from '../interface/ProductType';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class ProductTypeService {

  private baseUrl = 'http://localhost:8080/api/productType'; // RESTful controller backend

  constructor(
    private http: HttpClient,
    private loginService: LoginService
  ) { }

  /** Header có JWT */
  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.loginService.token,
      })
    };
  }

  /** Lấy danh sách tất cả danh mục */
  findAllProductType(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(this.baseUrl, this.getHttpOptions());
  }

  /** Lấy chi tiết danh mục theo id */
  getById(id: number): Observable<ProductType> {
    return this.http.get<ProductType>(`${this.baseUrl}/${id}`, this.getHttpOptions());
  }

  /** Tạo mới danh mục */
  create(productType: ProductType): Observable<ProductType> {
    return this.http.post<ProductType>(this.baseUrl, productType, this.getHttpOptions());
  }

  /** Cập nhật danh mục */
  update(id: number, productType: ProductType): Observable<ProductType> {
    return this.http.put<ProductType>(`${this.baseUrl}/${id}`, productType, this.getHttpOptions());
  }

  /** Xóa danh mục */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, this.getHttpOptions());
  }
}
