import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RatingDTO } from '../interface/RatingDTO';
import { Rating } from '../interface/Rating';
import { LoginService } from './login.service';


@Injectable({
  providedIn: 'root'
})
export class RatingService {

  private readonly apiUrl = 'http://localhost:8080/api/rating';

  constructor(
    private http: HttpClient,
    private loginService: LoginService
  ) {}

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.loginService.token}`,
    });
  }

  createRating(dto: RatingDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, dto, {
      headers: this.authHeaders(),
    });
  }

  getAllRatings(): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.apiUrl}/all`, {
      headers: this.authHeaders(),
    });
  }

  deleteRating(customerId: string, productId: number) {
    return this.http.delete(`${this.apiUrl}/delete`, {
      headers: this.authHeaders(),
      params: { customerId, productId }
    });
  }

  updateStatus(customerId: string, productId: number, status: number) {
    return this.http.put(`${this.apiUrl}/status`, null, {
      headers: this.authHeaders(),
      params: { customerId, productId, status }
    });
  }
}
