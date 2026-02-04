import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TokenStorageService} from "../security/token-storage.service";
import {LoginService} from "./login.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BillService {
 
  httpOptions: any;
  public API_P: string = "http://localhost:8080/api/bill/payment";
  public API: string = "http://localhost:8080/api/bill";
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
  payment(bill:any):Observable<any>{
    return this.http.post<any>(this.API_P,bill,this.httpOptions)
  }
  getAll():Observable<any>{
    return this.http.get<any>(this.API+'/listBill',this.httpOptions);
  }

  getALLBill(id: string):Observable<any>{
    return this.http.get<any>(this.API+"/billDetail/"+ id,this.httpOptions)
  }

  xemChiTiet(id:number):Observable<any>{
    return this.http.get<any>(this.API +'/xem/' +id ,this.httpOptions)
  }

  duyet(id: number): Observable<any> {
    return this.http.put<any>(this.API + '/duyet/' + id, {}, this.httpOptions);
  }

  delete(id:number):Observable<any>{
    return this.http.delete<any>(this.API+'/deleteBill/'+id,this.httpOptions)
  }
  searchByName(name:string):Observable<any>{
    return this.http.get<any>(this.API+'/searchByName?name='+name,this.httpOptions)
  }
  getSearchByName(name:string,page:number):Observable<any>{
    return this.http.get<any>(this.API+'/searchByName?name='+name+'&page=' +page,this.httpOptions)
  }
}
