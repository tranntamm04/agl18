import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Promotion } from '../interface/Promotion';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  private API_URL = 'http://localhost:8080/api/promotion';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(this.API_URL);
  }

  getById(id: number): Observable<Promotion> {
    return this.http.get<Promotion>(`${this.API_URL}/${id}`);
  }

  create(promotion: Promotion): Observable<Promotion> {
    return this.http.post<Promotion>(this.API_URL, promotion);
  }

  update(id: number, promotion: Promotion): Observable<Promotion> {
    return this.http.put<Promotion>(`${this.API_URL}/${id}`, promotion);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
