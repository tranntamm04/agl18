import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { BillService } from '../../services/bill.service';
import { ContractDetail } from '../../interface/ContractDetail';

@Component({
  selector: 'app-xemchitiet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './xemchitiet.component.html',
  styleUrls: ['./xemchitiet.component.css']
})
export class XemchitietComponent implements OnInit {

  list: ContractDetail[] = [];

  constructor(
    private billService: BillService,
    private dialogRef: MatDialogRef<XemchitietComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { idBill: number }
  ) {}

  ngOnInit(): void {
    this.billService.xemChiTiet(this.data.idBill).subscribe(data => {
      this.list = data;
    });
  }

  numToString(num: number): string {
    return num.toLocaleString('vi-VN');
  }

  close(): void {
    this.dialogRef.close();
  }

  getImage(avt: string | null | undefined): string {
    if (!avt) {
      return '/assets/img/17.jpg';
    }
    const base = 'https://res.cloudinary.com/dk9ostjz4/image/upload/';
    return avt.split(';').map(id => base + id)[0];
  }

}
