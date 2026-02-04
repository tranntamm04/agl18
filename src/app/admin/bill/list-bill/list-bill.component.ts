import { Component, OnInit } from '@angular/core';
import {Bill} from "../../../interface/Bill";
import {BillService} from "../../../services/bill.service";
import {MatDialog} from "@angular/material/dialog";
import {DuyetComponent} from "../../duyet/duyet.component";
import {DeleteBillComponent} from "../delete-bill/delete-bill.component";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import { AlertService } from '../../product/alert.service';
import {Title} from "@angular/platform-browser";
import { CommonModule } from '@angular/common';
import { XemchitietComponent } from '../../../home/xemchitiet/xemchitiet.component';
 
@Component({
  selector: 'app-list-bill',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule],
  templateUrl: './list-bill.component.html',
  styleUrls: ['./list-bill.component.css']
})
export class ListBillComponent implements OnInit {
  billList: Bill[] =[];
  private char: string='';
  indexPagination: number=1;
  totalPagination: number=0;
  search!: FormGroup;

  constructor(private billService:BillService,
              private dialog:MatDialog,
              private alertService: AlertService,
              private titleService: Title){ }

  ngOnInit(): void {
    this.titleService.setTitle("Quản Lý Đơn Hàng");
    this.getAll();
    this.search = new FormGroup({
      name: new FormControl('')
    })
  }

  getAll(){
    this.billService.getAll().subscribe((data) =>{
      this.billList= data.content;
      this.totalPagination = data.totalPages;
    });
  }

  delete(id: number) {
    const dialog = this.dialog.open(DeleteBillComponent, {
      width: '500px',
      data: {id: id}
    });
    dialog.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  duyet(id:number) {
    const dialog = this.dialog.open(DuyetComponent, {
      width: '500px',
      data: {id: id}
    });
    dialog.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  xem(idBill: number) {
    const dialog = this.dialog.open(XemchitietComponent, {
      width: '500px',
      height: '500px',
      data: {idBill: idBill}
    });
    dialog.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }
  numToString(num: number) {
    return num.toLocaleString().split(',').join(this.char || '.');
  }

  getPage(number: number) {
    this.billService.getSearchByName(this.search.value.name,number).subscribe((data) =>{
      this.billList= data.content;
      this.indexPagination  = data.pageable.pageNumber + 1;
      this.totalPagination = data.totalPages;
    });
  }

  searchP() {
    this.billService.searchByName(this.search.value.name).subscribe((data) => {
      this.billList= data.content;
      this.totalPagination = data.totalPages;
    },()=> {
      this.alertService.showMessageErrors("Không tìm thấy!");
    })
  }
}
