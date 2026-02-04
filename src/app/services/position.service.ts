import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {LoginService} from "./login.service";
 
@Injectable({
  providedIn: 'root'
})
export class PositionService {
  httpOptions: any;
  private baseURL = 'http://localhost:8080/api/employee/listPosition';
  constructor(private http: HttpClient, private loginService: LoginService) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.loginService.token,
        'Access-Control-Allow-Origin': 'http://localhost:4200',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
      }),
    };
  }

  findAllPosition(): Observable<any>{
    return this.http.get<any>(this.baseURL,this.httpOptions);
  }
}
