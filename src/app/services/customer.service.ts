import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {TokenStorageService} from "../security/token-storage.service";
import {LoginService} from "./login.service";
import {AccountDTO} from "../interface/AccountDTO";
import { Profile } from '../interface/Profile';

@Injectable({
  providedIn: 'root'
}) 
export class CustomerService {

  httpOptions: any;
  public API: string = "http://localhost:8080/api/customer";
  constructor(private http: HttpClient,private tokenStorage: TokenStorageService, private loginService: LoginService) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.loginService.token,
        'Access-Control-Allow-Origin': 'http://localhost:4200',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
      }),
    };
  }
  getAllCustomer(): Observable<any>{
    return this.http.get<any>(this.API+'/listCustomer',this.httpOptions);
  }
  getSearchCustomer(name: string,page: number): Observable<any>{
    return this.http.get<any>(this.API+'/searchCustomer?name='+ name +'&page=' + page,this.httpOptions)
  }
  searchCustomer(name: string): Observable<any>{
    return this.http.get<any>(this.API+'/searchCustomer?name='+ name ,this.httpOptions)
  }
  getCustomerById(id : String): Observable<any>{
    return  this.http.get<any>(this.API+'/viewCustomer/' + id,this.httpOptions)
  }
  getCustomerUser(id : String): Observable<any>{
    return  this.http.get<any>(this.API+'/viewUser/' + id,this.httpOptions)
  }
  deleteCustomer(id: String): Observable<any>{
    return  this.http.delete<any>(this.API +'/deleteCustomer/' + id,this.httpOptions)
  }
    getProfile() {
    return this.http.get<Profile>(`${this.API}/profile`);
  }

  updateProfile(data: Profile) {
    return this.http.put(`${this.API}/profile`, data);
  }
}
