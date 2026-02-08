import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {BillService} from "../../../services/bill.service";
import {AlertService} from "../../employee/alert.service";

@Component({
  selector: 'app-cancel-bill',
  standalone: true,
  imports: [ MatDialogModule],
  templateUrl: './cancel-bill.component.html',
  styleUrls: ['./cancel-bill.component.css']
})
export class CancelBillComponent implements OnInit {
  id: any;

  constructor(
    public dialog: MatDialogRef<CancelBillComponent>,  
    @Inject(MAT_DIALOG_DATA) public data: any,
    private billService: BillService, 
    private alertService: AlertService) { }
 
  ngOnInit(): void {
    this.id= this.data.id;
  }

  close() {
    this.dialog.close();
  }

  cancel() {
    this.billService.cancelBill(this.id).subscribe((data) =>{
      this.dialog.close();
      this.alertService.showAlertSuccess('Huỷ đơn hàng thành công!');
    })
  }
}
