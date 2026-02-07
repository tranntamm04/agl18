import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Bill } from '../../interface/Bill';
import { BillService } from '../../services/bill.service';
import { LoginService } from '../../services/login.service';
import { XemchitietComponent } from '../xemchitiet/xemchitiet.component';
import { CustomerService } from '../../services/customer.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-customer-bill',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './customer-bill.component.html',
  styleUrls: ['./customer-bill.component.css']
})
export class CustomerBillComponent implements OnInit {

  billList: Bill[] = [];

  constructor(
    private billService: BillService,
    private loginService: LoginService,
    private dialog: MatDialog,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    const username = this.loginService.username;

    this.customerService.getCustomerUser(username).subscribe(customer => {
      this.billService.getALLBill(customer.idCustomer).subscribe(bills => {
        this.billList = bills.slice().reverse();
      });
    });
  }


  xem(idBill: number): void {
    const dialogRef = this.dialog.open(XemchitietComponent, {
      width: '500px',
      height: '500px',
      data: { idBill }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  numToString(num: number): string {
    return num.toLocaleString('vi-VN');
  }

}
