import { Component, OnInit } from '@angular/core';
import {Customer} from "../../../interface/Customer";
import {CustomerService} from "../../../services/customer.service";
import {MatDialog} from "@angular/material/dialog";
import {AlertService} from "../alert.service";
import {DetailCustomerComponent} from "../detail-customer/detail-customer.component";
import {DeleteCustomerComponent} from "../delete-customer/delete-customer.component";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Title} from "@angular/platform-browser";
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-list-customer',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './list-customer.component.html',
  styleUrls: ['./list-customer.component.css']
})
export class ListCustomerComponent implements OnInit {
  totalPagination: number = 0;
  indexPagination: number = 1;
  customerList: Customer[] = [];
  search!: FormGroup;

  constructor(private customerService: CustomerService,
              private dialog: MatDialog,private alertService: AlertService,
              private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle("Quản Lý Khách Hàng");
    this.getList();
    this.search= new FormGroup({
      nameSearch: new FormControl('')
    })
  }
  getList(){
    this.customerService.getAllCustomer().subscribe((data) =>{
      this.customerList= data.content;
      this.totalPagination=data.totalPages;
    })
  }

  view(id: String) {
    const dialog = this.dialog.open(DetailCustomerComponent, {
      width: '500px',
      height: '500px',
      data: {customerId: id}
    });
    dialog.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  delete(idCustomer: String,name: String) {
    const dialog = this.dialog.open(DeleteCustomerComponent, {
      width: '500px',
      data: {customerId: idCustomer,name: name}
    });
    dialog.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  searchP() {
    this.customerService.searchCustomer(this.search.value.nameSearch).subscribe((data) => {
      this.customerList= data.content;
      this.totalPagination=data.totalPages;
    },()=> {
      this.alertService.showMessageErrors("Không tìm thấy!");
    })
  }
  getPage(number: number) {
    this.customerService.getSearchCustomer(this.search.value.nameSearch,number).subscribe((data) => {
      this.customerList= data.content;
      this.indexPagination  = data.pageable.pageNumber + 1;
      this.totalPagination=data.totalPages;
    })
  }
}
