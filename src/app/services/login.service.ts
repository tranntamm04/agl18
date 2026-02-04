import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private readonly API = 'http://localhost:8080/';
  private readonly ROLE_KEY = 'ROLE';
  private readonly USER_KEY = 'USERNAME';
  private readonly TOKEN_KEY = 'TOKEN';

  constructor(private http: HttpClient, private cookie: CookieService) {}

  login(userName: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API}login`, { userName, password });
  }

  changePassword(username: string, password: string, newPassword: string): Observable<any> {
    return this.http.post<any>(
      `${this.API}change-password`,
      { username, password, newPassword },
      { headers: this.authHeader() }
    );
  }

  saveAuth(token: string, role: string, username: string): void {
    this.cookie.set(this.TOKEN_KEY, token);
    this.cookie.set(this.ROLE_KEY, role);
    this.cookie.set(this.USER_KEY, username);
  }

  get token(): string {
    const token = this.cookie.get(this.TOKEN_KEY);
    return token ? `Bearer ${token}` : '';
  }

  get role(): string {
    return this.cookie.get(this.ROLE_KEY) || '';
  }

  get username(): string {
    return this.cookie.get(this.USER_KEY) || '';
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  logout(): void {
    this.cookie.delete(this.TOKEN_KEY, '/');
    this.cookie.delete(this.ROLE_KEY, '/');
    this.cookie.delete(this.USER_KEY, '/');
    window.location.href = '/';
  }

  authHeader(): HttpHeaders {
    return new HttpHeaders({ Authorization: this.token });
  }
}
