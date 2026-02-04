import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface RevenueRow { type: string; amount: number; }

@Injectable({ providedIn: 'root' })
export class RevenueService {
  private readonly base = 'http://localhost:8080/api/revenue';
  constructor(private http: HttpClient) {}

  summary(from: string, to: string, typeId?: number): Observable<{ totalRevenue: number }> {
    let params = new HttpParams().set('from', from).set('to', to);
    if (typeId != null) params = params.set('typeId', typeId);
    return this.http.get<{ totalRevenue: number }>(`${this.base}/summary`, { params })
      .pipe(catchError(() => of({ totalRevenue: 0 })));
  }
 
  byType(from: string, to: string, typeId?: number): Observable<RevenueRow[]> {
    let params = new HttpParams().set('from', from).set('to', to);
    if (typeId != null) params = params.set('typeId', typeId);
    return this.http.get<any[]>(`${this.base}/by-type`, { params })
      .pipe(
        map(rows => (rows || []).map(r => ({ type: String(r.type), amount: Number(r.amount) }))),
        catchError(() => of([]))
      );
  }

  debugByType(): Observable<RevenueRow[]> {
    return this.http.get<any[]>(`${this.base}/debug`)
      .pipe(map(rows => (rows || []).map(r => ({ type: String(r.type), amount: Number(r.amount) }))));
  }
}
