import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Customer} from "../../../interface/Customer";
import {CustomerService} from "../../../services/customer.service";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-customer',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './detail-customer.component.html',
  styleUrls: ['./detail-customer.component.css']
})
export class DetailCustomerComponent implements OnInit {

  id: String ='';
  customer!: Customer;
 
  constructor(private customerService: CustomerService,public dialog: MatDialogRef<DetailCustomerComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any ) {
  }

  ngOnInit(): void {
    this.id = this.data.customerId;
    this.customerService.getCustomerById(this.id).subscribe((data) => {
      this.customer= data;
    })
  }

  close() {
    this.dialog.close()
  }
}
