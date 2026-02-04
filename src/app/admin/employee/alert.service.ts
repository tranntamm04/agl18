import { Injectable } from '@angular/core';
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private toast: ToastrService
  ) { } 
  // @ts-ignore
  showAlertSuccess(message){
    this.toast.success(message, 'Thông báo:');
  }
  // @ts-ignore
  showMessageErrors(message){
    this.toast.error(message, "Thông báo:")
  }
  // @ts-ignore
  showMessageWarring(message){
    this.toast.warning(message, "Thông báo:")
  }
} 
